const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const bruixaSchema = new Schema({
  gat: String,
  peix: Date, // Change the type to Date
  nuvol: { type: Schema.Types.ObjectId, ref: "Nuvol" },
});

module.exports = model("Bruixa", bruixaSchema);
