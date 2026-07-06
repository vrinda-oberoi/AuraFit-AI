const express = require("express");

const {
  updateProfile,
  getProfile,
  deleteAccount,
} = require("../controllers/userController");

const {
  protect,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.delete(
  "/profile",
  protect,
  deleteAccount
);

router.put(
  "/profile",
  protect,
  updateProfile
);

router.get(
  "/profile",
  protect,
  getProfile
);

module.exports = router;