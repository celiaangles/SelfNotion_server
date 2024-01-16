// models/User.model.js

const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userSchema = new Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  urgentedProjects: [{ type: Schema.Types.ObjectId, ref: "Project" }],
  createdProjects: [{ type: Schema.Types.ObjectId, ref: "Project" }],
});

module.exports = model("User", userSchema);
