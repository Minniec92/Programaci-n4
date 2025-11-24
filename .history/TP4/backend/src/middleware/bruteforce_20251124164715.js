const attempts = {};
const delayAttempts = {};
const captchaRequired = {};

module.exports = (req, res, next) => {
  const ip = req.ip;
  const now = Date.now();

  if (!attempts[ip]) attempts[ip] = [];
  attempts[ip] = attempts[ip].filter(t => now - t < 60000);
  attempts[ip].push(now);

  if (attempts[ip].length > 10) {
    return res.status(429).json({ error: 'Too many requests' });
  }

  if (!delayAttempts[ip]) delayAttempts[ip] = 0;
  delayAttempts[ip]++;
  const delay = Math.min(2 ** delayAttempts[ip], 8) * 100;
  
  const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

  if (!captchaRequired[ip]) captchaRequired[ip] = false;
  
  if (delayAttempts[ip] >= 3) {
    captchaRequired[ip] = true;
  }

  if (captchaRequired[ip] === true) {
    return res.status(400).json({ error: 'captcha required' });
  }

  wait(delay).then(next);
};
