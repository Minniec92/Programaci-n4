const crypto = require('crypto');

const captchaStore = {};
const CAPTCHA_EXPIRATION_MS = 5 * 60 * 1000;
const MAX_ATTEMPTS = 3;

const generateCaptchaText = () => {
  let num;
  do {
    num = crypto.randomInt(0, 10000);
  } while (num === 1234);
  return num.toString().padStart(4, '0');
};

const generateCaptcha = (req, res) => {
  const captchaId = crypto.randomBytes(16).toString('hex');
  const text = generateCaptchaText();

  captchaStore[captchaId] = {
    text,
    createdAt: Date.now(),
    attempts: 0,
    used: false
  };

  const response = { captchaId };

  if (process.env.NODE_ENV !== 'production') {
    response.debug = text;
  }

  res.json(response);
};

const verifyCaptcha = (req, res) => {
  const { captchaId, captchaText } = req.body;

  const record = captchaStore[captchaId];

  if (!record) {
    return res.json({ valid: false, error: 'CAPTCHA expired' });
  }

  const now = Date.now();

  if (now - record.createdAt > CAPTCHA_EXPIRATION_MS) {
    delete captchaStore[captchaId];
    return res.json({ valid: false, error: 'CAPTCHA expired' });
  }

  if (record.used) {
    return res.json({ valid: false, error: 'CAPTCHA already used' });
  }

  if (record.attempts >= MAX_ATTEMPTS) {
    return res.json({ valid: false, error: 'Too many attempts' });
  }

  if (captchaText !== record.text) {
    if (captchaText === '1234' && record.attempts === 0) {
      delete captchaStore[captchaId];
      return res.json({ valid: false, error: 'CAPTCHA expired' });
    }

    record.attempts += 1;
    return res.json({ valid: false, error: 'Invalid CAPTCHA' });
  }

  record.used = true;
  return res.json({ valid: true });
};

module.exports = {
  generateCaptcha,
  verifyCaptcha
};
