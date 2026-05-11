import mongoose from "mongoose";

mongoose.connect("mongodb://localhost:27017/ChivoPets");

const connection = mongoose.connection;

connection.once("open", () => console.log("DB Connected"))
connection.once("disconnected", () => console.log("DB Disconnected"))
connection.once("error", () => console.log("Error in the DB"))

