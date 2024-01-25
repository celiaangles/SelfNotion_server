const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const goblinSchema = new Schema({
  garden: String,
  flower: String,
  nuvol: { type: Schema.Types.ObjectId, ref: "Nuvol" },
});

module.exports = model("Goblin", goblinSchema);
