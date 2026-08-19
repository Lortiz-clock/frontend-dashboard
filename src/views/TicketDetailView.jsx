import React, { useState, useEffect } from 'react';
import { obtenerDetalleTicket } from '../api/ticketService.js';
import { Cargando, ErrorEstado } from '../components/EstadoCarga.jsx';

export default function TicketDetailView({ codigoTicket, onCerrar }) {
  const [ticket, setTicket] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function cargarDetalle() {
      try {
        const respuesta = await obtenerDetalleTicket(codigoTicket);
        if (respuesta.exito) {
          setTicket(respuesta.datos);
        } else {
          setError(respuesta.mensaje || 'Error al cargar el ticket.');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    }
    cargarDetalle();
  }, [codigoTicket]);

  if (cargando) return <Cargando mensaje="Cargando detalle del ticket..." />;
  if (error) return <ErrorEstado mensaje={error} />;
  if (!ticket) return <p>No se encontró el ticket.</p>;

  return (
    <div className="ticket-detail">
      {/* Encabezado */}
      <div className="detail-header">
        <div>
          <h1>Ticket #{ticket.codigoTicket}</h1>
          <p className="detail-subtitle">{ticket.titulo}</p>
        </div>
        <button className="btn btn-secondary" onClick={onCerrar}>← Volver</button>
      </div>

      {/* Grid de información principal */}
      <div className="detail-grid">
        <div className="detail-card">
          <h3>Información General</h3>
          <p><strong>Estado:</strong> {ticket.nombreEstado}</p>
          <p><strong>Prioridad:</strong> {ticket.nombrePrioridad}</p>
          <p><strong>Categoría:</strong> {ticket.nombreCategoria}</p>
          <p><strong>Empresa:</strong> {ticket.nombreEmpresa}</p>
          <p><strong>Área:</strong> {ticket.nombreArea}</p>
        </div>

        <div className="detail-card">
          <h3>Personas Involucradas</h3>
          <p><strong>Creado por:</strong> {ticket.nombreCreador}</p>
          <p><strong>Asignado a:</strong> {ticket.nombreAsignado}</p>
        </div>

        <div className="detail-card">
          <h3>Fechas</h3>
          <p><strong>Creado:</strong> {new Date(ticket.fechaCreacion).toLocaleString()}</p>
          {ticket.fechaCierre && ticket.fechaCierre !== '1900-01-01T00:00:00' && (
            <p><strong>Cerrado:</strong> {new Date(ticket.fechaCierre).toLocaleString()}</p>
          )}
        </div>
      </div>

      {/* Descripción del problema */}
      <div className="detail-card">
        <h3>Descripción del Problema</h3>
        <p className="detail-description">{ticket.descripcion}</p>
      </div>

      {/* Historial de mensajes */}
      {ticket.mensajes && ticket.mensajes.length > 0 && (
        <div className="detail-card">
          <h3>Historial de Resolución</h3>
          <div className="messages-list">
            {ticket.mensajes.map(msg => (
              <div key={msg.codigoMensaje} className="message-item">
                <div className="message-header">
                  <strong>{msg.nombreUsuario}</strong>
                  <span>{new Date(msg.fechaCreacion).toLocaleString()}</span>
                </div>
                <p>{msg.mensaje}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Archivos Adjuntos */}
      {ticket.adjuntos && ticket.adjuntos.length > 0 && (
        <div className="detail-card">
          <h3>Archivos Adjuntos</h3>
          <div className="attachments-list">
            {ticket.adjuntos.map(adj => (
              <div key={adj.codigoAdjunto} className="attachment-item">
                <span className="attachment-icon">
                  {adj.tipoArchivo.includes('image') ? '🖼️' : 
                   adj.tipoArchivo.includes('pdf') ? '📄' : 
                   adj.tipoArchivo.includes('zip') || adj.tipoArchivo.includes('rar') ? '🗜️' : 
                   adj.tipoArchivo.includes('sheet') || adj.tipoArchivo.includes('excel') ? '📊' :
                   adj.tipoArchivo.includes('word') || adj.tipoArchivo.includes('document') ? '📝' : '📎'}
                </span>
                <span className="attachment-name">{adj.nombreArchivo}</span>
                <div className="attachment-actions">
                  <a 
                    href={`https://localhost:7122${adj.rutaArchivo}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-secondary"
                  >
                    👁️ Ver
                  </a>
                  <a 
                    href={`https://localhost:7122${adj.rutaArchivo}`} 
                    download={adj.nombreArchivo}
                    className="btn btn-sm btn-primary"
                  >
                    ⬇️ Descargar
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
    </div>
  );
}