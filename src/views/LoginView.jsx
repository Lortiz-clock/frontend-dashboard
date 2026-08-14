// =============================================================================
// LoginView.jsx - Pantalla de login
// =============================================================================

import React, { useState } from 'react';
import { login } from '../api/authService.js';

export default function LoginView({ onLoginExitoso, onVolver }) {
  const [correo, setCorreo]     = useState('');
  const [password, setPassword] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [error, setError]       = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setEnviando(true);
    setError(null);

    try {
      const respuesta = await login(correo, password);

      if (respuesta.exito) {
        onLoginExitoso();
      } else {
        setError(respuesta.mensaje || 'Credenciales inválidas.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">🎫</div>
          <h1>Mesa de Ayuda</h1>
          <p>Inicia sesión para continuar</p>
        </div>

        {error && (
          <div className="alert alert-error">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="correo">Correo electrónico</label>
            <input
              type="email"
              id="correo"
              value={correo}
              onChange={e => setCorreo(e.target.value)}
              required
              autoFocus
              placeholder="admin@techsoluciones.com"
              disabled={enviando}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              disabled={enviando}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={enviando}
          >
            {enviando ? 'Iniciando sesión...' : 'Ingresar'}
          </button>
        </form>

        <div className="login-footer">
          <p><strong>Bienvenido</strong></p>
          
        </div>

        {onVolver && (
          <button
            className="btn btn-link"
            onClick={onVolver}
            disabled={enviando}
          >
            ← Volver al inicio
          </button>
        )}
      </div>
    </div>
  );
}
