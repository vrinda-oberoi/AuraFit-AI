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

    shoes: clothingSnapshotSchema,

    accessory: clothingSnapshotSchema,

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