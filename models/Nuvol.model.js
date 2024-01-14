const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const nuvolSchema = new Schema({
  papallona: String,
  cuc: String,
  userId: { type: Schema.Types.ObjectId, ref: "User" }, // Add this line for user association

  // owner will be added later on
});

module.exports = model("Nuvol", nuvolSchema);
