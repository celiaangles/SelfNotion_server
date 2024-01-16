const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const projectSchema = new Schema({
  title: String,
  description: String,
  tasks: [{ type: Schema.Types.ObjectId, ref: "Task" }], //i dont understand why we put this
  userId: { type: Schema.Types.ObjectId, ref: "User" }, // Add this line for user association
  isUrgent: { type: Boolean, default: false }, // Add this line for urgency
});

module.exports = model("Project", projectSchema);
