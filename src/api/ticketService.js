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