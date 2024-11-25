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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtYWluLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qIFZhcmlhYmxlcyAqL1xuY29uc3QgaW5wdXRQYXRpZW50TmFtZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCNpbnB1dF9wYXRpZW50X25hbWVgKTtcbmNvbnN0IGlucHV0T3duZXJOYW1lID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgI2lucHV0X293bmVyX25hbWVgKTtcbmNvbnN0IGlucHV0Q29udGFjdEVtYWlsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgI2lucHV0X2NvbnRhY3RfZW1haWxgKTtcbmNvbnN0IGlucHV0UmVnaXN0cmF0aW9uRGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXG4gIGAjaW5wdXRfcmVnaXN0cmF0aW9uX2RhdGVgXG4pO1xuY29uc3QgaW5wdXRTeW1wdG9tcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCNpbnB1dF9zeW1wdG9tc2ApO1xuY29uc3QgZm9ybUFwcG9pbnRtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgI2Zvcm1fX2FwcG9pbnRtZW50YCk7XG5jb25zdCBmb3JtQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgLmZvcm1fX2J0bmApO1xuY29uc3QgYXBwb2ludG1lbnRMaXN0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgI2FwcG9pbnRtZW50LWxpc3RgKTtcblxubGV0IGVkaXRpbmcgPSBmYWxzZTtcblxuLy8gT2JqZXRvc1xuY29uc3QgYXBwb2ludG1lbnRPYmogPSB7XG4gIGlkOiBnZW5lcmF0ZUlkKCksXG4gIHBhdGllbnRfbmFtZTogYGAsXG4gIG93bmVyX25hbWU6IGBgLFxuICBjb250YWN0X2VtYWlsOiBgYCxcbiAgcmVnaXN0cmF0aW9uX2RhdGU6IGBgLFxuICBzeW1wdG9tczogYGAsXG59O1xuXG4vKiBFdmVudG9zICovXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKGBET01Db250ZW50TG9hZGVkYCwgc3RhcnRBcHApO1xuXG5mdW5jdGlvbiBzdGFydEFwcCgpIHtcbiAgZXZlbnRzKCk7XG59XG5cbmZ1bmN0aW9uIGV2ZW50cygpIHtcbiAgLy8gT2J0ZW5lciBsb3MgZGF0b3MgYWwgcHJlc2lvbmFyIEVOVEVSXG4gIGlucHV0UGF0aWVudE5hbWUuYWRkRXZlbnRMaXN0ZW5lcihgY2hhbmdlYCwgYXBwb2ludG1lbnREYXRhKTtcbiAgaW5wdXRPd25lck5hbWUuYWRkRXZlbnRMaXN0ZW5lcihgY2hhbmdlYCwgYXBwb2ludG1lbnREYXRhKTtcbiAgaW5wdXRDb250YWN0RW1haWwuYWRkRXZlbnRMaXN0ZW5lcihgY2hhbmdlYCwgYXBwb2ludG1lbnREYXRhKTtcbiAgaW5wdXRSZWdpc3RyYXRpb25EYXRlLmFkZEV2ZW50TGlzdGVuZXIoYGNoYW5nZWAsIGFwcG9pbnRtZW50RGF0YSk7XG4gIGlucHV0U3ltcHRvbXMuYWRkRXZlbnRMaXN0ZW5lcihgY2hhbmdlYCwgYXBwb2ludG1lbnREYXRhKTtcblxuICAvLyBFbnZpYXIgbG9zIGRhdG9zIGFsIHByZXNpb25hciBlbCBib3TDs24gZGUgZW52aWFyXG4gIGZvcm1BcHBvaW50bWVudC5hZGRFdmVudExpc3RlbmVyKGBzdWJtaXRgLCBzZW5kQXBwb2ludG1lbnQpO1xufVxuXG4vKiBDbGFzZXMgKi9cbmNsYXNzIE5vdGlmaWNhdGlvbiB7XG4gIGNvbnN0cnVjdG9yKHsgbWVzc2FnZSwgdHlwZSB9KSB7XG4gICAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcbiAgICB0aGlzLnR5cGUgPSB0eXBlO1xuXG4gICAgdGhpcy5zaG93Tm90aWZpY2F0aW9uKCk7XG4gIH1cblxuICBzaG93Tm90aWZpY2F0aW9uKCkge1xuICAgIGNvbnN0IGFsZXJ0Tm90aWZpY2F0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChgUGApO1xuICAgIGFsZXJ0Tm90aWZpY2F0aW9uLmNsYXNzTGlzdC5hZGQoYGFsZXJ0YCk7XG5cbiAgICAvLyBFbGltaW5hciBkdXBsaWNhZGFzXG4gICAgY29uc3QgZXhpc3RpbmdBbGVydE5vdGlmaWNhdGlvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYC5hbGVydGApO1xuXG4gICAgLy8gU2kgZXhpc3RlIGVsIGVsZW1lbnRvLCBlamVjdXRhIGxhIGZ1bmNpb24gcmVtb3ZlXG4gICAgZXhpc3RpbmdBbGVydE5vdGlmaWNhdGlvbj8ucmVtb3ZlKCk7XG5cbiAgICAvLyBTaSBlcyBkZSB0aXBvIGVycm9yIGFncmVnYSBsYSBjbGFzZSBlcnJvciwgc2lubywgc3VjY2Vzc1xuICAgIHRoaXMudHlwZSA9PT0gYGVycm9yYFxuICAgICAgPyBhbGVydE5vdGlmaWNhdGlvbi5jbGFzc0xpc3QuYWRkKGBhbGVydC0tZXJyb3JgKVxuICAgICAgOiBhbGVydE5vdGlmaWNhdGlvbi5jbGFzc0xpc3QuYWRkKGBhbGVydC0tc3VjY2Vzc2ApO1xuXG4gICAgLy8gQWdyZWdhciBlbCBtZW5zYWplIGRlIGVycnJvclxuICAgIGFsZXJ0Tm90aWZpY2F0aW9uLnRleHRDb250ZW50ID0gdGhpcy5tZXNzYWdlO1xuXG4gICAgLy8gSW5zZXJ0YXIgbGEgYWxlcnRhIGVuIGVsIERPTVxuICAgIGxldCBmb3JtQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgLmZvcm1fX2J0bmApO1xuICAgIGZvcm1BcHBvaW50bWVudC5pbnNlcnRCZWZvcmUoYWxlcnROb3RpZmljYXRpb24sIGZvcm1CdG4pO1xuXG4gICAgLy8gRWxpbWluYXIgbGEgYWxlcnRhIGRlc3B1w6lzIGRlIDMgc2VndW5kb3NcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGFsZXJ0Tm90aWZpY2F0aW9uLnJlbW92ZSgpO1xuICAgIH0sIDMwMDApO1xuICB9XG59XG5cbmNsYXNzIEFkbWluQXBwb2ludG1lbnRzIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5hcHBvaW50bWVudHMgPSBbXTtcbiAgfVxuXG4gIC8vIE3DqXRvZG8gcGFyYSBhZ3JlZ2FyIHVuYSBjaXRhIGFsIGFycmF5IGRlIGNpdGFzXG4gIGFkZEFwcG9pbnRtZW50KGFwcG9pbnRtZW50KSB7XG4gICAgdGhpcy5hcHBvaW50bWVudHMgPSBbLi4udGhpcy5hcHBvaW50bWVudHMsIGFwcG9pbnRtZW50XTtcblxuICAgIC8vIE1vc3RyYXIgbGFzIGNpdGFzXG4gICAgdGhpcy5zaG93QXBwb2ludG1lbnRzKCk7XG4gIH1cblxuICAvLyBNw6l0b2RvcyBwYXJhIGVkaXRhciB1bmEgY2l0YVxuICBlZGl0QXBwb2ludG1lbnQoYXBwb2ludG1lbnRVcGRhdGVkKSB7XG4gICAgLy8gQnVzY2FyIGxhIGNpdGEgcG9yIElEIHkgcmVlbXBsYXphcmxhIGNvbiBsYSBudWV2YVxuICAgIHRoaXMuYXBwb2ludG1lbnRzID0gdGhpcy5hcHBvaW50bWVudHMubWFwKChhcHBvaW50bWVudCkgPT5cbiAgICAgIGFwcG9pbnRtZW50LmlkID09PSBhcHBvaW50bWVudFVwZGF0ZWQuaWRcbiAgICAgICAgPyBhcHBvaW50bWVudFVwZGF0ZWRcbiAgICAgICAgOiBhcHBvaW50bWVudFxuICAgICk7XG4gICAgdGhpcy5zaG93QXBwb2ludG1lbnRzKCk7XG4gIH1cblxuICAvLyBNw6l0b2RvcyBwYXJhIGVsaW1pbmFyIHVuYSBjaXRhIGRlbCBhcnJheSBkZSBjaXRhc1xuICBkZWxldGVBcHBvaW50bWVudChpZCkge1xuICAgIHRoaXMuYXBwb2ludG1lbnRzID0gdGhpcy5hcHBvaW50bWVudHMuZmlsdGVyKFxuICAgICAgKGFwcG9pbnRtZW50KSA9PiBhcHBvaW50bWVudC5pZCAhPT0gaWRcbiAgICApO1xuICAgIHRoaXMuc2hvd0FwcG9pbnRtZW50cygpO1xuICB9XG5cbiAgLy8gTcOpdG9kb3MgcGFyYSBtb3N0cmFyIGxhcyBjaXRhcyBlbiBsYSBsaXN0YSBkZSBjaXRhc1xuICBzaG93QXBwb2ludG1lbnRzKCkge1xuICAgIC8vIEVsaW1pbmFyIGxvcyBlbGVtZW50b3MgZGUgbGEgbGlzdGEgcGFyYSBtb3N0cmFyIGxvcyBudWV2b3NcbiAgICB3aGlsZSAoYXBwb2ludG1lbnRMaXN0LmZpcnN0Q2hpbGQpIHtcbiAgICAgIGFwcG9pbnRtZW50TGlzdC5yZW1vdmVDaGlsZChhcHBvaW50bWVudExpc3QuZmlyc3RDaGlsZCk7XG4gICAgfVxuXG4gICAgLy8gQ29tcHJvYmFyIHNpIGhhIGNpdGFzIGV4aXN0ZW50ZXNcbiAgICBpZiAodGhpcy5hcHBvaW50bWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgICBjb25zdCBub0FwcG9pbnRtZW50cyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoYFBgKTtcbiAgICAgIG5vQXBwb2ludG1lbnRzLmNsYXNzTGlzdC5hZGQoYG5vLWFwcG9pbnRtZW50c2ApO1xuICAgICAgbm9BcHBvaW50bWVudHMudGV4dENvbnRlbnQgPSBgTm8gaGF5IGNpdGFzIGFnZW5kYWRhc2A7XG4gICAgICBhcHBvaW50bWVudExpc3QuYXBwZW5kQ2hpbGQobm9BcHBvaW50bWVudHMpO1xuICAgICAgXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gR2VuZXJhciBsYXMgY2l0YXNcbiAgICB0aGlzLmFwcG9pbnRtZW50cy5mb3JFYWNoKChhcHBvaW50bWVudCkgPT4ge1xuICAgICAgY29uc3QgYXBwb2ludG1lbnRJdGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChgTElgKTtcbiAgICAgIGFwcG9pbnRtZW50SXRlbS5jbGFzc0xpc3QuYWRkKGBhcHBvaW50bWVudC1pdGVtYCk7XG4gICAgICBhcHBvaW50bWVudEl0ZW0uaW5uZXJIVE1MID0gYFxuICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYXBwb2ludG1lbnQtaXRlbV9faW5mb1wiPlxuICAgICAgICAgICAgPHAgY2xhc3M9XCJhcHBvaW50bWVudC1pdGVtX19kZXRhaWxcIj5cbiAgICAgICAgICAgICBNYXNjb3RhOlxuICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiYXBwb2ludG1lbnQtaXRlbV9fZGV0YWlsLS12YWx1ZVwiPlxuICAgICAgICAgICAgICAke2FwcG9pbnRtZW50LnBhdGllbnRfbmFtZX1cbiAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICA8cCBjbGFzcz1cImFwcG9pbnRtZW50LWl0ZW1fX2RldGFpbFwiPlxuICAgICAgICAgICAgIFByb3BpZXRhcmlvOlxuICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiYXBwb2ludG1lbnQtaXRlbV9fZGV0YWlsLS12YWx1ZVwiPlxuICAgICAgICAgICAgICAke2FwcG9pbnRtZW50Lm93bmVyX25hbWV9XG4gICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgPHAgY2xhc3M9XCJhcHBvaW50bWVudC1pdGVtX19kZXRhaWxcIj5cbiAgICAgICAgICAgICBDb3JyZW86XG4gICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJhcHBvaW50bWVudC1pdGVtX19kZXRhaWwtLXZhbHVlXCI+XG4gICAgICAgICAgICAgICR7YXBwb2ludG1lbnQuY29udGFjdF9lbWFpbH1cbiAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICA8cCBjbGFzcz1cImFwcG9pbnRtZW50LWl0ZW1fX2RldGFpbFwiPlxuICAgICAgICAgICAgIEZlY2hhIGRlIGFsdGE6XG4gICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJhcHBvaW50bWVudC1pdGVtX19kZXRhaWwtLXZhbHVlXCI+XG4gICAgICAgICAgICAgICR7YXBwb2ludG1lbnQucmVnaXN0cmF0aW9uX2RhdGV9XG4gICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgPHAgY2xhc3M9XCJhcHBvaW50bWVudC1pdGVtX19kZXRhaWxcIj4gXG4gICAgICAgICAgIFPDrW50b21hczpcbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiYXBwb2ludG1lbnQtaXRlbV9fZGV0YWlsLS12YWx1ZVwiPlxuICAgICAgICAgICAgICAke2FwcG9pbnRtZW50LnN5bXB0b21zfVxuICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICA8L3A+XG4gICAgICBgO1xuXG4gICAgICAvLyBBZ3JlZ2FyIGJvdG9uZXMgZGUgZWRpdGFyIHkgYm9ycmFyXG4gICAgICBjb25zdCBidG5FZGl0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChgQlVUVE9OYCk7XG4gICAgICBidG5FZGl0LnRleHRDb250ZW50ID0gYEVkaXRhcmA7XG4gICAgICBidG5FZGl0LmNsYXNzTGlzdC5hZGQoXG4gICAgICAgIGBhcHBvaW50bWVudC1pdGVtX19idG5gLFxuICAgICAgICBgYXBwb2ludG1lbnQtaXRlbV9fYnRuLS1lZGl0YFxuICAgICAgKTtcblxuICAgICAgLy8gQ2xvbmFyIGVsIG9iamV0byBkZSBjaXRhXG4gICAgICBjb25zdCBjbG9uZUFwcG9pbnRtZW50ID0gc3RydWN0dXJlZENsb25lKGFwcG9pbnRtZW50KTtcblxuICAgICAgLy8gQXNpZ25hciBldmVudG8gcGFyYSBlZGl0YXIgYWwgZGFyIGNsaWNrXG4gICAgICBidG5FZGl0Lm9uY2xpY2sgPSAoKSA9PiBsb2FkRWRpdGlvbihjbG9uZUFwcG9pbnRtZW50KTtcblxuICAgICAgY29uc3QgYnRuRGVsZXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChgQlVUVE9OYCk7XG4gICAgICBidG5EZWxldGUudGV4dENvbnRlbnQgPSBgQm9ycmFyYDtcbiAgICAgIGJ0bkRlbGV0ZS5jbGFzc0xpc3QuYWRkKFxuICAgICAgICBgYXBwb2ludG1lbnQtaXRlbV9fYnRuYCxcbiAgICAgICAgYGFwcG9pbnRtZW50LWl0ZW1fX2J0bi0tZGVsZXRlYFxuICAgICAgKTtcblxuICAgICAgLy8gQXNpZ25hciBldmVudG8gcGFyYSBib3JyYXIgYWwgZGFyIGNsaWNrXG4gICAgICBidG5EZWxldGUub25jbGljayA9ICgpID0+IHRoaXMuZGVsZXRlQXBwb2ludG1lbnQoYXBwb2ludG1lbnQuaWQpO1xuXG4gICAgICAvLyBBZ3JlZ2FyIGNvbnRlbmVkb3IgZGUgYm90b25lc1xuICAgICAgY29uc3QgYnRuQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChgRElWYCk7XG4gICAgICBidG5Db250YWluZXIuY2xhc3NMaXN0LmFkZChgYXBwb2ludG1lbnQtaXRlbV9fYnRuLWNvbnRhaW5lcmApO1xuICAgICAgYnRuQ29udGFpbmVyLmFwcGVuZENoaWxkKGJ0bkVkaXQpO1xuICAgICAgYnRuQ29udGFpbmVyLmFwcGVuZENoaWxkKGJ0bkRlbGV0ZSk7XG5cbiAgICAgIC8vIEFncmVnYXIgZWwgYm90w7NuIGRlIGVkaXRhciB5IGJvcnJhciBhbCBpdGVtIGRlIGxhIGxpc3RhXG4gICAgICBhcHBvaW50bWVudEl0ZW0uYXBwZW5kQ2hpbGQoYnRuQ29udGFpbmVyKTtcblxuICAgICAgLy8gQWdyZWdhciBsYSBjaXRhIGEgbGEgbGlzdGFcbiAgICAgIGFwcG9pbnRtZW50TGlzdC5hcHBlbmRDaGlsZChhcHBvaW50bWVudEl0ZW0pO1xuICAgIH0pO1xuICB9XG59XG5cbi8vIEluc3RhbmNpYXNcbmNvbnN0IGFwcG9pbnRtZW50cyA9IG5ldyBBZG1pbkFwcG9pbnRtZW50cygpO1xuXG4vKiBGdW5jaW9uZXMgKi9cbmZ1bmN0aW9uIGFwcG9pbnRtZW50RGF0YShlKSB7XG4gIGUucHJldmVudERlZmF1bHQoKTtcblxuICAvLyBFc2NyaWJpciBsb3MgZGF0b3MgaW5ncmVzYWRvcyBlbiBlbCBvYmpldG8gYXBwb2ludG1lbnRPYmpcbiAgYXBwb2ludG1lbnRPYmpbZS50YXJnZXQubmFtZV0gPSBlLnRhcmdldC52YWx1ZTtcbn1cblxuZnVuY3Rpb24gc2VuZEFwcG9pbnRtZW50KGUpIHtcbiAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gIC8vIFZhbGlkYXIgbG9zIGRhdG9zIGluZ3Jlc2Fkb3NcblxuICAvLyBTaSBoYXkgYWxnw7puIGNhbXBvIHZhY8OtbywgbW9zdHJhciB1biBtZW5zYWplIGRlIGVycm9yIHkgZGV0ZW5lciBlbCBlbnbDrW8gZGVsIGZvcm11bGFyaW9cbiAgaWYgKE9iamVjdC52YWx1ZXMoYXBwb2ludG1lbnRPYmopLnNvbWUoKHZhbHVlKSA9PiB2YWx1ZS50cmltKCkgPT09IGBgKSkge1xuICAgIG5ldyBOb3RpZmljYXRpb24oe1xuICAgICAgbWVzc2FnZTogYFRvZG9zIGxvcyBjYW1wb3Mgc29uIG9ibGlnYXRvcmlvc2AsXG4gICAgICB0eXBlOiBgZXJyb3JgLFxuICAgIH0pO1xuXG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gRWRpdGFyIG8gYWdyZWdhciBsYSBjaXRhIHNlZ8O6biBzZWEgbGEgYWNjacOzblxuICBpZiAoZWRpdGluZykge1xuICAgIC8vIEVkaXRhciBsYSBjaXRhIGVuIGVsIGFycmF5IGRlIGNpdGFzIHkgbW9zdHJhciB1biBtZW5zYWplIGRlIMOpeGl0b1xuICAgIGFwcG9pbnRtZW50cy5lZGl0QXBwb2ludG1lbnQoeyAuLi5hcHBvaW50bWVudE9iaiB9KTtcblxuICAgIG5ldyBOb3RpZmljYXRpb24oe1xuICAgICAgbWVzc2FnZTogYEd1YXJkYWRvIGNvcnJlY3RhbWVudGVgLFxuICAgICAgdHlwZTogYHN1Y2Nlc3NgLFxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIC8vIEVudmlhciBsb3MgZGF0b3MgYWwgYWRtaW5pc3RyYWRvclxuICAgIGFwcG9pbnRtZW50cy5hZGRBcHBvaW50bWVudCh7IC4uLmFwcG9pbnRtZW50T2JqIH0pO1xuXG4gICAgLy8gTW9zdHJhciB1biBtZW5zYWplIGRlIMOpeGl0b1xuICAgIG5ldyBOb3RpZmljYXRpb24oe1xuICAgICAgbWVzc2FnZTogYENpdGEgYWdyZWdhZGEgY29ycmVjdGFtZW50ZWAsXG4gICAgICB0eXBlOiBgc3VjY2Vzc2AsXG4gICAgfSk7XG4gIH1cblxuICAvLyBSZXNldGVhciBlbCBmb3JtdWxhcmlvIHkgZWwgb2JqZXRvXG4gIGZvcm1BcHBvaW50bWVudC5yZXNldCgpO1xuICByZXNldEFwcG9pbnRtZW50T2JqKCk7XG4gIGZvcm1CdG4udmFsdWUgPSBgUmVnaXN0cmFyIHBhY2llbnRlYDtcbiAgZWRpdGluZyA9IGZhbHNlO1xufVxuXG5mdW5jdGlvbiByZXNldEFwcG9pbnRtZW50T2JqKCkge1xuICAvLyBSZXNldGVhciBlbCBvYmpldG8gYXBwb2ludG1lbnRPYmogcGFyYSBxdWUgbm8gY29udGVuZ2EgZGF0b3MgZGUgdW5hIGNpdGEgYW50ZXJpb3JcbiAgT2JqZWN0LmFzc2lnbihhcHBvaW50bWVudE9iaiwge1xuICAgIGlkOiBnZW5lcmF0ZUlkKCksXG4gICAgcGF0aWVudF9uYW1lOiBgYCxcbiAgICBvd25lcl9uYW1lOiBgYCxcbiAgICBjb250YWN0X2VtYWlsOiBgYCxcbiAgICByZWdpc3RyYXRpb25fZGF0ZTogYGAsXG4gICAgc3ltcHRvbXM6IGBgLFxuICB9KTtcbn1cblxuZnVuY3Rpb24gZ2VuZXJhdGVJZCgpIHtcbiAgLy8gR2VuZXJhciB1biBJRCDDum5pY28gcGFyYSBjYWRhIGNpdGEuXG4gIHJldHVybiBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDM2KS5zdWJzdHJpbmcoMikgKyBEYXRlLm5vdygpO1xufVxuXG5mdW5jdGlvbiBsb2FkRWRpdGlvbihhcHBvaW50bWVudCkge1xuICAvLyBDYXJnYXIgbG9zIGRhdG9zIGRlIGxhIGNpdGEgZW4gZWwgb2JqZXRvIGFwcG9pbnRtZW50T2JqIHBhcmEgcXVlIHB1ZWRhIHNlciBlZGl0YWRvXG4gIE9iamVjdC5hc3NpZ24oYXBwb2ludG1lbnRPYmosIGFwcG9pbnRtZW50KTtcblxuICAvLyBDYXJnYXIgbG9zIGRhdG9zIGRlIGxhIGNpdGEgZW4gbG9zIGlucHV0c1xuICBpbnB1dFBhdGllbnROYW1lLnZhbHVlID0gYXBwb2ludG1lbnQucGF0aWVudF9uYW1lO1xuICBpbnB1dE93bmVyTmFtZS52YWx1ZSA9IGFwcG9pbnRtZW50Lm93bmVyX25hbWU7XG4gIGlucHV0Q29udGFjdEVtYWlsLnZhbHVlID0gYXBwb2ludG1lbnQuY29udGFjdF9lbWFpbDtcbiAgaW5wdXRSZWdpc3RyYXRpb25EYXRlLnZhbHVlID0gYXBwb2ludG1lbnQucmVnaXN0cmF0aW9uX2RhdGU7XG4gIGlucHV0U3ltcHRvbXMudmFsdWUgPSBhcHBvaW50bWVudC5zeW1wdG9tcztcblxuICBlZGl0aW5nID0gdHJ1ZTtcblxuICBmb3JtQnRuLnZhbHVlID0gYEd1YXJkYXIgY2FtYmlvc2A7XG59XG4iXSwiZmlsZSI6Im1haW4uanMifQ==
