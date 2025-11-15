import { Request, Response } from 'express';
import { registerUser, loginUser, getUserById } from '../services/authService';

/**
 * Cadastrar novo usuário
 * POST /auth/register
 */
export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { nome, email, senha } = req.body;

    // Validações básicas
    if (!nome || !email || !senha) {
      res.status(400).json({ 
        error: 'Nome, email e senha são obrigatórios' 
      });
      return;
    }

    if (senha.length < 6) {
      res.status(400).json({ 
        error: 'A senha deve ter no mínimo 6 caracteres' 
      });
      return;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ 
        error: 'Email inválido' 
      });
      return;
    }

    const result = await registerUser({ nome, email, senha });

    res.status(201).json(result);
  } catch (error: any) {
    if (error.message === 'Email já cadastrado') {
      res.status(409).json({ error: error.message });
      return;
    }

    console.error('Erro no cadastro:', error);
    res.status(500).json({ error: 'Erro ao cadastrar usuário' });
  }
}

/**
 * Login de usuário
 * POST /auth/login
 */
export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, senha } = req.body;

    // Validações básicas
    if (!email || !senha) {
      res.status(400).json({ 
        error: 'Email e senha são obrigatórios' 
      });
      return;
    }

    const result = await loginUser({ email, senha });

    res.status(200).json(result);
  } catch (error: any) {
    if (error.message === 'Email ou senha incorretos') {
      res.status(401).json({ error: error.message });
      return;
    }

    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
}

/**
 * Buscar perfil do usuário logado
 * GET /auth/me
 */
export async function getProfile(req: Request, res: Response): Promise<void> {
  try {
    // req.userId vem do middleware de autenticação
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ error: 'Não autenticado' });
      return;
    }

    const usuario = await getUserById(userId);

    res.status(200).json(usuario);
  } catch (error: any) {
    if (error.message === 'Usuário não encontrado') {
      res.status(404).json({ error: error.message });
      return;
    }

    console.error('Erro ao buscar perfil:', error);
    res.status(500).json({ error: 'Erro ao buscar perfil' });
  }
}