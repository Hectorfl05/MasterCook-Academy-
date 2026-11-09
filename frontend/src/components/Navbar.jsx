import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => (location.pathname === path ? 'active' : '');

  return (
    <div className="header-container">
      <h1 className="main-title">
        <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
          MasterCook Academy
        </Link>
      </h1>
      
      <nav className="navbar navbar-expand-lg navbar-dark">
        <div className="container">
          <div className="navbar-nav mx-auto" style={{ display: 'flex', alignItems: 'center' }}>
            {isAuthenticated ? (
              <>
                <Link className={`nav-link ${isActive('/dashboard')}`} to="/dashboard">
                  Inicio
                </Link>
                <Link className={`nav-link ${isActive('/workshops')}`} to="/workshops">
                  Explorar Talleres
                </Link>
                <Link className={`nav-link ${isActive('/my-bookings')}`} to="/my-bookings">
                  Mis Reservas
                </Link>
                <button 
                  className="nav-link btn btn-link" 
                  onClick={logout}
                  style={{ cursor: 'pointer', background: 'transparent', border: 'none' }}
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <>
                <Link className={`nav-link ${isActive('/login')}`} to="/login">
                  Iniciar Sesión
                </Link>
                <Link className={`nav-link ${isActive('/register')}`} to="/register">
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
