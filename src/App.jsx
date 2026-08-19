// =============================================================================
// App.jsx - Orquestador principal con flujo: Welcome → Login → Dashboard
// =============================================================================
// Flujo de vistas:
//   1. Al cargar, verifica si hay token en localStorage
//      - Si hay → va directo al dashboard
//      - Si no → va a 'welcome'
//   2. Welcome → botón "Iniciar Sesión" → va a 'login'
//   3. Login → login exitoso → va a 'dashboard'
//   4. Dashboard → botón "Cerrar Sesión" → vuelve a 'welcome'
// =============================================================================

import { useState, useEffect, useCallback } from 'react';
import './App.css';

import Sidebar from './components/Sidebar.jsx';
import Topbar from './components/Topbar.jsx';
import WelcomeView from './views/WelcomeView.jsx';
import LoginView from './views/LoginView.jsx';
import DashboardView from './views/DashboardView.jsx';
import TicketsView from './views/TicketsView.jsx';
import EmpresasView from './views/EmpresasView.jsx';
import ReportesView from './views/ReportesView.jsx';

import { consultarTickets } from './api/ticketService.js';
import { isAuthenticated, getUsuario, logout } from './api/authService.js';

function App() {
  // ─── Estado de autenticación ───
  // 'welcome' = pantalla de bienvenida (default si no autenticado)
  // 'login'   = pantalla de login
  // 'app'     = dashboard completo (cuando autenticado)
  const [vista, setVista] = useState(
    isAuthenticated() ? 'app' : 'welcome'
  );
  const [usuarioActual, setUsuarioActual] = useState(getUsuario());

  // ─── Estado de la aplicación (cuando autenticado) ───
  const [paginaActual, setPaginaActual] = useState('Dashboard');
  const [tickets, setTickets]   = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError]       = useState(null);

  const cargarTickets = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const respuesta = await consultarTickets();
      if (respuesta.exito) {
        setTickets(respuesta.datos || []);
      } else {
        setError(respuesta.mensaje || 'Error al cargar tickets.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    if (vista === 'app') {
      cargarTickets();
    }
  }, [vista, cargarTickets]);

  // ─── Handlers de navegación entre vistas ───
  function handleIrALogin() {
    setVista('login');
  }

  function handleLoginExitoso() {
    setUsuarioActual(getUsuario());
    setVista('app');
    setPaginaActual('Dashboard');
  }

  function handleLogout() {
    logout();
    setUsuarioActual(null);
    setVista('welcome');
    setPaginaActual('Dashboard');
    setTickets([]);
  }

  function handleVolverWelcome() {
    setVista('welcome');
  }

  // ─── Renderizar vista según estado ───
  if (vista === 'welcome') {
    return <WelcomeView onIrALogin={handleIrALogin} />;
  }

  if (vista === 'login') {
    return (
      <LoginView
        onLoginExitoso={handleLoginExitoso}
        onVolver={handleVolverWelcome}
      />
    );
  }

  // vista === 'app' → mostrar dashboard completo
  function renderizarPagina() {
    switch (paginaActual) {
      case 'Dashboard':
        return (
          <DashboardView
            tickets={tickets}
            cargando={cargando}
            error={error}
            onReintentar={cargarTickets}
          />
        );
      case 'Tickets':
        return (
          <TicketsView
            tickets={tickets}
            cargando={cargando}
            error={error}
            onReintentar={cargarTickets}
            usuario={usuarioActual}
          />
        );
      case 'Empresas':
        return <EmpresasView usuario={usuarioActual} />;
      case 'Reportes':
        return <ReportesView tickets={tickets} />;
      default:
        return <DashboardView tickets={tickets} cargando={cargando} error={error} />;
    }
  }

  return (
    <div className="dashboard-container">
      <Sidebar
        paginaActual={paginaActual}
        onCambiarPagina={setPaginaActual}
        usuario={usuarioActual}
      />
      <div className="main-area">
        <Topbar titulo={paginaActual} onLogout={handleLogout} />
        <main className="content">
          {renderizarPagina()}
        </main>
      </div>
    </div>
  );
}

export default App;
