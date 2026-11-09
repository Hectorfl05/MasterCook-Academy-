import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../index.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const userName = user?.name || user?.Nombre || user?.email || 'Chef';

  return (
    <div className="container" style={{ maxWidth: '800px', margin: '40px auto' }}>
      <div 
        className="auth-form" 
        style={{ 
          maxWidth: '100%', 
          textAlign: 'center', 
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          padding: '40px 30px'
        }}
      >
        <h1 style={{ color: '#D94F4F', marginBottom: '15px' }}>
          ¡Bienvenido, {userName}!
        </h1>
        <p style={{ fontSize: '1.1rem', color: '#5a4a42', marginBottom: '30px' }}>
          Gestiona tus inscripciones a talleres culinarios, consulta tus reservas y explora nuevas experiencias gastronómicas.
        </p>

        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '30px' }}>
          <Link to="/workshops" className="btn btn-primary" style={{ padding: '12px 24px' }}>
            <i className="fas fa-utensils" style={{ marginRight: '8px' }}></i>
            Explorar Talleres
          </Link>
          <Link to="/my-bookings" className="btn btn-pagar" style={{ padding: '12px 24px', backgroundColor: '#28a745', color: 'white' }}>
            <i className="fas fa-calendar-check" style={{ marginRight: '8px' }}></i>
            Mis Reservas
          </Link>
        </div>

        <hr style={{ margin: '25px 0', borderColor: '#e0c2a2' }} />

        <button 
          onClick={logout}
          className="btn btn-danger"
          style={{ padding: '8px 20px' }}
        >
          <i className="fas fa-sign-out-alt" style={{ marginRight: '8px' }}></i>
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
