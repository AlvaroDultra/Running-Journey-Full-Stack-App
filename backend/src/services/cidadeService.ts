import axios from 'axios';
import prisma from '../config/prisma';

interface IBGECidade {
  id: number;
  nome: string;
  microrregiao: {
    mesorregiao: {
      UF: {
        sigla: string;
        nome: string;
      };
    };
  };
}

interface CidadeData {
  nome: string;
  estado: string;
  siglaEstado: string;
  latitude: number;
  longitude: number;
  populacao?: number;
}

/**
 * Buscar cidade no banco ou criar se não existir
 */
export async function findOrCreateCidade(
  nome: string,
  siglaEstado: string
): Promise<any> {
  // Buscar cidade existente
  let cidade = await prisma.cidade.findFirst({
    where: {
      nome: {
        equals: nome,
        mode: 'insensitive', // Case insensitive
      },
      siglaEstado: siglaEstado.toUpperCase(),
    },
  });

  // Se não existir, buscar na API do IBGE e criar
  if (!cidade) {
    const cidadeIBGE = await buscarCidadeIBGE(nome, siglaEstado);
    
    if (!cidadeIBGE) {
      throw new Error(`Cidade ${nome}-${siglaEstado} não encontrada`);
    }

    cidade = await prisma.cidade.create({
      data: cidadeIBGE,
    });
  }

  return cidade;
}

/**
 * Buscar cidade na API do IBGE
 */
async function buscarCidadeIBGE(
  nome: string,
  siglaEstado: string
): Promise<CidadeData | null> {
  try {
    // Buscar município na API do IBGE
    const response = await axios.get<IBGECidade[]>(
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${siglaEstado.toUpperCase()}/municipios`
    );

    const municipio = response.data.find(
      (m) => m.nome.toLowerCase() === nome.toLowerCase()
    );

    if (!municipio) {
      return null;
    }

    // Buscar coordenadas usando Nominatim (OpenStreetMap)
    const coordenadas = await buscarCoordenadas(nome, siglaEstado);

    return {
      nome: municipio.nome,
      estado: municipio.microrregiao.mesorregiao.UF.nome,
      siglaEstado: municipio.microrregiao.mesorregiao.UF.sigla,
      latitude: coordenadas.latitude,
      longitude: coordenadas.longitude,
      populacao: 0, // Pode ser enriquecido depois
    };
  } catch (error) {
    console.error('Erro ao buscar cidade no IBGE:', error);
    return null;
  }
}

/**
 * Buscar coordenadas da cidade usando Nominatim (OpenStreetMap)
 */
async function buscarCoordenadas(
  cidade: string,
  estado: string
): Promise<{ latitude: number; longitude: number }> {
  try {
    const response = await axios.get(
      'https://nominatim.openstreetmap.org/search',
      {
        params: {
          city: cidade,
          state: estado,
          country: 'Brazil',
          format: 'json',
          limit: 1,
        },
        headers: {
          'User-Agent': 'RunningJourneyApp/1.0',
        },
      }
    );

    if (response.data && response.data.length > 0) {
      return {
        latitude: parseFloat(response.data[0].lat),
        longitude: parseFloat(response.data[0].lon),
      };
    }

    // Coordenadas padrão caso não encontre (centro do Brasil)
    return {
      latitude: -15.7939,
      longitude: -47.8828,
    };
  } catch (error) {
    console.error('Erro ao buscar coordenadas:', error);
    // Retornar coordenadas padrão em caso de erro
    return {
      latitude: -15.7939,
      longitude: -47.8828,
    };
  }
}

/**
 * Listar todas as cidades de um estado
 */
export async function listarCidadesPorEstado(siglaEstado: string) {
  try {
    const response = await axios.get<IBGECidade[]>(
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${siglaEstado.toUpperCase()}/municipios`
    );

    return response.data.map((m) => ({
      nome: m.nome,
      estado: m.microrregiao.mesorregiao.UF.nome,
      siglaEstado: m.microrregiao.mesorregiao.UF.sigla,
    }));
  } catch (error) {
    console.error('Erro ao listar cidades:', error);
    throw new Error('Erro ao buscar cidades');
  }
}

/**
 * Buscar cidades por nome (autocomplete)
 */
export async function buscarCidadesPorNome(termo: string) {
  // Primeiro buscar no banco
  const cidadesDB = await prisma.cidade.findMany({
    where: {
      nome: {
        contains: termo,
        mode: 'insensitive',
      },
    },
    take: 10,
    select: {
      id: true,
      nome: true,
      estado: true,
      siglaEstado: true,
    },
  });

  return cidadesDB;
}