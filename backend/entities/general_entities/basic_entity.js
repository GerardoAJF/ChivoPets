import { Schema, model } from "mongoose";

class BasicEntity {
    constructor(name, schema) {
        this.name = name;
        this.schema = schema;
        this.schema_fields = Object.keys(this.schema);

        this.model = model(name + "Model", new Schema(schema, {strict: false, timestamps: true}))
    }

    get = async (req, res) => {
        try {
            const entities = await this.model.find();
            return res.status(200).json({ data: entities });

        } catch (error) {
            console.error(error)
            return res.status(500).json({message: "Internal server error"})
        }
    }

    insert = async (req, res) => {
        try {
            this.schema_fields = req.body

            //TODO: código de validación

            const new_entity = new this.model(this.schema_fields)
            await new_entity.save()

            return res.status(200).json({message: this.name + " inserted", data: new_entity})
        } catch (error) {
            console.error(error)
            return res.status(500).json({message: "Internal server error"})
        }
    }

    update = async (req, res) => {
      try {
        this.schema_fields = req.body;

        //TODO: código de validación

        const new_entity = await this.model.findByIdAndUpdate(
            req.params.id, this.schema_fields, {returnDocument: "after"});

        if (!new_entity) return res.status(400).json({message: this.name + " not found"})

        return res
          .status(200)
          .json({ message: this.name + " updated", data: new_entity });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
      }
    }

    delete = async (req, res) => {
        try {
            const deleted_entity = await this.model.findByIdAndDelete(req.params.id, {returnDocument: true})

            if (!deleted_entity) return res.status(400).json({message: this.name + " not found"})
            return res.status(200).json({message: this.name + " deleted", data: deleted_entity})
            
        } catch (error) {
            console.error(error)
            return res.status(500).json({ message: "Internal server error" });
        }
    }

}

export default BasicEntity