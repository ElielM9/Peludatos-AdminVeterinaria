/* Importaciones */
import { formAppointment } from "../selectors.js";

export class Notification {
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
