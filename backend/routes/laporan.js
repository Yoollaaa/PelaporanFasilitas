const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary'); 
const cloudinaryStorage = require('multer-storage-cloudinary'); 
const pool = require('../db');
const router = express.Router();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = cloudinaryStorage({
  cloudinary: cloudinary, 
  allowedFormats: ['jpg', 'png', 'jpeg']
});

const upload = multer({ storage: storage });


router.post('/', upload.single('foto'), async (req, res) => {
  try {
    console.log("Data foto dari Cloudinary:", req.file); 
    
    const { user_id, deskripsi, latitude, longitude } = req.body;
    
    const foto_url = req.file ? (req.file.secure_url || req.file.url || req.file.path) : null;

    if (!user_id || !deskripsi) {
      return res.status(400).json({ error: "User ID dan deskripsi kerusakan wajib diisi!" });
    }

    const insertQuery = `
      INSERT INTO laporan (user_id, deskripsi, foto_url, latitude, longitude)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    
    const result = await pool.query(insertQuery, [user_id, deskripsi, foto_url, latitude, longitude]);

    res.status(201).json({
      message: "Laporan fasilitas rusak berhasil dikirim dan tersimpan di database!",
      data: result.rows[0]
    });
  } catch (err) {
    console.error("Error saat membuat laporan:", err.message);
    res.status(500).json({ error: "Terjadi kesalahan pada server saat memproses laporan" });
  }
});

router.get('/', async (req, res) => {
  try {
    const query = `
      SELECT laporan.*, users.nama AS nama_pelapor 
      FROM laporan 
      JOIN users ON laporan.user_id = users.id 
      ORDER BY laporan.created_at DESC
    `;
    const result = await pool.query(query);
    
    res.json({
      message: "Berhasil menarik data laporan",
      data: result.rows
    });
  } catch (err) {
    console.error("Error mengambil laporan:", err.message);
    res.status(500).json({ error: "Terjadi kesalahan pada server" });
  }
});

router.patch('/:id/status', async (req, res) => {
  try {
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