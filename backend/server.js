const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const clothingRoutes = require("./routes/clothingRoutes");
const outfitRoutes = require("./routes/outfitRoutes");
const aiRoutes = require("./routes/aiRoutes");
const plannerRoutes = require("./routes/plannerRoutes");

const connectDB = require("./config/db");

dotenv.config();


connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("AuraFit Backend Running");
});

const PORT = process.env.PORT || 5000;

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/clothes", clothingRoutes);
app.use("/api/outfits", outfitRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/planner", plannerRoutes);
app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});