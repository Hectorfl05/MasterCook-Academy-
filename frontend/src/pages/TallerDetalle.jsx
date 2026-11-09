// src/pages/TallerDetalle.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { talleresApi } from '../services/api';
import '../index.css';

const TallerDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [taller, setTaller] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchTaller = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await talleresApi.getById(id);
        if (isMounted) {
          setTaller(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Taller no encontrado');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchTaller();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (error) {
    return (
      <div className="taller-detalle-wrapper">
        <div className="taller-detalle-card">
          <div className="taller-no-encontrado error-message">{error}</div>
          <button onClick={() => navigate('/workshops')} className="btn btn-regresar" style={{ marginTop: '20px' }}>
            Volver a Talleres
          </button>
        </div>
      </div>
    );
  }

  if (loading || !taller) {
    return (
      <div className="taller-detalle-wrapper">
        <div className="taller-detalle-card cargando">Cargando detalles del taller...</div>
      </div>
    );
  }

  const tieneCupo = Boolean(taller.cupo_disponible);

  return (
    <div className="taller-detalle-wrapper">
      <div className="taller-detalle-card">
        <h1>{taller.nombre}</h1>
        <p><strong>Descripción:</strong> {taller.descripcion}</p>
        <p><strong>Fecha de inicio:</strong> {taller.fecha_inicio}</p>
        <p><strong>Fecha de finalización:</strong> {taller.fecha_final}</p>
        <p><strong>Capacidad:</strong> {taller.capacidad} participantes</p>
        <p>
          <strong>Cupo disponible:</strong>{' '}
          <span style={{ color: tieneCupo ? '#28a745' : '#dc3545', fontWeight: 'bold' }}>
            {tieneCupo ? 'Disponible' : 'Agotado'}
          </span>
        </p>
        <p><strong>Categoría:</strong> {taller.categoria}</p>
        <p><strong>Precio:</strong> Q{(Number(taller.precio) || 0).toFixed(2)}</p>

        <div className="botones-container">
          <button onClick={() => navigate(-1)} className="btn btn-regresar">
            Regresar
          </button>
          <button 
            onClick={() => navigate(`/pago/${id}`)} 
            className="btn btn-pagar"
            disabled={!tieneCupo}
            style={!tieneCupo ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
          >
            {tieneCupo ? 'Pagar' : 'Cupo Agotado'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TallerDetalle;
