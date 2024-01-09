const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const nuvolSchema = new Schema({
  papallona: String,
  cuc: String,

  // owner will be added later on
});

module.exports = model("Nuvol", nuvolSchema);
