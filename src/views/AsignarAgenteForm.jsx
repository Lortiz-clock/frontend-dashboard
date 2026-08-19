import React, { useState, useEffect } from 'react';
import { consultarUsuarios } from '../api/usuarioService.js';
import { asignarTicket } from '../api/ticketService.js';

export default function AsignarAgenteForm({ codigoTicket, onAsignacionExitosa, onCancelar }) {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [codigoAgente, setCodigoAgente] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function cargarUsuarios() {
      try {
        const respuesta = await consultarUsuarios();
        if (respuesta.exito) {
          const agentesYAdmins = respuesta.datos.filter(u => u.rol === 'Agente' || u.rol === 'Admin' || u.rol === 'SuperUsuario');
          setUsuarios(agentesYAdmins);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    }
    cargarUsuarios();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!codigoAgente) {
      alert('Por favor selecciona un agente.');
      return;
    }

    setEnviando(true);
    setError(null);

    try {
      // Ojo: el orden de los parámetros es (codigoTicket, codigoAgente)
      const respuesta = await asignarTicket(Number(codigoTicket), Number(codigoAgente));
      if (respuesta.exito) {
        onAsignacionExitosa();
      } else {
        setError(respuesta.mensaje || 'Error al asignar el ticket.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  }

  if (cargando) return <p style={{ textAlign: 'center', padding: '20px' }}>Cargando agentes...</p>;

  return (
    <form onSubmit={handleSubmit} className="empresa-form">
      {error && <div className="alert alert-error">⚠️ {error}</div>}

      <div className="form-group">
        <label htmlFor="codigoAgente">Seleccionar Agente *</label>
        <select
          id="codigoAgente"
          name="codigoAgente"
          value={codigoAgente}
          onChange={e => setCodigoAgente(e.target.value)}
          required
        >
          <option value="">-- Selecciona un agente --</option>
                    {usuarios.map(u => {
            // ⭐ Enmascarar el rol SuperUsuario como Admin para el usuario final
            const rolMostrar = u.rol === 'SuperUsuario' ? 'Admin' : u.rol;
            
            return (
              <option key={u.codigoUsuario} value={u.codigoUsuario}>
                {u.nombre} ({rolMostrar} - {u.nombreArea || 'Sin área'})
              </option>
            );
          })}
        </select>
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancelar} disabled={enviando}>
          Cancelar
        </button>
        <button type="submit" className="btn btn-primary" disabled={enviando}>
          {enviando ? 'Asignando...' : '✅ Asignar Ticket'}
        </button>
      </div>
    </form>
  );
}