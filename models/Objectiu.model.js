const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const objectiuSchema = new Schema({
  serp: String,
  mico: String,

  // owner will be added later on
});

module.exports = model("Objectiu", objectiuSchema);
