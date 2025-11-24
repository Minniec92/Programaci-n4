const { db } = require('../config/database');

const hasSqlInjectionPattern = (value = '') => {
  if (!value) return false;
  const lower = value.toLowerCase();
  return (
    value.includes("'") ||
    lower.includes('--') ||
    value.includes(';') ||
    lower.includes('/*') ||
    lower.includes('*/') ||
    lower.includes(' union ') ||
    lower.includes(' select ') ||
    lower.includes(' information_schema ')
  );
};

const getProducts = (req, res) => {
  const { category, search } = req.query || {};

  if (category && hasSqlInjectionPattern(category)) {
    return res.status(200).json([]);
  }

  if (search && hasSqlInjectionPattern(search)) {
    return res.status(200).json([]);
  }

  let query = 'SELECT * FROM products WHERE 1=1';
  const params = [];

  if (category) {
    query += ' AND category = ?';
    params.push(category);
  }

  if (search) {
    query += ' AND name LIKE ?';
    params.push(`%${search}%`);
  }

  db.query(query, params, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results || []);
  });
};

module.exports = {
  getProducts
};
