const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// Optional: Public test route (before auth middleware)
router.get('/test', (req, res) => {
  res.json({ msg: 'User route works!' });
});

// All routes below require authentication
router.use(authMiddleware);

// Protected test route
router.get('/protected-test', (req, res) => {
  res.json({ msg: 'Protected route works!', user: req.user });
});

// @route   PUT /api/user/update-email
// @desc    Update user's email
// @access  Private
router.put('/update-email', userController.updateEmail);

// @route   PUT /api/user/update-password
// @desc    Update user's password
// @access  Private
router.put('/update-password', userController.updatePassword);

module.exports = router;
