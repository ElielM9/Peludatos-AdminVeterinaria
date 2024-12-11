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

  // Editar o agregar la cita según sea la acción
  if (editing.value) {
    // Editar la cita en el array de citas y mostrar un mensaje de éxito
    appointments.editAppointment({ ...appointmentObj });

    new Notification({
      message: `Guardado correctamente`,
      type: `success`,
    });
  } else {
    // Enviar los datos al administrador
    appointments.addAppointment({ ...appointmentObj });

    // Mostrar un mensaje de éxito
    new Notification({
      message: `Cita agregada correctamente`,
      type: `success`,
    });
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
