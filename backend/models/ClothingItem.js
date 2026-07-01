const mongoose = require("mongoose");

const clothingItemSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    image: {
      type: String,
      default: "",
    },

    name: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },
     // Legacy field (used by current frontend)
    color: {
      type: String,
      required: true,
    },

    occasion: {
      type: String,
      default: "",
    },

    season: {
      type: String,
      default: "",
    },

    notes: {
      type: String,
      default: "",
    },
    // ---------- AI Metadata ----------

    subCategory: {
      type: String,
      default: "",
    },
   // AI-generated multiple detected colors
    colors: {
      type: [String],
      default: [],
    },

    pattern: {
      type: String,
      default: "",
    },

    fabric: {
      type: String,
      default: "",
    },

    sleeve: {
      type: String,
      default: "",
    },

    neck: {
      type: String,
      default: "",
    },

    fit: {
      type: String,
      default: "",
    },

    length: {
      type: String,
      default: "",
    },

    style: {
      type: String,
      default: "",
    },

    brand: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
    },

    confidence: {
      type: Number,
      default: 0,
    },

    aiGenerated: {
      type: Boolean,
      default: false,
    },

    verifiedByUser: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "ClothingItem",
  clothingItemSchema
);