const ClothingItem = require("../models/ClothingItem");

const addClothingItem = async (req, res) => {
  try {
    const image = req.file?.path || "";

    if (req.body.colors) {
    req.body.colors = JSON.parse(req.body.colors);
}
    const clothingItem = await ClothingItem.create({
      user: req.user._id,
      image,
      ...req.body,
    });

    res.status(201).json({
      message: "Clothing item added successfully",
      clothingItem,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const getClothingItems = async (req, res) => {
  try {
    const clothingItems = await ClothingItem.find({
      user: req.user._id,
    });

    res.status(200).json(clothingItems);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateClothingItem = async (req, res) => {
  try {
    const clothingItem = await ClothingItem.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!clothingItem) {
      return res.status(404).json({
        message: "Clothing item not found",
      });
    }
     
    if (req.file) {
     req.body.image = req.file.path;
    }
    if (req.body.colors) {
    req.body.colors = JSON.parse(req.body.colors);
    }
    Object.assign(clothingItem, req.body);

    const updatedItem = await clothingItem.save();

    res.status(200).json({
      message: "Clothing item updated",
      updatedItem,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteClothingItem = async (req, res) => {
  try {
    const clothingItem = await ClothingItem.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!clothingItem) {
      return res.status(404).json({
        message: "Clothing item not found",
      });
    }

    await clothingItem.deleteOne();

    res.status(200).json({
      message: "Clothing item deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  addClothingItem,
  getClothingItems,
  updateClothingItem,
  deleteClothingItem,
};