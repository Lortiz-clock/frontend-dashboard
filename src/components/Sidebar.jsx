// =============================================================================
// Sidebar.jsx - Barra lateral de navegación
// =============================================================================

import React from 'react';

const MENU = [
  { id: 'Dashboard', icon: '📊', label: 'Dashboard' },
  { id: 'Tickets',   icon: '🎫', label: 'Tickets' },
  { id: 'Empresas',  icon: '🏢', label: 'Empresas' },
  { id: 'Reportes',  icon: '📈', label: 'Reportes' },
];

export default function Sidebar({ paginaActual, onCambiarPagina, usuario }) {
  // Mostrar rol del usuario en el footer del sidebar
  const iniciales = usuario
    ? usuario.nombre.split(' ').slice(0, 2).map(p => p[0]).join('').toUpperCase()
    : '?';

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h2>🎫 Sistema TicketA</h2>
      </div>

      <nav className="sidebar-nav">
        <ul>
          {MENU.map(item => (
            <li
              key={item.id}
              onClick={() => onCambiarPagina(item.id)}
              className={paginaActual === item.id ? 'active' : ''}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </li>
          ))}
        </ul>
      </nav>

      {usuario && (
        <div className="sidebar-footer">
          <div className="sidebar-user-avatar">{iniciales}</div>
          <div className="sidebar-user-info">
            <p className="sidebar-user-name">{usuario.nombre}</p>
            <p className="sidebar-user-role">{usuario.rol}</p>
          </div>
        </div>
      )}
    </aside>
  );
}
