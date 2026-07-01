const express = require("express");

const {
  saveOutfit,
  getOutfits,
  deleteOutfit,
} = require("../controllers/outfitController");

const {
  protect,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, saveOutfit);

router.get("/", protect, getOutfits);

router.delete("/:id", protect, deleteOutfit);

module.exports = router;