import jwt from 'jsonwebtoken';
import prisma from '../config/prisma';
import { hashPassword, comparePassword } from '../utils/hashPassword';

interface RegisterData {
  nome: string;
  email: string;
  senha: string;
}

interface LoginData {
  email: string;
  senha: string;
}

interface AuthResponse {
  token: string;
  usuario: {
    id: string;
    nome: string;
    email: string;
    kmTotal: number;
  };
}

/**
 * Registrar novo usuário
 */
export async function registerUser(data: RegisterData): Promise<AuthResponse> {
  const { nome, email, senha } = data;

  // Verificar se o email já existe
  const usuarioExistente = await prisma.usuario.findUnique({
    where: { email },
  });

  if (usuarioExistente) {
    throw new Error('Email já cadastrado');
  }

  // Criptografar senha
  const senhaHash = await hashPassword(senha);

  // Criar usuário
  const usuario = await prisma.usuario.create({
    data: {
      nome,
      email,
      senha: senhaHash,
      kmTotal: 0,
    },
  });

  // Gerar token JWT
  const token = jwt.sign(
    { userId: usuario.id },
    process.env.JWT_SECRET as string,
    { expiresIn: process.env.JWT_EXPIRES_IN as string }
  );

  return {
    token,
    usuario: {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      kmTotal: usuario.kmTotal,
    },
  };
}

/**
 * Login de usuário
 */
export async function loginUser(data: LoginData): Promise<AuthResponse> {
  const { email, senha } = data;

  // Buscar usuário por email
  const usuario = await prisma.usuario.findUnique({
    where: { email },
  });

  if (!usuario) {
    throw new Error('Email ou senha incorretos');
  }

  // Verificar senha
  const senhaValida = await comparePassword(senha, usuario.senha);

  if (!senhaValida) {
    throw new Error('Email ou senha incorretos');
  }

  // Gerar token JWT
  const token = jwt.sign(
    { userId: usuario.id },
    process.env.JWT_SECRET as string,
    { expiresIn: process.env.JWT_EXPIRES_IN as string }
  );

  return {
    token,
    usuario: {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      kmTotal: usuario.kmTotal,
    },
  };
}

/**
 * Buscar usuário pelo ID
 */
export async function getUserById(userId: string) {
  const usuario = await prisma.usuario.findUnique({
    where: { id: userId },
    select: {
      id: true,
      nome: true,
      email: true,
      kmTotal: true,
      cidadeOrigemId: true,
      cidadeAtualId: true,
      createdAt: true,
      cidadeOrigem: {
        select: {
          id: true,
          nome: true,
          estado: true,
          siglaEstado: true,
        },
      },
      cidadeAtual: {
        select: {
          id: true,
          nome: true,
          estado: true,
          siglaEstado: true,
        },
      },
    },
  });

  if (!usuario) {
    throw new Error('Usuário não encontrado');
  }

  return usuario;
}