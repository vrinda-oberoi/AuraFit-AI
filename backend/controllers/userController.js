const User = require("../models/User");

const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (req.body.name) {
      user.name = req.body.name;
    }

    if (req.body.height !== undefined) user.height = req.body.height;
    if (req.body.weight !== undefined) user.weight = req.body.weight;
    if (req.body.bodyType !== undefined) user.bodyType = req.body.bodyType;
    if (req.body.stylePreferences !== undefined) user.stylePreferences = req.body.stylePreferences;
    if (req.body.location !== undefined) user.location = req.body.location;

    user.profileCompleted = true;

    const updatedUser = await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    await User.findByIdAndDelete(req.user._id);

    res.status(200).json({
      message: "Account deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  updateProfile,
  getProfile,
  deleteAccount,
};