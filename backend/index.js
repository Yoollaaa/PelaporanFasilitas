const express = require('express');
const cors = require('cors');
const pool = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
const authRoutes = require('./routes/auth');
const laporanRoutes = require('./routes/laporan');

app.use('/api/auth', authRoutes);
app.use('/api/laporan', laporanRoutes);

pool.connect((err, client, release) => {
  if (err) {
    console.error('Gagal terhubung ke database Supabase!', err.stack);
  } else {
    console.log('Koneksi ke database Supabase berhasil!');
    release(); 
  }
});

app.listen(PORT, () => {
  console.log(`Server Express berjalan di port ${PORT}`);
});