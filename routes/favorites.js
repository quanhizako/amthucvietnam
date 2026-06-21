const express = require("express");
const pool = require("../db");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();
router.use(requireAuth); // mọi route trong file này đều cần đăng nhập

// GET /api/favorites -> danh sách món yêu thích của user hiện tại
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT f.* FROM foods f
       JOIN favorites fav ON fav.food_id = f.id
       WHERE fav.user_id = ?
       ORDER BY fav.created_at DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi server, vui lòng thử lại sau." });
  }
});

// POST /api/favorites { foodId } -> thêm yêu thích
router.post("/", async (req, res) => {
  try {
    const { foodId } = req.body;
    if (!foodId) return res.status(400).json({ error: "Thiếu foodId." });

    await pool.query(
      "INSERT IGNORE INTO favorites (user_id, food_id) VALUES (?, ?)",
      [req.user.id, foodId]
    );
    res.status(201).json({ message: "Đã thêm vào yêu thích." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi server, vui lòng thử lại sau." });
  }
});

// DELETE /api/favorites/:foodId -> bỏ yêu thích
router.delete("/:foodId", async (req, res) => {
  try {
    await pool.query(
      "DELETE FROM favorites WHERE user_id = ? AND food_id = ?",
      [req.user.id, req.params.foodId]
    );
    res.json({ message: "Đã bỏ yêu thích." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi server, vui lòng thử lại sau." });
  }
});

module.exports = router;