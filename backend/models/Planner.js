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

const plannerDaySchema = new mongoose.Schema(
  {
    date: {
      type: String, // ISO format date (YYYY-MM-DD)
      required: true,
    },
    dayOfWeek: {
      type: String, // 'Monday', 'Tuesday', etc.
      required: true,
    },
    status: {
      type: String,
      enum: ['Planned', 'Worn', 'Skipped', 'Changed'],
      default: 'Planned',
    },
    occasion: {
      type: String,
      default: 'Casual',
    },
    weather: {
      type: String,
      default: '',
    },
    notes: {
      type: String,
      default: '',
    },
    outfit: {
      top: clothingSnapshotSchema,
      bottom: clothingSnapshotSchema,
      shoes: clothingSnapshotSchema,
      accessory: clothingSnapshotSchema,
      outerwear: clothingSnapshotSchema,
      overallScore: { type: Number, default: 0 },
      explanations: { type: [String], default: [] },
    },
  },
  { _id: true } // Generate an _id for each day so we can target it
);

const plannerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // 1 active planner per user
    },
    weekStartDate: {
      type: String, // YYYY-MM-DD of the Monday of this week
      required: true,
    },
    days: [plannerDaySchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Planner", plannerSchema);
