import prisma from '../config/prisma';
import { calcularPosicaoAtual } from './rotaService';

interface RegistrarCorridaData {
  usuarioId: string;
  kmCorridos: number;
  data?: Date;
  observacao?: string;
}

/**
 * Registrar uma nova corrida
 */
export async function registrarCorrida(data: RegistrarCorridaData) {
  const { usuarioId, kmCorridos, data: dataCorrida, observacao } = data;

  // Validar km
  if (kmCorridos <= 0) {
    throw new Error('A distância deve ser maior que zero');
  }

  if (kmCorridos > 200) {
    throw new Error('Distância muito grande. Máximo: 200km por corrida');
  }

  // Buscar usuário
  const usuario = await prisma.usuario.findUnique({
    where: { id: usuarioId },
    include: {
      cidadeOrigem: true,
      cidadeAtual: true,
    },
  });

  if (!usuario) {
    throw new Error('Usuário não encontrado');
  }

  // Verificar se tem cidade de origem definida
  if (!usuario.cidadeOrigemId) {
    throw new Error('Defina sua cidade de origem antes de registrar corridas');
  }

  // Calcular novo total de km
  const novoKmTotal = usuario.kmTotal + kmCorridos;

  // Calcular nova posição (cidade atual)
  let cidadeAlcancadaId = usuario.cidadeAtualId;
  
  if (usuario.cidadeOrigem) {
    try {
      const novaPosicao = await calcularPosicaoAtual(
        usuario.cidadeOrigem.id,
        novoKmTotal
      );
      cidadeAlcancadaId = novaPosicao.cidadeAtualId;
    } catch (error) {
      console.error('Erro ao calcular posição:', error);
      // Se der erro, mantém a cidade atual
    }
  }

  // Criar corrida e atualizar usuário em uma transação
  const corrida = await prisma.$transaction(async (tx) => {
    // Criar corrida
    const novaCorrida = await tx.corrida.create({
      data: {
        usuarioId,
        kmCorridos,
        data: dataCorrida || new Date(),
        observacao,
        cidadeAlcancadaId,
      },
      include: {
        cidadeAlcancada: {
          select: {
            id: true,
            nome: true,
            estado: true,
            siglaEstado: true,
          },
        },
      },
    });

    // Atualizar km total e cidade atual do usuário
    await tx.usuario.update({
      where: { id: usuarioId },
      data: {
        kmTotal: novoKmTotal,
        cidadeAtualId: cidadeAlcancadaId,
      },
    });

    return novaCorrida;
  });

  return corrida;
}

/**
 * Buscar histórico de corridas do usuário
 */
export async function buscarHistoricoCorridas(
  usuarioId: string,
  limit: number = 50
) {
  const corridas = await prisma.corrida.findMany({
    where: { usuarioId },
    orderBy: { data: 'desc' },
    take: limit,
    include: {
      cidadeAlcancada: {
        select: {
          id: true,
          nome: true,
          estado: true,
          siglaEstado: true,
        },
      },
    },
  });

  return corridas;
}

/**
 * Buscar estatísticas do usuário
 */
export async function buscarEstatisticas(usuarioId: string) {
  const corridas = await prisma.corrida.findMany({
    where: { usuarioId },
    orderBy: { data: 'asc' },
  });

  if (corridas.length === 0) {
    return {
      totalCorridas: 0,
      kmTotal: 0,
      mediaKmPorCorrida: 0,
      maiorCorrida: 0,
      menorCorrida: 0,
      primeiraCorrida: null,
      ultimaCorrida: null,
    };
  }

  const kmTotais = corridas.map((c) => c.kmCorridos);
  const soma = kmTotais.reduce((acc, km) => acc + km, 0);

  return {
    totalCorridas: corridas.length,
    kmTotal: soma,
    mediaKmPorCorrida: parseFloat((soma / corridas.length).toFixed(2)),
    maiorCorrida: Math.max(...kmTotais),
    menorCorrida: Math.min(...kmTotais),
    primeiraCorrida: corridas[0].data,
    ultimaCorrida: corridas[corridas.length - 1].data,
  };
}

/**
 * Deletar uma corrida (e recalcular km total)
 */
export async function deletarCorrida(corridaId: string, usuarioId: string) {
  // Buscar corrida
  const corrida = await prisma.corrida.findFirst({
    where: {
      id: corridaId,
      usuarioId,
    },
  });

  if (!corrida) {
    throw new Error('Corrida não encontrada');
  }

  // Buscar usuário
  const usuario = await prisma.usuario.findUnique({
    where: { id: usuarioId },
  });

  if (!usuario) {
    throw new Error('Usuário não encontrado');
  }

  // Calcular novo total (removendo os km desta corrida)
  const novoKmTotal = Math.max(0, usuario.kmTotal - corrida.kmCorridos);

  // Deletar corrida e atualizar usuário
  await prisma.$transaction(async (tx) => {
    // Deletar corrida
    await tx.corrida.delete({
      where: { id: corridaId },
    });

    // Atualizar km total do usuário
    await tx.usuario.update({
      where: { id: usuarioId },
      data: {
        kmTotal: novoKmTotal,
      },
    });
  });

  // Recalcular cidade atual (opcional, pode ser feito depois)
  return { success: true, novoKmTotal };
}