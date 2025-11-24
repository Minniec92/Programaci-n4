const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const upload = require('../config/multer');

const deleteFileIfExists = (filePath) => {
  if (filePath && fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
    } catch {}
  }
};

const uploadFile = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No se subió ningún archivo' });
  }

  const filePath = req.file.path;
  const originalName = req.file.originalname || '';
  const ext = path.extname(originalName).toLowerCase();

  const safeNameRegex = /^[a-zA-Z0-9._-]+$/;
  if (!safeNameRegex.test(originalName)) {
    deleteFileIfExists(filePath);
    return res.status(400).json({ error: 'Invalid filename' });
  }

  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.pdf', '.txt'];
  if (!allowedExtensions.includes(ext)) {
    deleteFileIfExists(filePath);
    return res.status(400).json({ error: 'File type not allowed' });
  }

  const maxSize = 5 * 1024 * 1024;
  if (req.file.size > maxSize) {
    deleteFileIfExists(filePath);
    return res.status(413).json({ error: 'File too large' });
  }

  let buffer;
  try {
    buffer = fs.readFileSync(filePath);
  } catch {
    return res.status(500).json({ error: 'Error al procesar el archivo' });
  }

  const contentStr = buffer.toString('utf8');
  if (
    contentStr.includes('<?php') ||
    contentStr.includes('<%') ||
    contentStr.startsWith('MZ')
  ) {
    deleteFileIfExists(filePath);
    return res.status(400).json({ error: 'Invalid file content' });
  }

  const uploadDir = path.dirname(filePath);
  const uniqueName = crypto.randomBytes(16).toString('hex') + ext;
  const newPath = path.join(uploadDir, uniqueName);

  try {
    fs.renameSync(filePath, newPath);
    fs.chmodSync(newPath, 0o644);
  } catch {
    deleteFileIfExists(filePath);
    return res.status(500).json({ error: 'Error al guardar el archivo' });
  }

  res.json({
    message: 'Archivo subido con éxito',
    filename: uniqueName,
    path: `/uploads/${uniqueName}`
  });
};

module.exports = {
  uploadFile,
  uploadMiddleware: upload.single('file')
};
