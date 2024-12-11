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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJjbGFzc2VzL05vdGlmaWNhdGlvbi5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiBJbXBvcnRhY2lvbmVzICovXG5pbXBvcnQgeyBmb3JtQXBwb2ludG1lbnQgfSBmcm9tIFwiLi4vc2VsZWN0b3JzLmpzXCI7XG5cbmV4cG9ydCBjbGFzcyBOb3RpZmljYXRpb24ge1xuICBjb25zdHJ1Y3Rvcih7IG1lc3NhZ2UsIHR5cGUgfSkge1xuICAgIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2U7XG4gICAgdGhpcy50eXBlID0gdHlwZTtcblxuICAgIHRoaXMuc2hvd05vdGlmaWNhdGlvbigpO1xuICB9XG5cbiAgc2hvd05vdGlmaWNhdGlvbigpIHtcbiAgICBjb25zdCBhbGVydE5vdGlmaWNhdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoYFBgKTtcbiAgICBhbGVydE5vdGlmaWNhdGlvbi5jbGFzc0xpc3QuYWRkKGBhbGVydGApO1xuXG4gICAgLy8gRWxpbWluYXIgZHVwbGljYWRhc1xuICAgIGNvbnN0IGV4aXN0aW5nQWxlcnROb3RpZmljYXRpb24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAuYWxlcnRgKTtcblxuICAgIC8vIFNpIGV4aXN0ZSBlbCBlbGVtZW50bywgZWplY3V0YSBsYSBmdW5jaW9uIHJlbW92ZVxuICAgIGV4aXN0aW5nQWxlcnROb3RpZmljYXRpb24/LnJlbW92ZSgpO1xuXG4gICAgLy8gU2kgZXMgZGUgdGlwbyBlcnJvciBhZ3JlZ2EgbGEgY2xhc2UgZXJyb3IsIHNpbm8sIHN1Y2Nlc3NcbiAgICB0aGlzLnR5cGUgPT09IGBlcnJvcmBcbiAgICAgID8gYWxlcnROb3RpZmljYXRpb24uY2xhc3NMaXN0LmFkZChgYWxlcnQtLWVycm9yYClcbiAgICAgIDogYWxlcnROb3RpZmljYXRpb24uY2xhc3NMaXN0LmFkZChgYWxlcnQtLXN1Y2Nlc3NgKTtcblxuICAgIC8vIEFncmVnYXIgZWwgbWVuc2FqZSBkZSBlcnJyb3JcbiAgICBhbGVydE5vdGlmaWNhdGlvbi50ZXh0Q29udGVudCA9IHRoaXMubWVzc2FnZTtcblxuICAgIC8vIEluc2VydGFyIGxhIGFsZXJ0YSBlbiBlbCBET01cbiAgICBsZXQgZm9ybUJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYC5mb3JtX19idG5gKTtcbiAgICBmb3JtQXBwb2ludG1lbnQuaW5zZXJ0QmVmb3JlKGFsZXJ0Tm90aWZpY2F0aW9uLCBmb3JtQnRuKTtcblxuICAgIC8vIEVsaW1pbmFyIGxhIGFsZXJ0YSBkZXNwdcOpcyBkZSAzIHNlZ3VuZG9zXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBhbGVydE5vdGlmaWNhdGlvbi5yZW1vdmUoKTtcbiAgICB9LCAzMDAwKTtcbiAgfVxufVxuIl0sImZpbGUiOiJjbGFzc2VzL05vdGlmaWNhdGlvbi5qcyJ9
