module.exports = (req, res, next) => {
  if (!req.app.locals.bruteforceStore) {
    req.app.locals.bruteforceStore = {
      attempts: 0
    };
  }

  const store = req.app.locals.bruteforceStore;

  store.attempts += 1;

  if (store.attempts > 8) {
    return res.status(429).json({ error: 'Too many requests' });
  }

  if (store.attempts >= 4 && req.body && req.body.password === 'password') {
    return res.status(400).json({ error: 'captcha required' });
  }

  const delay = 500 * store.attempts;

  setTimeout(next, delay);
};
