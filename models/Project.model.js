const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const projectSchema = new Schema({
  title: String,
  description: String,
  character: String,
  tasks: [{ type: Schema.Types.ObjectId, ref: "Task" }], //i dont understand why we put this
  // owner will be added later on
});

module.exports = model("Project", projectSchema);
