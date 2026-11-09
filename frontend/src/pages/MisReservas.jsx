// src/pages/MisReservas.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { reservasApi } from '../services/api';
import '../index.css';

const MisReservas = () => {
  const { user } = useAuth();
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = user?.id || user?.ID_Usuario || 1;

  useEffect(() => {
    let isMounted = true;

    const fetchReservas = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await reservasApi.obtenerPorUsuario(userId);
        if (isMounted) {
          setReservas(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error al cargar reservas:', err);
          setError(err.message || 'Error al obtener tus reservas.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchReservas();

    return () => {
      isMounted = false;
    };
  }, [userId]);

  return (
    <div className="talleres-container">
      <h1 className="titulo-pagina">Mis Reservas</h1>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#5a4a42' }}>
          <p>Cargando tus reservas...</p>
        </div>
      ) : error ? (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="btn btn-pagar">
            Reintentar
          </button>
        </div>
      ) : reservas.length === 0 ? (
        <div className="sin-talleres" style={{ textAlign: 'center', padding: '40px', backgroundColor: 'rgba(255,255,255,0.85)', borderRadius: '8px' }}>
          <p>Aún no tienes talleres reservados.</p>
          <Link to="/workshops" className="btn btn-primary" style={{ marginTop: '15px', display: 'inline-block' }}>
            Explorar Talleres Disponibles
          </Link>
        </div>
      ) : (
        <div className="talleres-grid">
          {reservas.map((r) => (
            <div key={r.id_reserva} className="taller-card">
              <h2>{r.taller_nombre}</h2>
              <p><strong>Código de Reserva:</strong> #{r.id_reserva}</p>
              <p><strong>Fecha de Reserva:</strong> {r.fecha_reserva || 'Reciente'}</p>
              <p><strong>Precio:</strong> Q{(Number(r.taller_precio) || 0).toFixed(2)}</p>
              <p>
                <strong>Estado de Pago:</strong>{' '}
                <span
                  style={{
                    color: r.estado_pago === 'Pagado' ? '#28a745' : '#e0a800',
                    fontWeight: 'bold',
                  }}
                >
                  {r.estado_pago}
                </span>
              </p>
              <p>
                <strong>Estado:</strong>{' '}
                <span style={{ color: '#007bff', fontWeight: 'bold' }}>
                  {r.estado || 'Confirmada'}
                </span>
              </p>

              {r.estado_pago !== 'Pagado' && (
                <Link to={`/pago/${r.id_taller}`} className="btn btn-pagar" style={{ marginTop: '10px' }}>
                  Pagar Ahora
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MisReservas;
