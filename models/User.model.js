const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    urgentedProjects: [{ type: Schema.Types.ObjectId, ref: "Project" }],
    createdProjects: [{ type: Schema.Types.ObjectId, ref: "Project" }],
    profilePicture: { type: String },
    bio: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    birthday: {
      type: Date,
      default: null, // You can set a default value or make it optional
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = model("User", userSchema);
