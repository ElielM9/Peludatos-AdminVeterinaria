/* Variables */
const inputPatientName = document.querySelector(`#input_patient_name`);
const inputOwnerName = document.querySelector(`#input_owner_name`);
const inputContactEmail = document.querySelector(`#input_contact_email`);
const inputRegistrationDate = document.querySelector(
  `#input_registration_date`
);
const inputSymptoms = document.querySelector(`#input_symptoms`);
const formAppointment = document.querySelector(`#form__appointment`);
const formBtn = document.querySelector(`.form__btn`);
const appointmentList = document.querySelector(`#appointment-list`);

let editing = false;

// Objetos
const appointmentObj = {
  id: generateId(),
  patient_name: ``,
  owner_name: ``,
  contact_email: ``,
  registration_date: ``,
  symptoms: ``,
};

/* Eventos */
document.addEventListener(`DOMContentLoaded`, startApp);

function startApp() {
  events();
}

function events() {
  // Obtener los datos al presionar ENTER
  inputPatientName.addEventListener(`change`, appointmentData);
  inputOwnerName.addEventListener(`change`, appointmentData);
  inputContactEmail.addEventListener(`change`, appointmentData);
  inputRegistrationDate.addEventListener(`change`, appointmentData);
  inputSymptoms.addEventListener(`change`, appointmentData);

  // Enviar los datos al presionar el botón de enviar
  formAppointment.addEventListener(`submit`, sendAppointment);
}

/* Clases */
class Notification {
  constructor({ message, type }) {
    this.message = message;
    this.type = type;

    this.showNotification();
  }

  showNotification() {
    const alertNotification = document.createElement(`P`);
    alertNotification.classList.add(`alert`);

    // Eliminar duplicadas
    const existingAlertNotification = document.querySelector(`.alert`);

    // Si existe el elemento, ejecuta la funcion remove
    existingAlertNotification?.remove();

    // Si es de tipo error agrega la clase error, sino, success
    this.type === `error`
      ? alertNotification.classList.add(`alert--error`)
      : alertNotification.classList.add(`alert--success`);

    // Agregar el mensaje de errror
    alertNotification.textContent = this.message;

    // Insertar la alerta en el DOM
    let formBtn = document.querySelector(`.form__btn`);
    formAppointment.insertBefore(alertNotification, formBtn);

    // Eliminar la alerta después de 3 segundos
    setTimeout(() => {
      alertNotification.remove();
    }, 3000);
  }
}

class AdminAppointments {
  constructor() {
    this.appointments = [];
  }

  // Método para agregar una cita al array de citas
  addAppointment(appointment) {
    this.appointments = [...this.appointments, appointment];

    // Mostrar las citas
    this.showAppointments();
  }

  // Métodos para editar una cita
  editAppointment(appointmentUpdated) {
    // Buscar la cita por ID y reemplazarla con la nueva
    this.appointments = this.appointments.map((appointment) =>
      appointment.id === appointmentUpdated.id
        ? appointmentUpdated
        : appointment
    );
    this.showAppointments();
  }

  // Métodos para eliminar una cita del array de citas
  deleteAppointment(id) {
    this.appointments = this.appointments.filter(
      (appointment) => appointment.id !== id
    );
    this.showAppointments();
  }

  // Métodos para mostrar las citas en la lista de citas
  showAppointments() {
    // Eliminar los elementos de la lista para mostrar los nuevos
    while (appointmentList.firstChild) {
      appointmentList.removeChild(appointmentList.firstChild);
    }

    // Comprobar si ha citas existentes
    if (this.appointments.length === 0) {
      const noAppointments = document.createElement(`P`);
      noAppointments.classList.add(`no-appointments`);
      noAppointments.textContent = `No hay citas agendadas`;
      appointmentList.appendChild(noAppointments);
      
      return;
    }

    // Generar las citas
    this.appointments.forEach((appointment) => {
      const appointmentItem = document.createElement(`LI`);
      appointmentItem.classList.add(`appointment-item`);
      appointmentItem.innerHTML = `
           <div class="appointment-item__info">
            <p class="appointment-item__detail">
             Mascota:
             <span class="appointment-item__detail--value">
              ${appointment.patient_name}
             </span>
            </p>
            <p class="appointment-item__detail">
             Propietario:
             <span class="appointment-item__detail--value">
              ${appointment.owner_name}
             </span>
            </p>
            <p class="appointment-item__detail">
             Correo:
             <span class="appointment-item__detail--value">
              ${appointment.contact_email}
             </span>
            </p>
            <p class="appointment-item__detail">
             Fecha de alta:
             <span class="appointment-item__detail--value">
              ${appointment.registration_date}
             </span>
            </p>
           </div>
           <p class="appointment-item__detail"> 
           Síntomas:
            <span class="appointment-item__detail--value">
              ${appointment.symptoms}
            </span>
           </p>
      `;

      // Agregar botones de editar y borrar
      const btnEdit = document.createElement(`BUTTON`);
      btnEdit.textContent = `Editar`;
      btnEdit.classList.add(
        `appointment-item__btn`,
        `appointment-item__btn--edit`
      );

      // Clonar el objeto de cita
      const cloneAppointment = structuredClone(appointment);

      // Asignar evento para editar al dar click
      btnEdit.onclick = () => loadEdition(cloneAppointment);

      const btnDelete = document.createElement(`BUTTON`);
      btnDelete.textContent = `Borrar`;
      btnDelete.classList.add(
        `appointment-item__btn`,
        `appointment-item__btn--delete`
      );

      // Asignar evento para borrar al dar click
      btnDelete.onclick = () => this.deleteAppointment(appointment.id);

      // Agregar contenedor de botones
      const btnContainer = document.createElement(`DIV`);
      btnContainer.classList.add(`appointment-item__btn-container`);
      btnContainer.appendChild(btnEdit);
      btnContainer.appendChild(btnDelete);

      // Agregar el botón de editar y borrar al item de la lista
      appointmentItem.appendChild(btnContainer);

      // Agregar la cita a la lista
      appointmentList.appendChild(appointmentItem);
    });
  }
}

// Instancias
const appointments = new AdminAppointments();

/* Funciones */
function appointmentData(e) {
  e.preventDefault();

  // Escribir los datos ingresados en el objeto appointmentObj
  appointmentObj[e.target.name] = e.target.value;
}

function sendAppointment(e) {
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
  if (editing) {
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
  editing = false;
}

function resetAppointmentObj() {
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

function generateId() {
  // Generar un ID único para cada cita.
  return Math.random().toString(36).substring(2) + Date.now();
}

function loadEdition(appointment) {
  // Cargar los datos de la cita en el objeto appointmentObj para que pueda ser editado
  Object.assign(appointmentObj, appointment);

  // Cargar los datos de la cita en los inputs
  inputPatientName.value = appointment.patient_name;
  inputOwnerName.value = appointment.owner_name;
  inputContactEmail.value = appointment.contact_email;
  inputRegistrationDate.value = appointment.registration_date;
  inputSymptoms.value = appointment.symptoms;

  editing = true;

  formBtn.value = `Guardar cambios`;
}
