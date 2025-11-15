import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Estender o tipo Request para incluir userId
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

interface TokenPayload {
  userId: string;
  iat: number;
  exp: number;
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const { authorization } = req.headers;

  // Verificar se o token foi enviado
  if (!authorization) {
    res.status(401).json({ error: 'Token não fornecido' });
    return;
  }

  // Token vem no formato: "Bearer TOKEN"
  const [, token] = authorization.split(' ');

  try {
    // Verificar e decodificar o token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'secret'
    ) as TokenPayload;

    // Adicionar userId ao request para usar nas rotas
    req.userId = decoded.userId;

    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido ou expirado' });
    return;
  }
}