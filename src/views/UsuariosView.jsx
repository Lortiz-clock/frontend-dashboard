import React, { useState, useEffect, useCallback } from 'react';
import { consultarUsuarios } from '../api/usuarioService.js';
import { Cargando, Vacio, ErrorEstado } from '../components/EstadoCarga.jsx';
import Modal from '../components/Modal.jsx';
import UsuarioFormView from './UsuarioFormView.jsx';

export default function UsuariosView({ usuario }) {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState(null);

  const cargarUsuarios = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const respuesta = await consultarUsuarios();
      if (respuesta.exito) {
        setUsuarios(respuesta.datos || []);
      } else {
        setError(respuesta.mensaje || 'Error al cargar usuarios.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarUsuarios();
  }, [cargarUsuarios]);

  function abrirModalCrear() {
    setUsuarioEditando(null);
    setModalAbierto(true);
  }

  function abrirModalEditar(u) {
    setUsuarioEditando(u);
    setModalAbierto(true);
  }

  function cerrarModal() {
    setModalAbierto(false);
    setUsuarioEditando(null);
  }

  async function onGuardadoExitoso() {
    cerrarModal();
    await cargarUsuarios();
  }

  // Solo SuperUsuario o Admin pueden ver este módulo y crear/editar
  const esAdmin = usuario?.rol === 'SuperUsuario' || usuario?.rol === 'Admin';

  if (cargando) return <Cargando mensaje="Cargando usuarios..." />;
  if (error) return <ErrorEstado mensaje={error} onReintentar={cargarUsuarios} />;

  return (
    <div className="empresas-view">
      <div className="action-bar">
        <div style={{ margin: 0, padding: 0, background: 'transparent', color: '#64748b' }}>
          <strong>{usuarios.length}</strong> usuarios en total
        </div>
        {esAdmin && (
          <button className="btn btn-primary" onClick={abrirModalCrear}>
            ➕ Nuevo Usuario
          </button>
        )}
      </div>

      <div className="table-container">
        {usuarios.length === 0 ? (
          <Vacio mensaje="No hay usuarios registrados." />
        ) : (
          <table className="custom-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Rol</th>
                <th>Empresa</th>
                <th>Área</th>
                <th>Estado</th>
                {esAdmin && <th className="td-acciones">Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {usuarios.map(u => (
                <tr key={u.codigoUsuario}>
                  <td>#{u.codigoUsuario}</td>
                  <td className="td-titulo">{u.nombre}</td>
                  <td>{u.correo}</td>
                  <td>{u.rol === 'SuperUsuario' ? 'Admin' : u.rol}</td>
                  <td>{u.nombreEmpresa || '—'}</td>
                  <td>{u.nombreArea || '—'}</td>
                  <td>
                    <span className={`badge ${u.estado ? 'badge-verde' : 'badge-gris'}`}>
                      {u.estado ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  {esAdmin && (
                    <td className="td-acciones">
                      <button className="btn btn-sm btn-secondary" onClick={() => abrirModalEditar(u)}>
                        ✏️ Editar
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal
        titulo={usuarioEditando ? `Editar Usuario #${usuarioEditando.codigoUsuario}` : 'Nuevo Usuario'}
        abierto={modalAbierto}
        onCerrar={cerrarModal}
      >
        <UsuarioFormView
          usuario={usuarioEditando}
          onGuardadoExitoso={onGuardadoExitoso}
          onCancelar={cerrarModal}
        />
      </Modal>
    </div>
  );
}