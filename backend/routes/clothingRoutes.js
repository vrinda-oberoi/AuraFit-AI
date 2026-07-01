const express = require("express");
const upload = require("../config/multer");

const {
  addClothingItem,
  getClothingItems,
  updateClothingItem,
  deleteClothingItem,
} = require("../controllers/clothingController");

const {
  protect,
} = require("../middleware/authMiddleware");

const router = express.Router();


router.post(
  "/",
  protect,
  upload.single("image"),
  addClothingItem
);
router.get("/", protect, getClothingItems);
router.put(
  "/:id",
  protect,
  upload.single("image"),
  updateClothingItem
);
router.delete("/:id", protect, deleteClothingItem);
module.exports = router;