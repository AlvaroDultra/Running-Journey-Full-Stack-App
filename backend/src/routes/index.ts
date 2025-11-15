import { Router } from 'express';
import authRoutes from './authRoutes';
import corridaRoutes from './corridaRoutes';
import cidadeRoutes from './cidadeRoutes';

const router = Router();

// Rotas de autenticação
router.use('/auth', authRoutes);

// Rotas de corridas
router.use('/corridas', corridaRoutes);

// Rotas de cidades
router.use('/cidades', cidadeRoutes);

// Rota de status da API
router.get('/status', (req, res) => {
  res.json({
    status: 'online',
    message: 'Running Journey API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: '/api/auth',
      corridas: '/api/corridas',
      cidades: '/api/cidades',
    },
  });
});

export default router;