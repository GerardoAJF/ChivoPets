/*SERVICE
name
description
price
isActive
*/

import BasicEntity from "./general_entities/basic_entity.js";

const schema = {
    name: {type: String},
    description: {type: String},
    price: {type: Number},
    isActive: {type: Boolean}
}

const service_entity = new BasicEntity("service", schema)
export default service_entity
