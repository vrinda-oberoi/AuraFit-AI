const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    profileCompleted: {
      type: Boolean,
      default: false,
    },

    height: {
      type: Number,
    },

    weight: {
      type: Number,
    },

    bodyType: {
      type: String,
    },

    stylePreferences: {
      type: [String],
      default: [],
    },

    location: {
      type: String,
    },

    age: {
      type: Number,
    },

    wardrobeSize: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);