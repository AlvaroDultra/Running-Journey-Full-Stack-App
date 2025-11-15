import { Request, Response } from 'express';
import {
  findOrCreateCidade,
  listarCidadesPorEstado,
  buscarCidadesPorNome,
} from '../services/cidadeService';
import { definirCidadeOrigem } from '../services/rotaService';

/**
 * Buscar cidades de um estado
 * GET /cidades/estado/:sigla
 */
export async function listarPorEstado(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { sigla } = req.params;

    if (!sigla || sigla.length !== 2) {
      res.status(400).json({ 
        error: 'Informe a sigla do estado (ex: BA, SP)' 
      });
      return;
    }

    const cidades = await listarCidadesPorEstado(sigla);

    res.status(200).json(cidades);
  } catch (error: any) {
    console.error('Erro ao listar cidades:', error);
    res.status(500).json({ error: 'Erro ao buscar cidades' });
  }
}

/**
 * Buscar cidades por nome (autocomplete)
 * GET /cidades/buscar?q=termo
 */
export async function buscarPorNome(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { q } = req.query;

    if (!q || (q as string).length < 2) {
      res.status(400).json({ 
        error: 'Informe no mínimo 2 caracteres para buscar' 
      });
      return;
    }

    const cidades = await buscarCidadesPorNome(q as string);

    res.status(200).json(cidades);
  } catch (error: any) {
    console.error('Erro ao buscar cidades:', error);
    res.status(500).json({ error: 'Erro ao buscar cidades' });
  }
}

/**
 * Definir cidade de origem do usuário
 * POST /cidades/origem
 */
export async function definirOrigem(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const userId = req.userId;
    const { nome, siglaEstado } = req.body;

    if (!userId) {
      res.status(401).json({ error: 'Não autenticado' });
      return;
    }

    if (!nome || !siglaEstado) {
      res.status(400).json({ 
        error: 'Informe o nome da cidade e sigla do estado' 
      });
      return;
    }

    // Buscar ou criar cidade
    const cidade = await findOrCreateCidade(nome, siglaEstado);

    // Definir como origem do usuário
    const usuario = await definirCidadeOrigem(userId, cidade.id);

    res.status(200).json({
      message: 'Cidade de origem definida com sucesso',
      usuario,
    });
  } catch (error: any) {
    console.error('Erro ao definir cidade de origem:', error);

    if (error.message.includes('não encontrada')) {
      res.status(404).json({ error: error.message });
      return;
    }

    res.status(500).json({ error: 'Erro ao definir cidade de origem' });
  }
}