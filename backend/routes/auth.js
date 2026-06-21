// routes/auth.js - Đăng ký / Đăng nhập
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../db");

const router = express.Router();

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || username.trim().length < 3) {
      return res.status(400).json({ error: "Tên đăng nhập phải có ít nhất 3 ký tự." });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ error: "Mật khẩu phải có ít nhất 6 ký tự." });
    }

    const [existing] = await pool.query(
      "SELECT id FROM users WHERE username = ?",
      [username.trim()]
    );
    if (existing.length > 0) {
      return res.status(409).json({ error: "Tên đăng nhập đã tồn tại." });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)",
      [username.trim(), (email || "").trim(), passwordHash]
    );

    const token = jwt.sign(
      { id: result.insertId, username: username.trim() },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({ token, username: username.trim() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi server, vui lòng thử lại sau." });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "Vui lòng nhập tên đăng nhập và mật khẩu." });
    }

    const [rows] = await pool.query(
      "SELECT * FROM users WHERE username = ?",
      [username.trim()]
    );
    const user = rows[0];
    if (!user) {
      return res.status(401).json({ error: "Tài khoản không tồn tại." });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: "Sai mật khẩu." });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, username: user.username });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi server, vui lòng thử lại sau." });
  }
});

module.exports = router;