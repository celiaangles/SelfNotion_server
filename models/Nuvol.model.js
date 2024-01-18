const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const nuvolSchema = new Schema({
  papallona: String,
  cuc: String,
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  fantasmes: [{ type: Schema.Types.ObjectId, ref: "Fantasma" }],
});

module.exports = model("Nuvol", nuvolSchema);
