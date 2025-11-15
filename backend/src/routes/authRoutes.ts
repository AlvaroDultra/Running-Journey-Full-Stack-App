import { Router } from 'express';
import { register, login, getProfile } from '../controllers/authController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

/**
 * @route   POST /auth/register
 * @desc    Cadastrar novo usuário
 * @access  Public
 */
router.post('/register', register);

/**
 * @route   POST /auth/login
 * @desc    Login de usuário
 * @access  Public
 */
router.post('/login', login);

/**
 * @route   GET /auth/me
 * @desc    Buscar perfil do usuário logado
 * @access  Private (requer autenticação)
 */
router.get('/me', authMiddleware, getProfile);

export default router;