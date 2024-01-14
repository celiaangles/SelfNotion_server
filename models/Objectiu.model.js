const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const objectiuSchema = new Schema({
  serp: String,
  mico: String,
  userId: { type: Schema.Types.ObjectId, ref: "User" }, // Add this line for user association

  // owner will be added later on
});

module.exports = model("Objectiu", objectiuSchema);
