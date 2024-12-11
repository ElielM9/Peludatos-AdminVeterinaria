/* Importaciones */
import { appointmentList } from "../selectors.js";
import { loadEdition } from "../functions.js";

export class AdminAppointments {
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
