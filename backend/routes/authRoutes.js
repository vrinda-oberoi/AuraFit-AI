const express = require("express");

const {
  signupUser,
  loginUser,
  changePassword,
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/signup", signupUser);
router.post("/login", loginUser);
router.put("/password", protect, changePassword);

module.exports = router;