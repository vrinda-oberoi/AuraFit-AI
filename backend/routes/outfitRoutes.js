const express = require("express");

const {
  saveOutfit,
  getOutfits,
  deleteOutfit,
  toggleFavorite,
  updateOutfit,
} = require("../controllers/outfitController");

const {
  protect,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.put("/:id", protect, updateOutfit);

router.post("/", protect, saveOutfit);

router.get("/", protect, getOutfits);

router.delete("/:id", protect, deleteOutfit);

router.put("/:id/favorite", protect, toggleFavorite);

module.exports = router;