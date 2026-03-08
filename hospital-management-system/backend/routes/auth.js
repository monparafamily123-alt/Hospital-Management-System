const express = require('express');
const { body } = require('express-validator');
const AuthController = require('../controllers/authController');
const AuthControllerStrictCheck = require('../controllers/authController-strict-check');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

const registerValidation = [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['admin', 'doctor', 'patient']).withMessage('Invalid role')
];

const profileUpdateValidation = [
  body('name').optional().trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').optional().isEmail().withMessage('Please provide a valid email')
];

const loginValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
];

router.post('/register', registerValidation, AuthController.register);
router.post('/login', loginValidation, AuthControllerStrictCheck.login);
router.get('/profile', authenticateToken, AuthControllerStrictCheck.getProfile);
router.put('/profile', authenticateToken, profileUpdateValidation, AuthControllerStrictCheck.updateProfile);

module.exports = router;
