/*VET
name
lastName
email
password
specialty
phone
isAvailable
isVerified
loginAttempts
timeOut
*/

import CredentialsEntity from "./general_entities/credentials_entity.js";

const schema = {
  name: { type: String },
  lastName: { type: String },
  email: { type: String },
  password: { type: String },
  specialty: { type: String },
  phone: { type: String },
  isAvailable: { type: Boolean },
  isVerified: { type: Boolean },
  loginAttempts: { type: Number },
  timeOut: { type: Date },
};

const vet_entity = new CredentialsEntity("vet", schema)

export default vet_entity