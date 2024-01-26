const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const objectiuSchema = new Schema({
  serp: String,
  mico: String,
  mussol: String,
  userId: { type: Schema.Types.ObjectId, ref: "User" },
});

module.exports = model("Objectiu", objectiuSchema);
