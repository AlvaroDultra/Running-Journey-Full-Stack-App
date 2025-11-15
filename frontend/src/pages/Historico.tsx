import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import type { Corrida } from '../types';
import './Historico.css';

export default function Historico() {
  const navigate = useNavigate();
  const [corridas, setCorridas] = useState<Corrida[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    carregarHistorico();
  }, []);

  const carregarHistorico = async () => {
    try {
      const response = await api.get<Corrida[]>('/corridas/historico');
      setCorridas(response.data);
    } catch (err) {
      setError('Erro ao carregar histórico');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatarDataCompleta = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja deletar esta corrida?')) {
      return;
    }

    try {
      await api.delete(`/corridas/${id}`);
      setCorridas(corridas.filter((c) => c.id !== id));
      alert('Corrida deletada com sucesso!');
    } catch (err) {
      alert('Erro ao deletar corrida');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="historico-container">
        <div className="loading">Carregando histórico...</div>
      </div>
    );
  }

  return (
    <div className="historico-container">
      <div className="historico-header">
        <button onClick={() => navigate('/dashboard')} className="btn-back">
          ← Voltar
        </button>
        <h1>📋 Histórico de Corridas</h1>
      </div>

      <div className="historico-content">
        {error && <div className="error-message">{error}</div>}

        {corridas.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🏃‍♂️</div>
            <h2>Nenhuma corrida registrada</h2>
            <p>Comece sua jornada registrando sua primeira corrida!</p>
            <button
              onClick={() => navigate('/registrar')}
              className="btn-primary"
            >
              ➕ Registrar Corrida
            </button>
          </div>
        ) : (
          <>
            <div className="historico-stats">
              <div className="stat-item">
                <span className="stat-label">Total de Corridas</span>
                <span className="stat-value">{corridas.length}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Km Total</span>
                <span className="stat-value">
                  {corridas.reduce((acc, c) => acc + c.kmCorridos, 0).toFixed(1)} km
                </span>
              </div>
            </div>

            <div className="corridas-list">
              {corridas.map((corrida) => (
                <div key={corrida.id} className="corrida-card">
                  <div className="corrida-header">
                    <div className="corrida-data">
                      <span className="data-principal">
                        {formatarData(corrida.data)}
                      </span>
                      <span className="data-completa">
                        {formatarDataCompleta(corrida.data)}
                      </span>
                    </div>
                    <div className="corrida-km">
                      {corrida.kmCorridos} km
                    </div>
                  </div>

                  {corrida.observacao && (
                    <div className="corrida-observacao">
                      💬 {corrida.observacao}
                    </div>
                  )}

                  {corrida.cidadeAlcancada && (
                    <div className="corrida-cidade">
                      📍 Alcançou: {corrida.cidadeAlcancada.nome} -{' '}
                      {corrida.cidadeAlcancada.siglaEstado}
                    </div>
                  )}

                  <div className="corrida-actions">
                    <button
                      onClick={() => handleDelete(corrida.id)}
                      className="btn-delete"
                    >
                      🗑️ Deletar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}