import { Router } from 'express';
import {
  listarPorEstado,
  buscarPorNome,
  definirOrigem,
} from '../controllers/cidadeController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

/**
 * @route   GET /cidades/estado/:sigla
 * @desc    Listar cidades de um estado
 * @access  Public
 */
router.get('/estado/:sigla', listarPorEstado);

/**
 * @route   GET /cidades/buscar?q=termo
 * @desc    Buscar cidades por nome (autocomplete)
 * @access  Public
 */
router.get('/buscar', buscarPorNome);

/**
 * @route   POST /cidades/origem
 * @desc    Definir cidade de origem do usuário
 * @access  Private (requer autenticação)
 */
router.post('/origem', authMiddleware, definirOrigem);

export default router;