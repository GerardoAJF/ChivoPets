/* PET
name
species
breed
age
ownerId
isActive
*/

import { Schema } from "mongoose";
import BasicEntity from "./general_entities/basic_entity.js"

const schema = {
    name: {type: String},
    species: {type: String},
    breed: {type: String},
    age: {type: Number},
    ownerId: {
        type: Schema.Types.ObjectId,
        ref: "userModel"
    },
    isActive: {type: Boolean}
}
const pet_entity = new BasicEntity("pet", schema)

export default pet_entity;