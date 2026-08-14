// =============================================================================
// cliente.js - Cliente HTTP centralizado con interceptor de JWT
// =============================================================================
// Responsabilidades:
//   1. URL base configurable (un solo lugar para cambiarla)
//   2. Inyectar automáticamente el header Authorization: Bearer <token>
//   3. Si la API responde 401 (token inválido/expirado), limpiar sesión
//   4. Normalizar errores para que el caller reciba siempre RespuestaApi
// =============================================================================

export const API_BASE_URL = 'https://localhost:7122';

// Importamos authService (import circular controlado)
import { getToken, logout } from './authService.js';

/**
 * Wrapper de fetch con inyección automática de JWT
 */
export async function apiClient(ruta, opciones = {}) {
  const urlCompleta = `${API_BASE_URL}${ruta}`;

  const config = {
    method: opciones.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(opciones.headers || {}),
    },
  };

  // ⭐ INTERCEPTOR: si hay token, lo inyectamos automáticamente
  const token = getToken();
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  // Body
  if (opciones.body && config.method !== 'GET' && config.method !== 'HEAD') {
    config.body = typeof opciones.body === 'string'
      ? opciones.body
      : JSON.stringify(opciones.body);
  }

  try {
    const response = await fetch(urlCompleta, config);

    // ⭐ INTERCEPTOR 401: si el token expiró o es inválido, cerrar sesión
    if (response.status === 401) {
      logout();
      // Redirigir al welcome recargando la página
      window.location.reload();
      return { exito: false, mensaje: 'Sesión expirada.', datos: null, detalle: 'NO_AUTENTICADO' };
    }

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);
      }
      return errorData;
    }

    return await response.json();
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        'No se pudo conectar con el servidor. ' +
        'Verifica que la API esté corriendo en ' + API_BASE_URL +
        ' y que el CORS esté configurado para localhost:5173.'
      );
    }
    throw error;
  }
}
