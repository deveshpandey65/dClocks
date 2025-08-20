const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const upload = require('../middlewares/upload');
// Routes
router.post('/signup', upload.single('companyLogo'), authController.signup);
router.post('/login', authController.login);
router.post('/signout', authController.signOut);

module.exports = router;
