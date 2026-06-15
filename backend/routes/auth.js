const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db'); 
const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { nama, npm, email, password } = req.body;

    const userExist = await pool.query('SELECT * FROM users WHERE email = $1 OR npm = $2', [email, npm]);
    if (userExist.rows.length > 0) {
      return res.status(400).json({ error: "Email atau NPM sudah terdaftar, silakan gunakan yang lain." });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await pool.query(
      'INSERT INTO users (nama, npm, email, password) VALUES ($1, $2, $3, $4) RETURNING id, nama, npm, email, role',
      [nama, npm, email, hashedPassword]
    );

    res.status(201).json({
      message: "Registrasi akun berhasil!",
      user: newUser.rows[0]
    });

  } catch (err) {
    console.error("Error saat registrasi:", err.message);
    res.status(500).json({ error: "Terjadi kesalahan pada server" });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (user.rows.length === 0) {
      return res.status(400).json({ error: "Email tidak ditemukan. Silakan registrasi terlebih dahulu." });
    }

    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    
    if (!validPassword) {
      return res.status(400).json({ error: "Password yang dimasukkan salah." });
    }

    const token = jwt.sign(
      { id: user.rows[0].id, role: user.rows[0].role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      message: "Login berhasil!",
      token: token,
      user: {
        id: user.rows[0].id,
        nama: user.rows[0].nama,
        email: user.rows[0].email,
        role: user.rows[0].role
      }
    });

  } catch (err) {
    console.error("Error saat login:", err.message);
    res.status(500).json({ error: "Terjadi kesalahan pada server" });
  }
});

router.post('/register-admin', async (req, res) => {
  try {
    const { nama, npm, email, password, admin_key } = req.body;

    if (admin_key !== 'UNILA_SARPRAS_2024') {
      return res.status(403).json({ error: "Kode Rahasia Admin salah!" });
    }
    
    const userExist = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExist.rows.length > 0) {
      return res.status(400).json({ error: "Email sudah terdaftar!" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await pool.query(
      "INSERT INTO users (nama, npm, email, password, role) VALUES ($1, $2, $3, $4, 'admin') RETURNING id, nama, email, role",
      [nama, npm, email, hashedPassword]
    );

    res.status(201).json({
      message: "Akun Admin berhasil dibuat!",
      user: newUser.rows[0]
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Terjadi kesalahan pada server" });
  }
});

module.exports = router;