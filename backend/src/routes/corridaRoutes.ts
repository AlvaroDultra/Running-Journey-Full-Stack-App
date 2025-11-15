import { Router } from 'express';
import {
  registrar,
  historico,
  estatisticas,
  deletar,
} from '../controllers/corridaController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

// Todas as rotas de corrida são protegidas (requerem autenticação)
router.use(authMiddleware);

/**
 * @route   POST /corridas
 * @desc    Registrar nova corrida
 * @access  Private
 */
router.post('/', registrar);

/**
 * @route   GET /corridas/historico
 * @desc    Buscar histórico de corridas
 * @access  Private
 */
router.get('/historico', historico);

/**
 * @route   GET /corridas/estatisticas
 * @desc    Buscar estatísticas do usuário
 * @access  Private
 */
router.get('/estatisticas', estatisticas);

/**
 * @route   DELETE /corridas/:id
 * @desc    Deletar uma corrida
 * @access  Private
 */
router.delete('/:id', deletar);

export default router;