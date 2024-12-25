/* Importaciones */
import { appointmentList } from "../selectors.js";
import { loadEdition, dataBase } from "../functions.js";

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
    const transaction = dataBase.transaction([`appointments`], `readwrite`);
    const objectStore = transaction.objectStore(`appointments`);
    objectStore.delete(id);

    // Eliminar la cita del objectStore
    transaction.oncomplete = () => {
      console.log(`Cita eliminada correctamente`);

      // Actualizar el array de citas sin la cita eliminada
      this.appointments = this.appointments.filter(
        (appointment) => appointment.id !== id
      );

      // Mostrar las citas actualizadas
      this.showAppointments();
    };

    transaction.onerror = () => {
      console.error(`Error al eliminar la cita`);
    };
  }

  // Métodos para mostrar las citas en la lista de citas
  showAppointments() {
    // Eliminar los elementos de la lista para mostrar los nuevos
    while (appointmentList.firstChild) {
      appointmentList.removeChild(appointmentList.firstChild);
    }

    const objectStore = dataBase
      .transaction(`appointments`)
      .objectStore(`appointments`);

    // Comprobar si hay citas existentes

    const total = objectStore.count();
    total.onsuccess = () => {
      if (total.result === 0) {
        const noAppointmentsMessage = document.createElement(`P`);
        noAppointmentsMessage.textContent = `No hay citas registradas`;
        appointmentList.appendChild(noAppointmentsMessage);

        return;
      }
    };

    objectStore.openCursor().onsuccess = (e) => {
      const cursor = e.target.result;

      if (cursor) {
        const {
          patient_name,
          owner_name,
          contact_email,
          registration_date,
          symptoms,
          id,
        } = cursor.value;

        const appointmentItem = document.createElement(`LI`);
        appointmentItem.dataset.id = id;
        appointmentItem.classList.add(`appointment-item`);
        appointmentItem.innerHTML = `
               <div class="appointment-item__info">
                <p class="appointment-item__detail">
                 Mascota:
                 <span class="appointment-item__detail--value">
                  ${patient_name}
                 </span>
                </p>
                <p class="appointment-item__detail">
                 Propietario:
                 <span class="appointment-item__detail--value">
                  ${owner_name}
                 </span>
                </p>
                <p class="appointment-item__detail">
                 Correo:
                 <span class="appointment-item__detail--value">
                  ${contact_email}
                 </span>
                </p>
                <p class="appointment-item__detail">
                 Fecha de alta:
                 <span class="appointment-item__detail--value">
                  ${registration_date}
                 </span>
                </p>
               </div>
               <p class="appointment-item__detail"> 
               Síntomas:
                <span class="appointment-item__detail--value">
                  ${symptoms}
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

        // Clonar el objeto para que no se modifique en el original
        const cloneAppointment = structuredClone(cursor.value);

        // Asignar evento para editar al dar click
        btnEdit.onclick = () => loadEdition(cloneAppointment);

        const btnDelete = document.createElement(`BUTTON`);
        btnDelete.textContent = `Borrar`;
        btnDelete.classList.add(
          `appointment-item__btn`,
          `appointment-item__btn--delete`
        );

        // Asignar evento para borrar al dar click
        btnDelete.onclick = () => this.deleteAppointment(id);

        // Agregar contenedor de botones
        const btnContainer = document.createElement(`DIV`);
        btnContainer.classList.add(`appointment-item__btn-container`);
        btnContainer.appendChild(btnEdit);
        btnContainer.appendChild(btnDelete);

        // Agregar el botón de editar y borrar al item de la lista
        appointmentItem.appendChild(btnContainer);

        // Agregar la cita a la lista
        appointmentList.appendChild(appointmentItem);

        // Avanzar al siguiente cursor
        cursor.continue();
      }
    };
  }
}
