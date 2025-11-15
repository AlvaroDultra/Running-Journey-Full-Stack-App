export interface Usuario {
  id: string;
  nome: string;
  email: string;
  kmTotal: number;
  cidadeOrigemId?: string;
  cidadeAtualId?: string;
  cidadeOrigem?: Cidade;
  cidadeAtual?: Cidade;
  createdAt: string;
}

export interface Cidade {
  id: string;
  nome: string;
  estado: string;
  siglaEstado: string;
  latitude?: number;
  longitude?: number;
}

export interface Corrida {
  id: string;
  usuarioId: string;
  data: string;
  kmCorridos: number;
  observacao?: string;
  cidadeAlcancadaId?: string;
  cidadeAlcancada?: Cidade;
  createdAt: string;
}

export interface Estatisticas {
  totalCorridas: number;
  kmTotal: number;
  mediaKmPorCorrida: number;
  maiorCorrida: number;
  menorCorrida: number;
  primeiraCorrida: string | null;
  ultimaCorrida: string | null;
}

export interface AuthResponse {
  token: string;
  usuario: Usuario;
}

export interface LoginData {
  email: string;
  senha: string;
}

export interface RegisterData {
  nome: string;
  email: string;
  senha: string;
}