const Outfit = require("../models/Outfit");

const saveOutfit = async (req, res) => {
  try {
    const outfit = await Outfit.create({
      user: req.user._id,
      ...req.body,
    });

    res.status(201).json(outfit);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getOutfits = async (req, res) => {
  try {
    const outfits = await Outfit.find({
      user: req.user._id,
    }).sort({
      createdAt: -1,
    });

    res.json(outfits);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteOutfit = async (req, res) => {
  try {
    await Outfit.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    res.json({
      message: "Outfit deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  saveOutfit,
  getOutfits,
  deleteOutfit,
};