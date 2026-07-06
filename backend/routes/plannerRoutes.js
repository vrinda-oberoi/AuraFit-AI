const express = require("express");
const {
  getPlanner,
  updatePlannerDay,
  clearPlannerDay,
  generateWeek
} = require("../controllers/plannerController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getPlanner);
router.put("/day", protect, updatePlannerDay);
router.delete("/day", protect, clearPlannerDay);
router.post("/generate", protect, generateWeek);

module.exports = router;
