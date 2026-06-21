require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const foodsRoutes = require("./routes/foods");
const favoritesRoutes = require("./routes/favorites");

const app = express();

app.use(cors()); 
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/foods", foodsRoutes);
app.use("/api/favorites", favoritesRoutes);

app.get("/api/health", (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Backend đang chạy tại http://localhost:${PORT}`);
});