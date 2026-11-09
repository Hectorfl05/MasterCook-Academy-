import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import AuthForm from './components/AuthForm';
import WorkshopCard from './components/WorkshopCard';
import MisReservas from './pages/MisReservas';
import Pago from './pages/Pago';

// Helper para renderizar con providers necesarios
const renderWithProviders = (ui, { initialEntries = ['/'] } = {}) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <AuthProvider>
        {ui}
      </AuthProvider>
    </MemoryRouter>
  );
};

describe('MasterCook Frontend Test Suite', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('1. App inicializa y muestra el título MasterCook Academy', () => {
    renderWithProviders(<App />);
    const titleElements = screen.getAllByText(/MasterCook Academy/i);
    expect(titleElements.length).toBeGreaterThan(0);
  });

  test('2. Usuario no autenticado es dirigido al formulario de Iniciar Sesión', () => {
    renderWithProviders(<App />, { initialEntries: ['/'] });
    expect(screen.getByRole('heading', { name: /Iniciar Sesión/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/ejemplo@correo.com/i)).toBeInTheDocument();
  });

  test('3. Navbar muestra enlaces de Iniciar Sesión y Registrarse para usuario anónimo', () => {
    renderWithProviders(<Navbar />);
    expect(screen.getByText(/Iniciar Sesión/i)).toBeInTheDocument();
    expect(screen.getByText(/Registrarse/i)).toBeInTheDocument();
  });

  test('4. AuthForm de registro exige contraseña mínima de 8 caracteres y nombre', () => {
    renderWithProviders(<AuthForm type="register" />);
    expect(screen.getByRole('heading', { name: /Registro/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Ej. Juan Pérez/i)).toBeInTheDocument();

    const passwordInput = screen.getByPlaceholderText('••••••••');
    expect(passwordInput).toHaveAttribute('minLength', '8');
  });

  test('5. WorkshopCard renderiza título, descripción, precio formateado y disponibilidad', () => {
    renderWithProviders(
      <WorkshopCard 
        id={1}
        title="Taller de Pasta Italiana"
        description="Aprende pasta desde cero"
        date="2026-11-20"
        price={250}
        available={true}
      />
    );

    expect(screen.getByText('Taller de Pasta Italiana')).toBeInTheDocument();
    expect(screen.getByText('Aprende pasta desde cero')).toBeInTheDocument();
    expect(screen.getByText(/Q250.00/)).toBeInTheDocument();
    expect(screen.getByText('Disponible')).toBeInTheDocument();
    expect(screen.getByText('Ver detalles')).toBeInTheDocument();
  });

  test('6. WorkshopCard muestra "Lleno" cuando cupo está agotado', () => {
    renderWithProviders(
      <WorkshopCard 
        id={2}
        title="Taller Lleno"
        description="Sin cupo"
        price={180}
        available={false}
      />
    );

    expect(screen.getByText('Lleno')).toBeInTheDocument();
  });

  test('7. Pago renderiza en modo demo interactivo sin errores', async () => {
    renderWithProviders(<Pago />, { initialEntries: ['/pago-demo'] });
    
    await waitFor(() => {
      expect(screen.getByText(/Resumen de Pago/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/Taller de Demostración/i)).toBeInTheDocument();
    expect(screen.getByText(/Confirmar Pago/i)).toBeInTheDocument();
  });

  test('8. MisReservas muestra estado vacío amigable cuando no hay reservas', async () => {
    // Mock fetch vacío
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      })
    );

    renderWithProviders(<MisReservas />);

    await waitFor(() => {
      expect(screen.getByText(/Aún no tienes talleres reservados/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/Explorar Talleres Disponibles/i)).toBeInTheDocument();
  });
});
