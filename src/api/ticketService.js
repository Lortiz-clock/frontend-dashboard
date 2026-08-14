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