// routes/foods.js - Lấy dữ liệu món ăn từ database (thay cho dataMonAn hard-code)
const express = require("express");
const pool = require("../db");

const router = express.Router();


router.get("/", async (req, res) => {
  try {
    const { region, search } = req.query;
    let sql = "SELECT * FROM foods WHERE 1=1";
    const params = [];

    if (region && region !== "all") {
      sql += " AND region = ?";
      params.push(region);
    }
    if (search) {
      sql += " AND name LIKE ?";
      params.push(`%${search}%`);
    }
    sql += " ORDER BY id ASC";

    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi server, vui lòng thử lại sau." });
  }
});

// GET /api/foods/:idOrSlug -> chi tiết 1 món (theo id hoặc slug)
router.get("/:idOrSlug", async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    const isNumeric = /^\d+$/.test(idOrSlug);
    const [rows] = await pool.query(
      isNumeric ? "SELECT * FROM foods WHERE id = ?" : "SELECT * FROM foods WHERE slug = ?",
      [idOrSlug]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Không tìm thấy món ăn." });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi server, vui lòng thử lại sau." });
  }
});

module.exports = router;