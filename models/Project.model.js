const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const projectSchema = new Schema({
  title: String,
  description: String,
  phone: String,

  userId: { type: Schema.Types.ObjectId, ref: "User" },
  isUrgent: { type: Boolean, default: false },
});

module.exports = model("Project", projectSchema);
