import { apiClient } from './cliente.js';

// Obtiene la lista de usuarios
export async function consultarUsuarios() {
  return await apiClient('/api/Usuario/ListaUsuario');
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
      // ⚠️ NO poner 'Content-Type': 'application/json' aquí, 
      // el navegador lo pone solo con el boundary correcto para FormData
    },
    body: formData
  });

  return await response.json();
}