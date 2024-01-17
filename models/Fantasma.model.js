const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const fantasmaSchema = new Schema({
  title: String,
  description: String,
  nuvol: { type: Schema.Types.ObjectId, ref: "Nuvol" },
});

module.exports = model("Fantasma", fantasmaSchema);
