import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { useAuth } from './context/AuthContext'; 
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Talleres from './pages/Talleres';
import TallerDetalle from './pages/TallerDetalle';
import Pago from './pages/Pago';
import MisReservas from './pages/MisReservas';
import videoFondo from './Pinterest.mp4';

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <div className="video-background">
        <video autoPlay loop muted playsInline>
          <source src={videoFondo} type="video/mp4" />
        </video>
      </div>

      <div className="content-wrapper">
        <div className="App">
          <Navbar />
          <div className="container">
            <Routes>
              {/* Rutas de autenticación */}
              <Route 
                path="/login" 
                element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} 
              />
              <Route 
                path="/register" 
                element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />} 
              />

              {/* Redirección inteligente de raíz */}
              <Route 
                path="/" 
                element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} 
              />

              {/* Rutas protegidas */}
              <Route 
                path="/dashboard" 
                element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />} 
              />
              <Route 
                path="/workshops" 
                element={isAuthenticated ? <Talleres /> : <Navigate to="/login" replace />} 
              />
              <Route 
                path="/taller/:id" 
                element={isAuthenticated ? <TallerDetalle /> : <Navigate to="/login" replace />} 
              />
              <Route 
                path="/pago/:id" 
                element={isAuthenticated ? <Pago /> : <Navigate to="/login" replace />} 
              />
              <Route 
                path="/pago-demo" 
                element={isAuthenticated ? <Pago /> : <Navigate to="/login" replace />} 
              />
              <Route 
                path="/my-bookings" 
                element={isAuthenticated ? <MisReservas /> : <Navigate to="/login" replace />} 
              />

              {/* Ruta comodín para páginas no encontradas */}
              <Route 
                path="*" 
                element={
                  <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: '10px', margin: '40px auto', maxWidth: '600px' }}>
                    <h1 style={{ color: '#D94F4F', fontSize: '3rem', marginBottom: '10px' }}>404</h1>
                    <h2>Página no encontrada</h2>
                    <p style={{ color: '#5a4a42', margin: '15px 0 25px' }}>
                      La página que buscas no existe o ha sido movida.
                    </p>
                    <Link to="/" className="btn btn-primary">
                      Volver al Inicio
                    </Link>
                  </div>
                } 
              />
            </Routes>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
