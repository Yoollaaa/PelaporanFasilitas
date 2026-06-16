const express = require('express');
const multer = require('multer');
const path = require('path'); 
const pool = require('../db');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); 
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

router.post('/', authMiddleware, upload.single('foto'), async (req, res) => {
  try {
    const { user_id, ruangan, deskripsi, latitude, longitude } = req.body;
    const foto = req.file ? req.file.filename : null;

    if (!user_id || !deskripsi) {
      return res.status(400).json({ error: "User ID dan deskripsi kerusakan wajib diisi!" });
    }

   
    const insertQuery = `
      INSERT INTO laporan (user_id, ruangan, deskripsi, foto, latitude, longitude)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    
    const result = await pool.query(insertQuery, [user_id, ruangan, deskripsi, foto, latitude, longitude]);

    res.status(201).json({
      message: "Laporan fasilitas rusak berhasil dikirim!",
      data: result.rows[0]
    });
  } catch (err) {
    console.error("Error saat membuat laporan:", err.message);
    res.status(500).json({ error: "Terjadi kesalahan pada server" });
  }
});

router.get('/', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: "Akses ditolak! Rute ini khusus untuk Admin Sarpras." });
    }

    const query = `
      SELECT laporan.*, users.nama AS nama_pelapor 
      FROM laporan 
      JOIN users ON laporan.user_id = users.id 
      ORDER BY laporan.created_at DESC
    `;
    const result = await pool.query(query);
    
    res.json({
      message: "Berhasil menarik data seluruh laporan",
      data: result.rows
    });
  } catch (err) {
    console.error("Error mengambil laporan:", err.message);
    res.status(500).json({ error: "Terjadi kesalahan pada server" });
  }
});

router.get('/user/:userId', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    
    const query = `
      SELECT laporan.*, users.nama AS nama_pelapor, users.email AS email_pelapor
      FROM laporan 
      JOIN users ON laporan.user_id = users.id 
      WHERE laporan.user_id = $1 
      ORDER BY laporan.created_at DESC
    `;
    const result = await pool.query(query, [userId]);
    
    res.json({ 
      message: "Berhasil menarik riwayat laporan pengguna", 
      data: result.rows 
    });
  } catch (err) {
    console.error("Error mengambil riwayat:", err.message);
    res.status(500).json({ error: "Terjadi kesalahan pada server" });
  }
});

router.patch('/:id/status', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: "Akses ditolak! Anda tidak memiliki otoritas." });
    }

    const { id } = req.params;
    const { status } = req.body; 

    const validStatus = ['Pending', 'Diproses', 'Selesai'];
    if (!validStatus.includes(status)) {
      return res.status(400).json({ error: "Status tidak valid!" });
    }

    const updateQuery = `
      UPDATE laporan 
      SET status = $1 
      WHERE id = $2 
      RETURNING *
    `;
    const result = await pool.query(updateQuery, [status, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Laporan tidak ditemukan" });
    }

    res.json({
      message: "Status laporan berhasil diperbarui",
      data: result.rows[0]
    });
  } catch (err) {
    console.error("Error update status:", err.message);
    res.status(500).json({ error: "Terjadi kesalahan pada server" });
  }
});

module.exports = router;