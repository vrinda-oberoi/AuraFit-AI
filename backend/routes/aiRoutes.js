const express = require("express");
const upload = require("../config/multer");
const { analyzeClothing } = require("../controllers/aiController");

const router = express.Router();

router.post("/analyze-clothing", upload.single("image"), analyzeClothing);

module.exports = router;