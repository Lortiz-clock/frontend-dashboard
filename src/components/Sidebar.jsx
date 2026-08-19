import React from 'react';

// Menú completo (SuperUsuario ve todo)
const MENU_COMPLETO = [
  { id: 'Dashboard', icon: '📊', label: 'Dashboard' },
  { id: 'Tickets',   icon: '🎫', label: 'Tickets' },
  { id: 'Empresas',  icon: '🏢', label: 'Empresas' },
  { id: 'Reportes',  icon: '📈', label: 'Reportes' },
];

// Menú limitado (Solicitantes y Agentes no ven Empresas ni Reportes)
const MENU_LIMITADO = [
  { id: 'Dashboard', icon: '📊', label: 'Dashboard' },
  { id: 'Tickets',   icon: '🎫', label: 'Tickets' },
];

export default function Sidebar({ paginaActual, onCambiarPagina, usuario }) {
  // Si es Admin o SuperUsuario, muestra menú completo. Si no, limitado.
  const menu = (usuario?.rol === 'SuperUsuario')  ? MENU_COMPLETO : MENU_LIMITADO;

  const iniciales = usuario
    ? usuario.nombre.split(' ').slice(0, 2).map(p => p[0]).join('').toUpperCase()
    : '?';

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h2>🎫 Sistema TicketA</h2>
        {/* ⭐ Mostrar la empresa del usuario aquí */}
        {usuario && (
          <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '5px', fontWeight: 'normal' }}>
            {usuario.rol === 'SuperUsuario' ? '🌍 Acceso Total' : (usuario.nombreEmpresa || 'Sin Empresa')}
          </p>
        )}
      </div>

      <nav className="sidebar-nav">
        <ul>
          {menu.map(item => (
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
            <p className="sidebar-user-role">{usuario.rol === 'SuperUsuario' ? 'Admin' : usuario.rol}</p>
          </div>
        </div>
      )}
    </aside>
  );
}