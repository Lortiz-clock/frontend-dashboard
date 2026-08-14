// =============================================================================
// WelcomeView.jsx - Pantalla de bienvenida (NUEVA)
// =============================================================================
// Pantalla inicial que ve el usuario cuando entra a la app.
// Tiene 2 botones:
//   - "Iniciar Sesión" → va a la pantalla de login
//   - "Registrarse" → placeholder por ahora (va a login también)
// =============================================================================

import React from 'react';

export default function WelcomeView({ onIrALogin, onIrARegistro }) {
  return (
    <div className="welcome-container">
      <div className="welcome-content">
        <div className="welcome-logo">🎫</div>
        <h1 className="welcome-title">SISTEMA MESA DE AYUDA</h1>
        <p className="welcome-subtitle">
          Plataforma de gestión para soporte.
        </p>

        <div className="welcome-features">
          <div className="welcome-feature">
            <div className="welcome-feature-icon">🎫</div>
            <h3>Gestión de Tickets</h3>
            <p>Crea, asigna y da seguimiento a tickets.</p>
          </div><div className="welcome-feature">
            <div className="welcome-feature-icon">📊</div>
            <h3>Dashboard</h3>
            <p>Visualiza el estado de tus tickets en tiempo real.</p>
          </div>
        </div>

        <div className="welcome-actions">
          <button
            className="btn btn-primary btn-lg"
            onClick={onIrALogin}
          >
            🔑 Iniciar Sesión
          </button>
        </div>

        <p className="welcome-footer">
          © 2026 Sistema mesa de ayuda· Desarrollador Luis Ortiz
        </p>
      </div>
    </div>
  );
}
