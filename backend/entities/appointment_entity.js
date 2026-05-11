/*APPOINTMENT
petId
vetId
serviceId
date
time
status 
*/

import BasicEntity from "./general_entities/basic_entity.js";
import { Schema } from "mongoose";

const schema = {
    petId: {
        type: Schema.Types.ObjectId,
        ref: "petModel"
    },
    vetId: {
        type: Schema.Types.ObjectId,
        ref: "vetModel"
    },
    serviceId: {
        type: Schema.Types.ObjectId,
        ref: "serviceModel"
    },
    date: {type: Date},
    time: {type: Number},
    status: {type: String}
}

const appointment_entity = new BasicEntity("appointment", schema)
export default appointment_entity
