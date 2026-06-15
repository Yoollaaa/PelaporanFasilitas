const express = require('express');
const cors = require('cors');
const pool = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const path = require('path');

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth'); 
app.use('/api/auth', authRoutes);

const laporanRoutes = require('./routes/laporan');

app.use('/api/auth', authRoutes);
app.use('/api/laporan', laporanRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

pool.connect((err, client, release) => {
  if (err) {
    console.error('Gagal terhubung ke database Supabase!', err.stack);
  } else {
    console.log('Koneksi ke database Supabase berhasil!');
    release(); 
  }
});

app.listen(5000, '0.0.0.0', () => {
  console.log('Server berjalan di port 5000');
});