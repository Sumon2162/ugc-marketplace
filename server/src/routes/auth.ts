import express from 'express';
import { body } from 'express-validator';
import { register, login, verifyToken } from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Validation rules
const registerValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('firstName').trim().isLength({ min: 1 }),
  body('lastName').trim().isLength({ min: 1 }),
  body('userType').isIn(['creator', 'client'])
];

const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').exists()
];

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/verify', authenticateToken, verifyToken);

export default router;