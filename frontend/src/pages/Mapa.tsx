import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';
import 'leaflet/dist/leaflet.css';
import './Mapa.css';
import L from 'leaflet';

// Fix para os ícones do Leaflet no Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function Mapa() {
  const navigate = useNavigate();
  const usuario = useAuthStore((state) => state.usuario);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carregamento
    setTimeout(() => setLoading(false), 1000);
  }, []);

  if (loading) {
    return (
      <div className="mapa-container">
        <div className="loading">Carregando mapa...</div>
      </div>
    );
  }

  if (!usuario?.cidadeOrigem) {
    return (
      <div className="mapa-container">
        <div className="mapa-header">
          <button onClick={() => navigate('/dashboard')} className="btn-back">
            ← Voltar
          </button>
          <h1>🗺️ Mapa da Jornada</h1>
        </div>

        <div className="mapa-content">
          <div className="empty-state">
            <div className="empty-icon">📍</div>
            <h2>Defina sua cidade de origem</h2>
            <p>Para visualizar o mapa, primeiro defina de onde você está partindo!</p>
            <button className="btn-primary">
              Definir Cidade de Origem
            </button>
          </div>
        </div>
      </div>
    );
  }

  const cidadeOrigem = usuario.cidadeOrigem;
  const cidadeAtual = usuario.cidadeAtual || cidadeOrigem;

  // Coordenadas
  const origem: [number, number] = [cidadeOrigem.latitude || -12.9822, cidadeOrigem.longitude || -38.4812];
  const atual: [number, number] = [cidadeAtual.latitude || -12.9822, cidadeAtual.longitude || -38.4812];

  // Linha da rota
  const rota: [number, number][] = [origem, atual];

  // Centro do mapa
  const centro: [number, number] = [
    (origem[0] + atual[0]) / 2,
    (origem[1] + atual[1]) / 2,
  ];

  return (
    <div className="mapa-container">
      <div className="mapa-header">
        <button onClick={() => navigate('/dashboard')} className="btn-back">
          ← Voltar
        </button>
        <h1>🗺️ Mapa da Jornada</h1>
      </div>

      <div className="mapa-content">
        <div className="mapa-info">
          <div className="info-card">
            <h3>🚩 Origem</h3>
            <p className="cidade-nome">{cidadeOrigem.nome}</p>
            <p className="cidade-estado">{cidadeOrigem.estado}</p>
          </div>

          <div className="info-arrow">
            <div className="km-percorridos">
              {usuario.kmTotal} km
            </div>
            <div className="arrow">→</div>
          </div>

          <div className="info-card">
            <h3>📍 Posição Atual</h3>
            <p className="cidade-nome">{cidadeAtual.nome}</p>
            <p className="cidade-estado">{cidadeAtual.estado}</p>
          </div>
        </div>

        <div className="mapa-wrapper">
          <MapContainer
            center={centro}
            zoom={8}
            className="leaflet-map"
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Marcador da origem */}
            <Marker position={origem}>
              <Popup>
                <strong>🚩 Origem</strong>
                <br />
                {cidadeOrigem.nome} - {cidadeOrigem.siglaEstado}
              </Popup>
            </Marker>

            {/* Marcador da posição atual */}
            {cidadeAtual.id !== cidadeOrigem.id && (
              <Marker position={atual}>
                <Popup>
                  <strong>📍 Você está aqui!</strong>
                  <br />
                  {cidadeAtual.nome} - {cidadeAtual.siglaEstado}
                  <br />
                  <em>{usuario.kmTotal} km percorridos</em>
                </Popup>
              </Marker>
            )}

            {/* Linha da rota */}
            <Polyline
              positions={rota}
              color="#667eea"
              weight={4}
              opacity={0.7}
            />
          </MapContainer>
        </div>

        <div className="mapa-legend">
          <div className="legend-item">
            <span className="legend-icon origem">🚩</span>
            <span>Cidade de Origem</span>
          </div>
          <div className="legend-item">
            <span className="legend-icon linha">━━</span>
            <span>Rota Percorrida</span>
          </div>
          <div className="legend-item">
            <span className="legend-icon atual">📍</span>
            <span>Posição Atual</span>
          </div>
        </div>
      </div>
    </div>
  );
}