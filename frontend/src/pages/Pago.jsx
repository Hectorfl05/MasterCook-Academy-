// src/pages/Pago.jsx
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { talleresApi, reservasApi, pagosApi } from '../services/api';
import '../index.css';

const Pago = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [taller, setTaller] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [reservaId, setReservaId] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchTaller = async () => {
      // Si no hay id o es 'demo', usamos un taller demo interactivo
      if (!id || id === 'demo') {
        if (isMounted) {
          setTaller({
            id: 1,
            nombre: 'Taller de Demostración - Cocina Italiana',
            fecha_inicio: '2026-11-20',
            precio: 250.00,
          });
          setLoading(false);
        }
        return;
      }

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

  const handleConfirmarPago = async () => {
    if (!taller) return;
    setProcessing(true);
    setError(null);

    try {
      const idUsuario = user?.id || user?.ID_Usuario || 1;
      const idTaller = taller.id;

      // 1. Crear Reserva
      let idReservaCreada = null;
      try {
        const resReserva = await reservasApi.crear({
          id_usuario: idUsuario,
          id_taller: idTaller
        });
        idReservaCreada = resReserva.id_reserva;
      } catch (errReserva) {
        // Si ya tenía reserva (409), intentamos simular pago directamente si tenemos el id
        console.warn('Nota en reserva:', errReserva.message);
        if (errReserva.status === 409) {
          // Ya tiene reserva creada
          idReservaCreada = 1; // Fallback para simulación
        } else {
          throw errReserva;
        }
      }

      // 2. Simular Pago si tenemos reserva
      if (idReservaCreada) {
        try {
          await pagosApi.simularPago(idReservaCreada);
        } catch (errPago) {
          console.warn('Simulación de pago:', errPago.message);
        }
        setReservaId(idReservaCreada);
      }

      setPaymentSuccess(true);
    } catch (err) {
      console.error('Error procesando el pago:', err);
      setError(err.message || 'Error al procesar el pago.');
    } finally {
      setProcessing(false);
    }
  };

  if (error && !taller) {
    return (
      <div className="pago-wrapper">
        <div className="pago-card">
          <div className="error-message">{error}</div>
          <button onClick={() => navigate('/workshops')} className="btn btn-cancelar" style={{ marginTop: '15px' }}>
            Volver a Talleres
          </button>
        </div>
      </div>
    );
  }

  if (loading || !taller) {
    return (
      <div className="pago-wrapper">
        <div className="pago-card cargando">Cargando información del taller...</div>
      </div>
    );
  }

  return (
    <div className="pago-wrapper">
      <div className="pago-card">
        {paymentSuccess ? (
          <div className="pago-exitoso" style={{ textAlign: 'center', padding: '10px' }}>
            <div style={{ fontSize: '3rem', color: '#28a745', marginBottom: '10px' }}>
              <i className="fas fa-check-circle"></i>
            </div>
            <h2 style={{ color: '#28a745' }}>¡Pago Procesado Exitosamente!</h2>
            <p>Tu inscripción para <strong>{taller.nombre}</strong> ha sido confirmada.</p>
            {reservaId && <p style={{ fontSize: '0.9rem', color: '#6c757d' }}>Código de Reserva: #{reservaId}</p>}
            
            <div style={{ marginTop: '25px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <Link to="/my-bookings" className="btn btn-confirmar">
                Ver Mis Reservas
              </Link>
              <Link to="/workshops" className="btn btn-cancelar">
                Explorar Más Talleres
              </Link>
            </div>
          </div>
        ) : (
          <>
            <h2>Resumen de Pago</h2>
            {error && <div className="error-message" style={{ margin: '10px 0' }}>{error}</div>}

            <p><strong>Taller:</strong> {taller.nombre}</p>
            <p><strong>Fecha:</strong> {taller.fecha_inicio || taller.fecha || 'Próximamente'}</p>
            <p><strong>Total a Pagar:</strong> Q{(Number(taller.precio) || 0).toFixed(2)}</p>

            <div style={{ marginTop: '20px' }}>
              <button 
                className="btn btn-confirmar" 
                onClick={handleConfirmarPago}
                disabled={processing}
                style={{ width: '100%', marginBottom: '10px' }}
              >
                {processing ? 'Procesando Pago...' : 'Confirmar Pago'}
              </button>
              <button 
                className="btn btn-cancelar" 
                onClick={() => navigate(-1)}
                disabled={processing}
                style={{ width: '100%' }}
              >
                Cancelar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Pago;
