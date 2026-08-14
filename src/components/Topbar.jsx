// =============================================================================
// Topbar.jsx - Barra superior con título y botón de logout
// =============================================================================

import React from 'react';

export default function Topbar({ titulo, onLogout }) {
  return (
    <header className="topbar">
      <h1>{titulo}</h1>
      <div className="topbar-actions">
        <button className="btn btn-sm btn-logout" onClick={onLogout}>
          🚪 Cerrar Sesión
        </button>
      </div>
    </header>
  );
}
