// =============================================================================
// conexionService.js - Servicios para el módulo de Conexión
// =============================================================================

import { apiClient } from './cliente.js';

export async function probarConexion() {
  return await apiClient('/api/Conexion/probar');
}
