const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true, unique: true, trim: true },
    passwordHash: { type: String, required: true },
    passwordSalt: { type: String },
    role: { type: String, default: "user" },
    token: {
      type: String,
    },
    online: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
