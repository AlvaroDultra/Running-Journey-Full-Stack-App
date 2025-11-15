import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './RegistrarCorrida.css';

export default function RegistrarCorrida() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [kmCorridos, setKmCorridos] = useState('');
  const [data, setData] = useState('');
  const [observacao, setObservacao] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload: any = {
        kmCorridos: parseFloat(kmCorridos),
        observacao: observacao || undefined,
      };

      if (data) {
        payload.data = data;
      }

      await api.post('/corridas', payload);
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao registrar corrida');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="registrar-container">
      <div className="registrar-header">
        <button onClick={() => navigate('/dashboard')} className="btn-back">
          ← Voltar
        </button>
        <h1>📝 Registrar Corrida</h1>
      </div>

      <div className="registrar-content">
        <div className="registrar-card">
          {success ? (
            <div className="success-message">
              <div className="success-icon">✅</div>
              <h2>Corrida Registrada!</h2>
              <p>Redirecionando para o dashboard...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="registrar-form">
              <div className="form-header">
                <h2>Nova Corrida</h2>
                <p>Registre os quilômetros que você correu hoje!</p>
              </div>

              <div className="form-group">
                <label htmlFor="kmCorridos">
                  Distância (km) <span className="required">*</span>
                </label>
                <input
                  id="kmCorridos"
                  type="number"
                  step="0.1"
                  min="0.1"
                  max="200"
                  placeholder="Ex: 10.5"
                  value={kmCorridos}
                  onChange={(e) => setKmCorridos(e.target.value)}
                  required
                />
                <small>Máximo: 200km por corrida</small>
              </div>

              <div className="form-group">
                <label htmlFor="data">Data da Corrida</label>
                <input
                  id="data"
                  type="date"
                  max={new Date().toISOString().split('T')[0]}
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                />
                <small>Deixe em branco para usar a data de hoje</small>
              </div>

              <div className="form-group">
                <label htmlFor="observacao">Observações</label>
                <textarea
                  id="observacao"
                  rows={4}
                  placeholder="Ex: Corrida matinal, clima agradável..."
                  value={observacao}
                  onChange={(e) => setObservacao(e.target.value)}
                  maxLength={500}
                />
                <small>{observacao.length}/500 caracteres</small>
              </div>

              {error && (
                <div className="error-box">
                  ⚠️ {error}
                </div>
              )}

              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="btn-secondary"
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-submit"
                  disabled={loading}
                >
                  {loading ? 'Salvando...' : '✅ Registrar Corrida'}
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="tips-card">
          <h3>💡 Dicas</h3>
          <ul>
            <li>✅ Registre suas corridas logo após terminar</li>
            <li>📏 Seja preciso com a distância</li>
            <li>📝 Adicione observações sobre clima, percurso, etc</li>
            <li>🎯 Acompanhe seu progresso no dashboard</li>
          </ul>
        </div>
      </div>
    </div>
  );
}