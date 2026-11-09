// src/services/api.js

export const API_URLS = {
  auth: process.env.REACT_APP_AUTH_URL || 'http://localhost:5001',
  talleres: process.env.REACT_APP_TALLERES_URL || 'http://localhost:5002',
  reservas: process.env.REACT_APP_RESERVAS_URL || 'http://localhost:5003',
  pagos: process.env.REACT_APP_PAGOS_URL || 'http://localhost:5004',
};

const handleResponse = async (response) => {
  let data;
  try {
    data = await response.json();
  } catch (err) {
    data = { message: response.statusText || 'Error en la respuesta del servidor' };
  }

  if (!response.ok) {
    const errorMsg = data?.message || data?.error || data?.mensaje || `Error HTTP: ${response.status}`;
    const error = new Error(errorMsg);
    error.status = response.status;
    error.data = data;
    throw error;
  }
  return data;
};

// ================= AUTH API =================
export const authApi = {
  login: async (credentials) => {
    const response = await fetch(`${API_URLS.auth}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    return handleResponse(response);
  },

  register: async (userData) => {
    const response = await fetch(`${API_URLS.auth}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },
};

// ================= TALLERES API =================
export const talleresApi = {
  getAll: async (categoria = 'Todas') => {
    let url = `${API_URLS.talleres}/talleres`;
    if (categoria && categoria !== 'Todas') {
      url += `?categoria=${encodeURIComponent(categoria)}`;
    }
    const response = await fetch(url);
    return handleResponse(response);
  },

  getById: async (id) => {
    const response = await fetch(`${API_URLS.talleres}/talleres/${id}`);
    return handleResponse(response);
  },
};

// ================= RESERVAS API =================
export const reservasApi = {
  crear: async ({ id_usuario, id_taller }) => {
    const response = await fetch(`${API_URLS.reservas}/reservar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_usuario, id_taller }),
    });
    return handleResponse(response);
  },

  obtenerPorUsuario: async (id_usuario) => {
    const response = await fetch(`${API_URLS.reservas}/reservas/usuario/${id_usuario}`);
    return handleResponse(response);
  },
};

// ================= PAGOS API =================
export const pagosApi = {
  simularPago: async (id_reserva) => {
    const response = await fetch(`${API_URLS.pagos}/simular_pago/${id_reserva}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    return handleResponse(response);
  },
};
