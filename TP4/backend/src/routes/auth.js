const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const bruteForce = require('../middlewares/bruteforce');

router.post('/login', bruteForce, authController.login);
router.post('/register', authController.register);
router.post('/auth/verify', authController.verifyToken);
router.post('/check-username', authController.checkUsername);

module.exports = router;
