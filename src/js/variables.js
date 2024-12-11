/* Importaciones */
import { generateId } from "./functions.js";

let editing = {
  value: false,
};

const appointmentObj = {
  id: generateId(),
  patient_name: ``,
  owner_name: ``,
  contact_email: ``,
  registration_date: ``,
  symptoms: ``,
};

export { editing, appointmentObj };
