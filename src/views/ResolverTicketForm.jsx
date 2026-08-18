import React, { useState } from 'react';
import { cambiarEstadoTicket } from '../api/ticketService.js';

export default function ResolverTicketForm({ codigoTicket, onResolucionExitosa, onCancelar }) {
  const [comentario, setComentario] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!comentario.trim()) {
      setError('El comentario de resolución es obligatorio.');
      return;
    }

    setEnviando(true);
    setError(null);

    try {
      // Llamamos a la API, enviando la acción 4 (Resolver) y el comentario
      const respuesta = await cambiarEstadoTicket(codigoTicket, 4, comentario);
      if (respuesta.exito) {
        onResolucionExitosa();
      } else {
        setError(respuesta.mensaje || 'Error al resolver el ticket.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="empresa-form">
      {error && <div className="alert alert-error">⚠️ {error}</div>}

      <div className="form-group">
        <label htmlFor="comentario">¿Cómo se resolvió este ticket? *</label>
        <textarea
          id="comentario"
          name="comentario"
          value={comentario}
          onChange={e => setComentario(e.target.value)}
          rows={5}
          className={error ? 'input-error' : ''}
          placeholder="Describe la solución aplicada..."
          autoFocus
        />
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancelar} disabled={enviando}>
          Cancelar
        </button>
        <button type="submit" className="btn btn-verde" disabled={enviando}>
          {enviando ? 'Guardando...' : '✅ Marcar como Resuelto'}
        </button>
      </div>
    </form>
  );
}