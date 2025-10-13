const express = require('express');
const router = express.Router();
const passwordController = require('../controllers/passwordController');
const authMiddleware = require('../middleware/authMiddleware');

// Apply auth middleware to all routes in this file
router.use(authMiddleware);

// @route   GET api/passwords
// @desc    Get all passwords for a user
// @access  Private
router.get('/', passwordController.getPasswords);

// @route   POST api/passwords
// @desc    Add a new password
// @access  Private
router.post('/', passwordController.addPassword);

// @route   PUT api/passwords/:id
// @desc    Update a password
// @access  Private
router.put('/:id', passwordController.updatePassword);

// @route   DELETE api/passwords/:id
// @desc    Delete a password
// @access  Private
router.delete('/:id', passwordController.deletePassword);

module.exports = router;