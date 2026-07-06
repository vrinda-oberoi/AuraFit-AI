const Outfit = require("../models/Outfit");

const saveOutfit = async (req, res) => {
  try {
    const payload = { ...req.body };
    // Map footwear to shoes in db to ensure legacy compatibility
    if (payload.footwear && !payload.shoes) {
      payload.shoes = payload.footwear;
    }

    const outfit = await Outfit.create({
      user: req.user._id,
      ...payload,
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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const outfits = await Outfit.find({
      user: req.user._id,
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json(outfits);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const toggleFavorite = async (req, res) => {
  try {
    const outfit = await Outfit.findOne({ _id: req.params.id, user: req.user._id });
    if (!outfit) {
      return res.status(404).json({ message: "Outfit not found" });
    }
    
    outfit.favorite = !outfit.favorite;
    await outfit.save();

    res.json(outfit);
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

const updateOutfit = async (req, res) => {
  try {
    const outfit = await Outfit.findOne({ _id: req.params.id, user: req.user._id });
    if (!outfit) {
      return res.status(404).json({ message: "Outfit not found" });
    }
    
    if (req.body.name) {
      outfit.name = req.body.name;
    }
    
    // Add additional updateable fields as needed in the future

    await outfit.save();
    res.json(outfit);
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
  toggleFavorite,
  updateOutfit,
};