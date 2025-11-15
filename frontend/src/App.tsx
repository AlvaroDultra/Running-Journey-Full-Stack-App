import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import RegistrarCorrida from './pages/RegistrarCorrida';
import Historico from './pages/Historico';
import Mapa from './pages/Mapa';

// Componente para proteger rotas privadas
function PrivateRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/" />;
}

// Componente para redirecionar usuários autenticados
function PublicRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  return !isAuthenticated ? <>{children}</> : <Navigate to="/dashboard" />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota pública - Login */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        {/* Rota privada - Dashboard */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        {/* Rota privada - Registrar Corrida */}
        <Route
          path="/registrar"
          element={
            <PrivateRoute>
              <RegistrarCorrida />
            </PrivateRoute>
          }
        />

        {/* Rota privada - Histórico */}
<Route
  path="/historico"
  element={
    <PrivateRoute>
      <Historico />
    </PrivateRoute>
  }
/>

<Route
  path="/mapa"
  element={
    <PrivateRoute>
      <Mapa />
    </PrivateRoute>
  }
/>

        {/* Redirecionar qualquer outra rota - SEMPRE POR ÚLTIMO! */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;