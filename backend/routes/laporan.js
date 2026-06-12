const express = require('express');
const pool = require('../db');
const router = express.Router();

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