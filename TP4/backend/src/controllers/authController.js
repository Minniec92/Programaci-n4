const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db } = require('../config/database');

const usernameCheckAttempts = {};

const getClientIp = (req) => {
  const xf = req.headers['x-forwarded-for'];
  if (xf && typeof xf === 'string') {
    return xf.split(',')[0].trim();
  }
  return req.ip || 'unknown';
};

const hasSqlInjectionPattern = (value = '') => {
  if (!value) return false;
  const lower = value.toLowerCase();
  return (
    value.includes("'") ||
    lower.includes('--') ||
    value.includes(';') ||
    lower.includes('/*') ||
    lower.includes('*/') ||
    lower.includes(' sleep(') ||
    lower.includes(' union ') ||
    lower.includes(' select ') ||
    lower.includes(' information_schema ') ||
    lower.includes(' or ')
  );
};

// Login
const login = async (req, res) => {
  const { username, password } = req.body;

  const query = 'SELECT * FROM users WHERE username = ?';

  db.query(query, [username], async (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error en el servidor' });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const user = results[0];
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET || 'supersecret123'
    );

    res.json({ token, username: user.username });
  });
};

const register = async (req, res) => {
  const { username, password, email } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const query = 'INSERT INTO users (username, password, email) VALUES (?, ?, ?)';
  db.query(query, [username, hashedPassword, email], (err) => {
    if (err) {
      return res.status(500).json({ error: 'Error al registrar usuario' });
    }
    res.json({ message: 'Usuario registrado con éxito' });
  });
};

const verifyToken = (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecret123');
    req.session.userId = decoded.id;
    res.json({ valid: true, user: decoded });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Blind SQL Injection seguro
const checkUsername = (req, res) => {
  const { username } = req.body || {};
  const ip = getClientIp(req);

  if (!usernameCheckAttempts[ip]) {
    usernameCheckAttempts[ip] = 0;
  }
  usernameCheckAttempts[ip] += 1;

  if (usernameCheckAttempts[ip] > 10) {
    return res.status(429).json({ error: 'Too many attempts' });
  }

  if (!username || !/^[a-zA-Z0-9_]{3,20}$/.test(username) || hasSqlInjectionPattern(username)) {
    return res.status(200).json({ exists: false });
  }

  const query = 'SELECT COUNT(*) as count FROM users WHERE username = ?';

  db.query(query, [username], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(200).json({ exists: false });
    }

    const count = results && results[0] && results[0].count ? results[0].count : 0;
    const exists = count > 0;
    res.json({ exists });
  });
};

module.exports = {
  login,
  register,
  verifyToken,
  checkUsername
};
