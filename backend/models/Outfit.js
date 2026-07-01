const mongoose = require("mongoose");

const clothingSnapshotSchema = new mongoose.Schema(
  {
    _id: String,
    name: String,
    image: String,
    category: String,
    color: String,
  },
  { _id: false }
);

const outfitSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      default: "Generated Outfit",
    },

    top: clothingSnapshotSchema,
    bottom: clothingSnapshotSchema,
    shoes: clothingSnapshotSchema, // Keep for backward compatibility
    footwear: clothingSnapshotSchema, // New slot matching frontend
    accessory: clothingSnapshotSchema,
    outerwear: clothingSnapshotSchema, // New slot matching frontend

    overallScore: {
      type: Number,
      default: 0,
    },

    explanations: {
      type: [String],
      default: [],
    },

    destination: {
      type: String,
      default: "",
    },

    avatarData: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    occasion: String,

    weather: String,

    favorite: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Outfit", outfitSchema);