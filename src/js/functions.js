/* Importaciones */
import { appointmentObj, editing } from "./variables.js";
import { Notification } from "./classes/Notification.js";
import { AdminAppointments } from "./classes/AdminAppointments.js";
import {
  formAppointment,
  formBtn,
  inputPatientName,
  inputOwnerName,
  inputContactEmail,
  inputRegistrationDate,
  inputSymptoms,
} from "./selectors.js";

// Instanciar la clase AdminAppointments
const appointments = new AdminAppointments();

export function appointmentData(e) {
  e.preventDefault();

  // Escribir los datos ingresados en el objeto appointmentObj
  appointmentObj[e.target.name] = e.target.value;
}

export function sendAppointment(e) {
  e.preventDefault();

  // Validar los datos ingresados

  // Si hay algún campo vacío, mostrar un mensaje de error y detener el envío del formulario
  if (Object.values(appointmentObj).some((value) => value.trim() === ``)) {
    new Notification({
      message: `Todos los campos son obligatorios`,
      type: `error`,
    });

    return;
  }

  // Si editing.value es verdadero, entra en modo edición, caso contrario, agrega la cita normnalmente
  if (editing.value) {
    const transaction = dataBase.transaction([`appointments`], `readwrite`);
    const objectStore = transaction.objectStore(`appointments`);

    // Actualizar la cita en el objectStore
    const request = objectStore.put(appointmentObj);

    transaction.oncomplete = () => {
      // Editar la cita en el array de citas
      appointments.editAppointment({ ...appointmentObj });

      // Mostrar un mensaje de éxito
      new Notification({
        message: `Cita editada correctamente`,
        type: `success`,
      });
    };
  } else {
    // Guardar los datos en IndexedDB para persistencia
    const transaction = dataBase.transaction([`appointments`], `readwrite`);
    const objectStore = transaction.objectStore(`appointments`);

    // Agregar la cita al objectStore
    const request = objectStore.add(appointmentObj);

    transaction.oncomplete = () => {
      // Enviar los datos al administrador
      appointments.addAppointment({ ...appointmentObj });

      // Mostrar un mensaje de éxito
      new Notification({
        message: `Cita agregada correctamente`,
        type: `success`,
      });
    };

    transaction.onerror = () => {
      // Mostrar un mensaje de error en caso de un error en IndexedDB
      new Notification({
        message: `Error al agregar la cita`,
        type: `error`,
      });
    };
  }

  // Resetear el formulario y el objeto
  formAppointment.reset();
  resetAppointmentObj();
  formBtn.value = `Registrar paciente`;
  editing.value = false;
}

export function resetAppointmentObj() {
  // Resetear el objeto appointmentObj para que no contenga datos de una cita anterior
  Object.assign(appointmentObj, {
    id: generateId(),
    patient_name: ``,
    owner_name: ``,
    contact_email: ``,
    registration_date: ``,
    symptoms: ``,
  });
}

export function generateId() {
  // Generar un ID único para cada cita.
  return Math.random().toString(36).substring(2) + Date.now();
}

export function loadEdition(appointment) {
  // Cargar los datos de la cita en el objeto appointmentObj para que pueda ser editado
  Object.assign(appointmentObj, appointment);

  // Cargar los datos de la cita en los inputs
  inputPatientName.value = appointment.patient_name;
  inputOwnerName.value = appointment.owner_name;
  inputContactEmail.value = appointment.contact_email;
  inputRegistrationDate.value = appointment.registration_date;
  inputSymptoms.value = appointment.symptoms;

  editing.value = true;

  formBtn.value = `Guardar cambios`;
}

/* Base de datos */
export let dataBase;
export function createDB() {
  // Crear la base de datos en IndexedDB
  const createDB = window.indexedDB.open(`appointments`, 1.0);

  // Si existen errores
  createDB.onerror = () => {
    console.error(`Error al crear la base de datos`);
  };

  // Si sale bien
  createDB.onsuccess = () => {
    // console.log(`Base de datos creada exitosamente`);

    // Obtener la base de datos
    dataBase = createDB.result;

    // Cargar las citas desde IndexedDB
    appointments.showAppointments();
  };

  // Definir el schema
  createDB.onupgradeneeded = (e) => {
    const db = e.target.result;

    // Crear el objeto store para las citas en IndexedDB
    const objectStore = db.createObjectStore(`appointments`, {
      keyPath: `id`,
      autoIncrement: true,
    });

    // Crear las columnas
    objectStore.createIndex(`patient_name`, `patient_name`, { unique: false });
    objectStore.createIndex(`owner_name`, `owner_name`, { unique: false });
    objectStore.createIndex(`contact_email`, `contact_email`, {
      unique: false,
    });
    objectStore.createIndex(`registration_date`, `registration_date`, {
      unique: false,
    });
    objectStore.createIndex(`symptoms`, `symptoms`, { unique: false });
    objectStore.createIndex(`id`, `id`, { unique: true });

    // console.log(`Schema de la base de datos creado exitosamente`);
  };
}
