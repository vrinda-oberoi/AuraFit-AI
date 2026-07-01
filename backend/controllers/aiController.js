const { analyzeClothingImage } = require("../services/ai/vision.service");

const analyzeClothing = async (req, res) => {
  try {
    if (!req.file || !req.file.path) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    const data = await analyzeClothingImage(req.file.path);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  analyzeClothing,
};