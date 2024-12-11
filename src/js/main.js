/* Importaciones */
import {
  inputPatientName,
  inputOwnerName,
  inputContactEmail,
  inputRegistrationDate,
  inputSymptoms,
  formAppointment,
} from "./selectors.js";
import { appointmentData, sendAppointment } from "./functions.js";

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
