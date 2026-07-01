const User = require("../models/User");

const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.height = req.body.height;
    user.weight = req.body.weight;
    user.bodyType = req.body.bodyType;
    user.stylePreferences =
      req.body.stylePreferences;
    user.location = req.body.location;

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

module.exports = {
  updateProfile,
};