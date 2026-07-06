const express = require("express");
const upload = require("../config/multer");
const { analyzeClothing, generateOutfit } = require("../controllers/aiController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/analyze-clothing", upload.single("image"), analyzeClothing);
router.post("/generate", protect, generateOutfit);

module.exports = router;