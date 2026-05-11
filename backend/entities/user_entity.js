/* USER
name
lastName
email
password
phone
address
isActive
isVerified
loginAttempts
timeOut
*/

import CredentialsEntity from "./general_entities/credentials_entity.js";

const schema = {
    name: {type: String},
    lastName: {type: String},
    email: {type: String},
    password: {type: String},
    phone: {type: String},
    address: {type: String},
    isActive: {type: Boolean},
    isVerified: {type: Boolean},
    loginAttempts: {type: Number},
    timeOut: {type: Date}
};
const user_entity = new CredentialsEntity("user", schema);

export default user_entity