// =============================================================================
// EmpresasView.jsx - Listado de empresas + búsqueda por ID
// =============================================================================

import React, { useState, useEffect, useCallback } from 'react';
import { consultarEmpresas, buscarEmpresa, eliminarEmpresa } from '../api/empresaService.js';
import { Cargando, Vacio, ErrorEstado } from '../components/EstadoCarga.jsx';
import Modal from '../components/Modal.jsx';
import EmpresaFormView from './EmpresaFormView.jsx';

export default function EmpresasView({usuario}) {
  const esAdmin = usuario?.rol === 'SuperUsuario';
  const [empresas, setEmpresas]     = useState([]);
  const [cargando, setCargando]     = useState(true);
  const [error, setError]           = useState(null);

  const [modalAbierto, setModalAbierto]         = useState(false);
  const [empresaEditando, setEmpresaEditando]   = useState(null);

  const [busquedaId, setBusquedaId]   = useState('');
  const [buscando, setBuscando]       = useState(false);

  const cargarEmpresas = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const respuesta = await consultarEmpresas();
      if (respuesta.exito) {
        setEmpresas(respuesta.datos || []);
      } else {
        setError(respuesta.mensaje || 'Error al cargar empresas.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarEmpresas();
  }, [cargarEmpresas]);

  function abrirModalCrear() {
    setEmpresaEditando(null);
    setModalAbierto(true);
  }

  function abrirModalEditar(empresa) {
    setEmpresaEditando(empresa);
    setModalAbierto(true);
  }
  async function handleEliminar(empresa){
    const seguro= window.confirm(`Estas seguro de eliminar la empresa"${empresa.nombre}"?`);

    if (seguro){
      try {
        const respuesta = await eliminarEmpresa(empresa.codigoEmpresa);
        if(respuesta.exito) {
          await cargarEmpresas();          
        }
        else{
          alert(respuesta.mensaje || 'No se puede eliminar la empresa');
        }
      }catch(err){
          alert('Error al eliminar: ' + err.mensaje);
        }
      }    
  }

  function cerrarModal() {
    setModalAbierto(false);
    setEmpresaEditando(null);
  }

  async function onGuardadoExitoso() {
    cerrarModal();
    await cargarEmpresas();
  }

  async function buscarPorId() {
    if (!busquedaId || isNaN(Number(busquedaId))) {
      alert('Ingresa un ID válido (número entero).');
      return;
    }

    setBuscando(true);
    try {
      const respuesta = await buscarEmpresa(Number(busquedaId));
      if (respuesta.exito && respuesta.datos) {
        setEmpresaEditando(respuesta.datos);
        setModalAbierto(true);
      } else {
        alert(respuesta.mensaje || 'Empresa no encontrada.');
      }
    } catch (err) {
      alert('Error al buscar: ' + err.message);
    } finally {
      setBuscando(false);
    }
  }

  if (cargando) return <Cargando mensaje="Cargando empresas..." />;
  if (error)    return <ErrorEstado mensaje={error} onReintentar={cargarEmpresas} />;

  return (
    <div className="empresas-view">
      <div className="action-bar">
        <div className="search-group">
          <input
            type="number"
            placeholder="Buscar por ID..."
            value={busquedaId}
            onChange={e => setBusquedaId(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && buscarPorId()}
            min="1"
          />
          <button
            className="btn btn-secondary"
            onClick={buscarPorId}
            disabled={buscando}
          >
            {buscando ? 'Buscando...' : '🔍 Buscar'}
          </button>
        </div>
        {esAdmin && (
        <button className="btn btn-primary" onClick={abrirModalCrear}>
          ➕ Nueva Empresa
        </button>
        )}
      </div>

      <div className="table-container">
        {empresas.length === 0 ? (
          <Vacio mensaje="No hay empresas registradas. Crea la primera con el botón 'Nueva Empresa'." />
        ) : (
          <table className="custom-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Estado</th>
                <th className="td-acciones">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {empresas.map(empresa => (
                <tr key={empresa.codigoEmpresa}>
                  <td>#{empresa.codigoEmpresa}</td>
                  <td className="td-titulo">{empresa.nombre}</td>
                  <td>
                    <span className={`badge ${empresa.estado ? 'badge-verde' : 'badge-gris'}`}>
                      {empresa.estado ? 'Activa' : 'Inactiva'}
                    </span>
                  </td>
                  <td className="td-acciones">
                    {esAdmin ? (
                      <>
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => abrirModalEditar(empresa)}
                    >
                      ✏️ Editar
                    </button>
                    <button 
                    className="btn btn-sm btn-danger"
                    style={{backgroundColor: '#dc2626', color: '#ffffff', borderColor: '#dc2626'}}
                    onClick={() => handleEliminar(empresa)}
                    >
                      🗑️ Eliminar
                    </button>
                    </>
                    ) : ( 
                      <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal
        titulo={empresaEditando ? `Editar Empresa #${empresaEditando.codigoEmpresa}` : 'Nueva Empresa'}
        abierto={modalAbierto}
        onCerrar={cerrarModal}
      >
        <EmpresaFormView
          empresa={empresaEditando}
          onGuardadoExitoso={onGuardadoExitoso}
          onCancelar={cerrarModal}
        />
      </Modal>
    </div>
  );
}
