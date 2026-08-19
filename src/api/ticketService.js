// =============================================================================
// ticketService.js - Servicios para el módulo de Tickets
// =============================================================================

import { apiClient } from './cliente.js';

export async function consultarTickets() {
  return await apiClient('/api/Ticket/ConsultarTicket');
}

// Crea un nuevo ticket
export async function crearTicket(ticket) {
  return await apiClient('/api/Ticket/agregarTicket', {
    method: 'POST',
    body: ticket,
  });
}

// Cambiar el estado de un ticket (ej: Iniciar, Resolver, Cerrar)
export async function cambiarEstadoTicket(codigoTicket, accion, comentario = '') {
  return await apiClient('/api/Ticket/CambiarEstado', {
    method: 'POST',
    body: { codigoTicket, accion, comentario }
  });
}
// Asignar un ticket a un agente
export async function asignarTicket(codigoTicket, codigoAgente) {
  return await apiClient('/api/Ticket/AsignarTicket', {
    method: 'POST',
    body: { codigoTicket, codigoAgente }
  });
}

// Obtener el detalle completo de un ticket
export async function obtenerDetalleTicket(codigoTicket) {
  return await apiClient(`/api/Ticket/ObtenerDetalle/${codigoTicket}`);
}

// Subir un adjunto a un ticket creado
export async function subirAdjuntoTicket(codigoTicket, archivo) {
  const formData = new FormData();
  formData.append('archivo', archivo);

  const token = localStorage.getItem('sistema_ticket_jwt');

  const response = await fetch(`https://localhost:7122/api/Ticket/SubirAdjunto/${codigoTicket}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });

  return await response.json();
}