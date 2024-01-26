const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const goblinSchema = new Schema({
  garden: String,
  flower: {
    data: Buffer, // Binary data for the image
    contentType: String, // Mime type of the image
  },
  nuvol: { type: Schema.Types.ObjectId, ref: "Nuvol" },
});

module.exports = model("Goblin", goblinSchema);
