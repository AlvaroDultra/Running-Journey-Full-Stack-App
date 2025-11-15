import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';
import type { Usuario, Estatisticas } from '../types';
import './Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const { usuario, logout, updateUsuario } = useAuthStore();
  const [stats, setStats] = useState<Estatisticas | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      // Buscar perfil atualizado
      const perfilResponse = await api.get<Usuario>('/auth/me');
      updateUsuario(perfilResponse.data);

      // Buscar estatísticas
      const statsResponse = await api.get<Estatisticas>('/corridas/estatisticas');
      setStats(statsResponse.data);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>🏃‍♂️ Running Journey</h1>
          <div className="header-actions">
            <span className="user-name">Olá, {usuario?.nome}!</span>
            <button onClick={handleLogout} className="btn-logout">
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="welcome-card">
          <h2>Bem-vindo ao seu Dashboard! 🎉</h2>
          <p>Aqui você acompanha sua jornada de corrida pelo Brasil!</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">🏃‍♂️</div>
            <div className="stat-info">
              <h3>Total de Corridas</h3>
              <p className="stat-value">{stats?.totalCorridas || 0}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📏</div>
            <div className="stat-info">
              <h3>Km Total</h3>
              <p className="stat-value">{stats?.kmTotal || 0} km</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-info">
              <h3>Média por Corrida</h3>
              <p className="stat-value">{stats?.mediaKmPorCorrida || 0} km</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🏆</div>
            <div className="stat-info">
              <h3>Maior Corrida</h3>
              <p className="stat-value">{stats?.maiorCorrida || 0} km</p>
            </div>
          </div>
        </div>

        <div className="location-card">
          <h3>📍 Sua Localização Atual</h3>
          {usuario?.cidadeAtual ? (
            <div className="location-info">
              <p className="city-name">
                {usuario.cidadeAtual.nome} - {usuario.cidadeAtual.siglaEstado}
              </p>
              <p className="city-detail">
                {usuario.kmTotal} km percorridos desde {usuario.cidadeOrigem?.nome}
              </p>
            </div>
          ) : (
            <div className="no-location">
              <p>⚠️ Você ainda não definiu sua cidade de origem!</p>
              <button className="btn-primary">Definir Cidade de Origem</button>
            </div>
          )}
        </div>

        <div className="action-buttons">
          <button 
  className="btn-action btn-register"
  onClick={() => navigate('/registrar')}
>
  ➕ Registrar Corrida
</button>
          <button className="btn-action btn-history">
            📋 Ver Histórico
          </button>
          <button className="btn-action btn-map">
            🗺️ Ver Mapa
          </button>
        </div>
      </main>
    </div>
  );
}