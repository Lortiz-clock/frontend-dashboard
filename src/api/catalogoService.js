import {apiClient} from './cliente.js';
//obtener categoria activa
export async function consultarCategorias(){
    return await apiClient('/api/Categoria/ConsultarCategoria');
}
//obtener prioridades activas
export async function consultarPrioridades(){
return await apiClient('/api/Prioridad/ConsultarPrioridad');
}

// Obtiene las áreas activas
export async function consultarAreas() {
  return await apiClient('/api/Area/ConsultarArea');
}