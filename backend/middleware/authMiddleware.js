const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const authHeader = req.header('Authorization');
  
  if (!authHeader) {
    return res.status(401).json({ error: 'Akses ditolak! Token tidak ditemukan.' });
  }

  const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    
    req.user = verified; 
    
    next();
  } catch (err) {
    res.status(403).json({ error: 'Token tidak valid atau sudah kedaluwarsa!' });
  }
};