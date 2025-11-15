import { Request, Response } from 'express';
import {
  registrarCorrida,
  buscarHistoricoCorridas,
  buscarEstatisticas,
  deletarCorrida,
} from '../services/corridaService';

/**
 * Registrar nova corrida
 * POST /corridas
 */
export async function registrar(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.userId;
    const { kmCorridos, data, observacao } = req.body;

    if (!userId) {
      res.status(401).json({ error: 'Não autenticado' });
      return;
    }

    // Validações
    if (!kmCorridos || kmCorridos <= 0) {
      res.status(400).json({ 
        error: 'Informe a distância percorrida (km)' 
      });
      return;
    }

    const corridaData = {
      usuarioId: userId,
      kmCorridos: parseFloat(kmCorridos),
      data: data ? new Date(data) : undefined,
      observacao,
    };

    const corrida = await registrarCorrida(corridaData);

    res.status(201).json(corrida);
  } catch (error: any) {
    console.error('Erro ao registrar corrida:', error);
    
    if (
      error.message === 'Defina sua cidade de origem antes de registrar corridas'
    ) {
      res.status(400).json({ error: error.message });
      return;
    }

    if (error.message.includes('Distância')) {
      res.status(400).json({ error: error.message });
      return;
    }

    res.status(500).json({ error: 'Erro ao registrar corrida' });
  }
}

/**
 * Buscar histórico de corridas
 * GET /corridas/historico
 */
export async function historico(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.userId;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;

    if (!userId) {
      res.status(401).json({ error: 'Não autenticado' });
      return;
    }

    const corridas = await buscarHistoricoCorridas(userId, limit);

    res.status(200).json(corridas);
  } catch (error: any) {
    console.error('Erro ao buscar histórico:', error);
    res.status(500).json({ error: 'Erro ao buscar histórico de corridas' });
  }
}

/**
 * Buscar estatísticas do usuário
 * GET /corridas/estatisticas
 */
export async function estatisticas(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ error: 'Não autenticado' });
      return;
    }

    const stats = await buscarEstatisticas(userId);

    res.status(200).json(stats);
  } catch (error: any) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ error: 'Erro ao buscar estatísticas' });
  }
}

/**
 * Deletar corrida
 * DELETE /corridas/:id
 */
export async function deletar(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.userId;
    const { id } = req.params;

    if (!userId) {
      res.status(401).json({ error: 'Não autenticado' });
      return;
    }

    const result = await deletarCorrida(id, userId);

    res.status(200).json({
      message: 'Corrida deletada com sucesso',
      ...result,
    });
  } catch (error: any) {
    console.error('Erro ao deletar corrida:', error);

    if (error.message === 'Corrida não encontrada') {
      res.status(404).json({ error: error.message });
      return;
    }

    res.status(500).json({ error: 'Erro ao deletar corrida' });
  }
}