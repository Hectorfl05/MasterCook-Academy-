// src/pages/Talleres.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { talleresApi } from '../services/api';
import '../index.css';

const Talleres = () => {
  const [talleres, setTalleres] = useState([]);
  const [filtroCategoria, setFiltroCategoria] = useState('Todas');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchTalleres = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await talleresApi.getAll(filtroCategoria);
        if (isMounted) {
          setTalleres(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error al obtener los talleres:', err);
          setError(err.message || 'Error al obtener los talleres');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchTalleres();

    return () => {
      isMounted = false;
    };
  }, [filtroCategoria]);

  // Componente Skeleton para carga
  const TallerSkeleton = () => (
    <div className="taller-card skeleton">
      <div className="skeleton-title"></div>
      <div className="skeleton-line"></div>
      <div className="skeleton-line"></div>
      <div className="skeleton-line"></div>
      <div className="skeleton-line"></div>
      <div className="skeleton-button"></div>
    </div>
  );

  if (error) {
    return (
      <div className="talleres-container">
        <h1 className="titulo-pagina">Talleres Disponibles</h1>
        <div className="error-message">
          <p>Ocurrió un error al cargar los talleres: {error}</p>
          <button onClick={() => setFiltroCategoria('Todas')} className="btn btn-primary" style={{ marginRight: '10px' }}>
            Restablecer Filtro
          </button>
          <button onClick={() => window.location.reload()} className="btn btn-pagar">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="talleres-container">
      <h1 className="titulo-pagina">Talleres Disponibles</h1>

      {/* Selector de categorías */}
      <div className="filtros-container">
        <label htmlFor="categoria-filtro">Filtrar por categoría: </label>
        <select
          id="categoria-filtro"
          value={filtroCategoria}
          onChange={(e) => setFiltroCategoria(e.target.value)}
          className="filtro-select"
          disabled={isLoading}
        >
          <option value="Todas">Todas las categorías</option>
          <option value="Cocina Internacional">Cocina Internacional</option>
          <option value="Repostería Creativa">Repostería Creativa</option>
          <option value="Alimentación Saludable">Alimentación Saludable</option>
        </select>
      </div>

      {/* Listado de talleres */}
      <div className="talleres-grid">
        {isLoading ? (
          [...Array(4)].map((_, index) => <TallerSkeleton key={index} />)
        ) : talleres.length > 0 ? (
          talleres.map((taller) => (
            <div key={taller.id} className="taller-card">
              <h2>{taller.nombre}</h2>
              <p><strong>Categoría:</strong> {taller.categoria}</p>
              <p><strong>Fecha:</strong> {taller.fecha}</p>
              <p><strong>Precio:</strong> Q{(Number(taller.precio) || 0).toFixed(2)}</p>
              <p>
                <strong>Cupo:</strong>{' '}
                <span style={{ color: taller.cupo_disponible ? '#28a745' : '#dc3545', fontWeight: 'bold' }}>
                  {taller.cupo_disponible ? 'Disponible' : 'Lleno'}
                </span>
              </p>
              <Link to={`/taller/${taller.id}`} className="btn btn-pagar">
                Ver Detalle
              </Link>
            </div>
          ))
        ) : (
          <div className="sin-talleres" style={{ textAlign: 'center', gridColumn: '1 / -1', padding: '40px' }}>
            <p>No hay talleres disponibles en la categoría seleccionada.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Talleres;
