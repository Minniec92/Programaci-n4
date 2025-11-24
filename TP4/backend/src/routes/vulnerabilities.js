const express = require('express');
const router = express.Router();
const vulnerabilityController = require('../controllers/vulnerabilityController');
const { uploadMiddleware, uploadFile } = require('../controllers/uploadController');

router.post('/ping', vulnerabilityController.ping);
router.post('/transfer', vulnerabilityController.transfer);
router.get('/file', vulnerabilityController.readFile);
router.post('/upload', uploadMiddleware, uploadFile);
router.get('/csrf-token', vulnerabilityController.getCsrfToken);

module.exports = router;
