const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const commentSchema = new Schema({
  text: String,
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  // Add other necessary fields like timestamps, etc.
});

module.exports = model("Comment", commentSchema);
