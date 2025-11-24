const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const multer = require('multer');

const dangerousName = (name) => {
  if (!name) return true;

  const lower = name.toLowerCase();

  if (
    name.includes('..') ||
    name.includes('/') ||
    name.includes('\\') ||
    name.includes('\x00') ||
    lower.includes('%00') ||
    name.includes(';')
  ) {
    return true;
  }

  const safeRegex = /^[a-zA-Z0-9._-]+$/;
  if (!safeRegex.test(name)) return true;

  return false;
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const unique = crypto.randomBytes(16).toString('hex');
    cb(null, unique + ext);
  }
});

const fileFilter = (req, file, cb) => {
  if (dangerousName(file.originalname)) {
    return cb(new Error('INVALID_FILENAME'));
  }
  cb(null, true);
};

const baseUpload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter
}).single('file');

const uploadMiddleware = (req, res, next) => {
  baseUpload(req, res, (err) => {
    if (err) {
      if (err.message === 'INVALID_FILENAME') {
        return res.status(400).json({ error: 'Invalid filename' });
      }
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({ error: 'File too large' });
      }
      return res.status(400).json({ error: 'Invalid filename' });
    }
    next();
  });
};

const uploadFile = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const filePath = req.file.path;
  const originalName = req.file.originalname || '';
  const ext = path.extname(originalName).toLowerCase();

  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.pdf', '.txt'];
  if (!allowedExtensions.includes(ext)) {
    fs.unlinkSync(filePath);
    return res.status(400).json({ error: 'File type not allowed' });
  }

  const buffer = fs.readFileSync(filePath);
  const text = buffer.toString('utf8');

  if (text.includes('<?php') || text.includes('<%') || text.startsWith('MZ')) {
    fs.unlinkSync(filePath);
    return res.status(400).json({ error: 'Invalid file content' });
  }

  fs.chmodSync(filePath, 0o644);

  res.json({
    message: 'Archivo subido con éxito',
    filename: req.file.filename
  });
};

module.exports = {
  uploadMiddleware,
  uploadFile
};
