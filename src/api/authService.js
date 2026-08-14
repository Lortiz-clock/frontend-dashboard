// =============================================================================
// authService.js - Servicios de autenticación
// =============================================================================
// Funciones:
//   - login(correo, password): envía credenciales y guarda el token
//   - logout(): limpia la sesión
//   - getToken(): lee el token del localStorage
//   - getUsuario(): lee los datos del usuario del localStorage
//   - isAuthenticated(): verifica si hay sesión activa
// =============================================================================

import { apiClient } from './cliente.js';

const TOKEN_KEY = 'sistema_ticket_jwt';
const USUARIO_KEY = 'sistema_ticket_usuario';

/**
 * Hace login contra /api/Auth/login
 * @param {string} correo
 * @param {string} password
 * @returns {Promise<{exito: boolean, mensaje: string, datos?: {token, expiraSegundos, usuario}}>}
 */
export async function login(correo, password) {
  const respuesta = await apiClient('/api/Auth/login', {
    method: 'POST',
    body: { correo, password },
  });

  // Si el login fue exitoso, guardar token y usuario en localStorage
  if (respuesta.exito && respuesta.datos) {
    localStorage.setItem(TOKEN_KEY, respuesta.datos.token);
    localStorage.setItem(USUARIO_KEY, JSON.stringify(respuesta.datos.usuario));
  }

  return respuesta;
}

/**
 * Cierra sesión: limpia el localStorage
 */
export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USUARIO_KEY);
}

/**
 * Obtiene el token JWT del localStorage
 */
export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Obtiene los datos del usuario del localStorage
 */
export function getUsuario() {
  const usuarioStr = localStorage.getItem(USUARIO_KEY);
  if (!usuarioStr) return null;
  try {
    return JSON.parse(usuarioStr);
  } catch {
    return null;
  }
}

/**
 * Verifica si hay sesión activa
 */
export function isAuthenticated() {
  return getToken() !== null;
}
