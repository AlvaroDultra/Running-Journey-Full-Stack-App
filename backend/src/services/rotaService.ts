import axios from 'axios';
import prisma from '../config/prisma';

interface Coordenadas {
  latitude: number;
  longitude: number;
}

interface SegmentoRota {
  distanciaAcumulada: number;
  cidadeId: string;
  cidadeNome: string;
  coordenadas: Coordenadas;
}

/**
 * Calcular posição atual do usuário baseado nos km corridos
 */
export async function calcularPosicaoAtual(
  cidadeOrigemId: string,
  kmPercorridos: number
) {
  // Buscar cidade de origem
  const cidadeOrigem = await prisma.cidade.findUnique({
    where: { id: cidadeOrigemId },
  });

  if (!cidadeOrigem) {
    throw new Error('Cidade de origem não encontrada');
  }

  // Se não correu nada, está na cidade de origem
  if (kmPercorridos === 0) {
    return {
      cidadeAtualId: cidadeOrigem.id,
      cidadeAtual: cidadeOrigem,
      distanciaPercorrida: 0,
      progresso: 0,
    };
  }

  // Buscar ou criar trajeto padrão (vamos usar uma rota fixa para MVP)
  // Por enquanto, vamos calcular a distância em linha reta para cidades próximas
  const cidadeAtual = await encontrarCidadeMaisProxima(
    cidadeOrigem,
    kmPercorridos
  );

  return {
    cidadeAtualId: cidadeAtual.id,
    cidadeAtual,
    distanciaPercorrida: kmPercorridos,
    progresso: 100, // Pode ser calculado baseado em uma meta
  };
}

/**
 * Encontrar cidade mais próxima baseado nos km percorridos
 * (Implementação simplificada - pode ser melhorada com rotas reais)
 */
async function encontrarCidadeMaisProxima(
  cidadeOrigem: any,
  kmPercorridos: number
) {
  // Buscar cidades do mesmo estado
  const cidades = await prisma.cidade.findMany({
    where: {
      siglaEstado: cidadeOrigem.siglaEstado,
      NOT: {
        id: cidadeOrigem.id,
      },
    },
  });

  // Se não tem outras cidades cadastradas, retorna a origem
  if (cidades.length === 0) {
    return cidadeOrigem;
  }

  // Calcular distância em linha reta para cada cidade
  const cidadesComDistancia = cidades.map((cidade) => {
    const distancia = calcularDistanciaHaversine(
      cidadeOrigem.latitude,
      cidadeOrigem.longitude,
      cidade.latitude,
      cidade.longitude
    );

    return {
      ...cidade,
      distancia,
    };
  });

  // Ordenar por distância
  cidadesComDistancia.sort((a, b) => a.distancia - b.distancia);

  // Encontrar a cidade mais próxima que está dentro da distância percorrida
  let cidadeAtual = cidadeOrigem;

  for (const cidade of cidadesComDistancia) {
    if (kmPercorridos >= cidade.distancia) {
      cidadeAtual = cidade;
    } else {
      break;
    }
  }

  return cidadeAtual;
}

/**
 * Calcular distância entre dois pontos usando fórmula de Haversine
 * Retorna distância em km
 */
function calcularDistanciaHaversine(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Raio da Terra em km
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distancia = R * c;

  return parseFloat(distancia.toFixed(2));
}

/**
 * Converter graus para radianos
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Calcular rota completa entre duas cidades usando OpenRouteService
 * (Função avançada - requer API key)
 */
export async function calcularRotaCompleta(
  cidadeOrigemId: string,
  cidadeDestinoId: string
) {
  const cidadeOrigem = await prisma.cidade.findUnique({
    where: { id: cidadeOrigemId },
  });

  const cidadeDestino = await prisma.cidade.findUnique({
    where: { id: cidadeDestinoId },
  });

  if (!cidadeOrigem || !cidadeDestino) {
    throw new Error('Cidades não encontradas');
  }

  // Se não tem API key do OpenRouteService, usar cálculo simples
  if (!process.env.OPENROUTE_API_KEY) {
    const distancia = calcularDistanciaHaversine(
      cidadeOrigem.latitude,
      cidadeOrigem.longitude,
      cidadeDestino.latitude,
      cidadeDestino.longitude
    );

    return {
      distanciaTotal: distancia,
      origem: cidadeOrigem,
      destino: cidadeDestino,
      rota: [
        {
          latitude: cidadeOrigem.latitude,
          longitude: cidadeOrigem.longitude,
        },
        {
          latitude: cidadeDestino.latitude,
          longitude: cidadeDestino.longitude,
        },
      ],
    };
  }

  // Usar OpenRouteService para calcular rota real
  try {
    const response = await axios.post(
      'https://api.openrouteservice.org/v2/directions/driving-car',
      {
        coordinates: [
          [cidadeOrigem.longitude, cidadeOrigem.latitude],
          [cidadeDestino.longitude, cidadeDestino.latitude],
        ],
      },
      {
        headers: {
          Authorization: process.env.OPENROUTE_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );

    const distanciaMetros = response.data.routes[0].summary.distance;
    const distanciaKm = parseFloat((distanciaMetros / 1000).toFixed(2));
    const coordenadas = response.data.routes[0].geometry.coordinates;

    return {
      distanciaTotal: distanciaKm,
      origem: cidadeOrigem,
      destino: cidadeDestino,
      rota: coordenadas.map((coord: number[]) => ({
        longitude: coord[0],
        latitude: coord[1],
      })),
    };
  } catch (error) {
    console.error('Erro ao calcular rota com OpenRouteService:', error);
    
    // Fallback para cálculo simples
    const distancia = calcularDistanciaHaversine(
      cidadeOrigem.latitude,
      cidadeOrigem.longitude,
      cidadeDestino.latitude,
      cidadeDestino.longitude
    );

    return {
      distanciaTotal: distancia,
      origem: cidadeOrigem,
      destino: cidadeDestino,
      rota: [
        {
          latitude: cidadeOrigem.latitude,
          longitude: cidadeOrigem.longitude,
        },
        {
          latitude: cidadeDestino.latitude,
          longitude: cidadeDestino.longitude,
        },
      ],
    };
  }
}

/**
 * Definir cidade de origem para o usuário
 */
export async function definirCidadeOrigem(
  usuarioId: string,
  cidadeId: string
) {
  const cidade = await prisma.cidade.findUnique({
    where: { id: cidadeId },
  });

  if (!cidade) {
    throw new Error('Cidade não encontrada');
  }

  // Atualizar usuário
  const usuario = await prisma.usuario.update({
    where: { id: usuarioId },
    data: {
      cidadeOrigemId: cidadeId,
      cidadeAtualId: cidadeId, // Começa na cidade de origem
    },
    include: {
      cidadeOrigem: true,
      cidadeAtual: true,
    },
  });

  return usuario;
}