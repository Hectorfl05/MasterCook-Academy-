import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../services/api';

const AuthForm = ({ type }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: type === 'register' ? '' : undefined
  });
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setErrorMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      if (type === 'login') {
        const payload = { email: formData.email, password: formData.password };
        const data = await authApi.login(payload);
        setSuccessMessage(data.message || 'Inicio de sesión exitoso');
        login(data.token, data.user);
      } else {
        const payload = {
          name: formData.name,
          email: formData.email,
          password: formData.password
        };
        const data = await authApi.register(payload);
        setSuccessMessage(data.message || 'Registro exitoso. Redirigiendo al login...');
        setTimeout(() => {
          register(formData.email);
        }, 1200);
      }
    } catch (error) {
      console.error('Error en autenticación:', error);
      setErrorMessage(error.message || 'Error al conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form">
      <h2>{type === 'login' ? 'Iniciar Sesión' : 'Registro'}</h2>

      {errorMessage && (
        <div className="error-message" style={{ margin: '10px 0', padding: '10px', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '4px', border: '1px solid #f5c6cb' }}>
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div style={{ margin: '10px 0', padding: '10px', backgroundColor: '#d4edda', color: '#155724', borderRadius: '4px', border: '1px solid #c3e6cb' }}>
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {type === 'register' && (
          <div className="form-group">
            <label>Nombre completo</label>
            <input
              type="text"
              name="name"
              value={formData.name || ''}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="Ej. Juan Pérez"
            />
          </div>
        )}

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={loading}
            placeholder="ejemplo@correo.com"
          />
        </div>

        <div className="form-group">
          <label>Contraseña (mínimo 8 caracteres)</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength="8"
            disabled={loading}
            placeholder="••••••••"
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%' }}>
          {loading ? 'Cargando...' : type === 'login' ? 'Iniciar Sesión' : 'Registrarse'}
        </button>
      </form>

      {type === 'login' && (
        <div style={{ textAlign: 'right', marginTop: '15px' }}>
          <span>¿No tienes una cuenta? </span>
          <Link to="/register" style={{ color: '#007bff', textDecoration: 'underline' }}>
            Regístrate
          </Link>
        </div>
      )}

      {type === 'register' && (
        <div style={{ textAlign: 'right', marginTop: '15px' }}>
          <span>¿Ya tienes una cuenta? </span>
          <Link to="/login" style={{ color: '#007bff', textDecoration: 'underline' }}>
            Inicia sesión
          </Link>
        </div>
      )}
    </div>
  );
};

export default AuthForm;
