// =============================================================================
// empresaService.js - Servicios para el módulo de Empresas
// =============================================================================

import { apiClient } from './cliente.js';

export async function consultarEmpresas() {
  return await apiClient('/api/Empresa/ConsultarEmpresa');
}

export async function agregarEmpresa(empresa) {
  return await apiClient('/api/Empresa/agregarEmpresa', {
    method: 'POST',
    body: empresa,
  });
}

export async function buscarEmpresa(codigoEmpresa) {
  return await apiClient(`/api/Empresa/BuscarEmpresa/${codigoEmpresa}`);
}

export async function editarEmpresa(empresa) {
  return await apiClient('/api/Empresa/EditarEmpresa', {
    method: 'PUT',
    body: empresa,
  });
}
export async function eliminarEmpresa(codigoEmpresa){
  return await apiClient(`/api/Empresa/EliminarEmpresa/${codigoEmpresa}`, {
    method: 'DELETE',
  });
}