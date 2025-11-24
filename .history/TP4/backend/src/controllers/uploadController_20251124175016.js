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

// Middleware antes de multer
const validateFilenameMiddleware = (req, res, next) => {
  // El nombre real llega en el header de form-data
  const filename =
    req.headers['content-disposition']?.match(/filename="(.+?)"/)?.[1] ||
    '';

  if (dangerousName(filename)) {
    return res.status(400).json({ error: 'Invalid filename' });
  }

  next();
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
    const unique = crypto.randomBytes(16).toString('hex');
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, unique + ext);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }
}).single('file');


const uploadFile = (req, res) => {
  let filePath = null;

  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    filePath = req.file.path;
    const originalName = req.file.originalname;
    const ext = path.extname(originalName).toLowerCase();

    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.pdf', '.txt'];
    if (!allowedExtensions.includes(ext)) {
      fs.unlinkSync(filePath);
      return res.status(400).json({ error: 'File type not allowed' });
    }

    const buffer = fs.readFileSync(filePath);
    const text = buffer.toString();

    if (text.includes('<?php') || text.includes('<%') || text.startsWith('MZ')) {
      fs.unlinkSync(filePath);
      return res.status(400).json({ error: 'Invalid file content' });
    }

    fs.chmodSync(filePath, 0o644);

    res.json({
      message: 'Archivo subido con éxito',
      filename: req.file.filename
    });
  } catch (err) {
    if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath);
    return res.status(400).json({ error: 'Invalid filename' });
  }
};

module.exports = {
  validateFilenameMiddleware,
  uploadMiddleware: upload,
  uploadFile
};
