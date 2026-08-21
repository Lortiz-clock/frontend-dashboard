import React, { useState, useEffect } from 'react';
import { agregarUsuario, editarUsuario } from '../api/usuarioService.js';
import { consultarEmpresas } from '../api/empresaService.js';
import { consultarAreas } from '../api/catalogoService.js';

const ROLES = ['SuperUsuario', 'Admin', 'Agente', 'Solicitante', 'SolicitantePlus'];

export default function UsuarioFormView({ usuario, onGuardadoExitoso, onCancelar }) {
  const esEdicion = usuario !== null;

  const [formData, setFormData] = useState({
    nombre: usuario?.nombre || '',
    correo: usuario?.correo || '',
    codigoEmpresa: usuario?.codigoEmpresa || '',
    codigoArea: usuario?.codigoArea || '',
    rol: usuario?.rol || 'Solicitante',
    estado: usuario?.estado ?? true,
    passwordHash: usuario?.passwordHash || ''
  });

  const [empresas, setEmpresas] = useState([]);
  const [areas, setAreas] = useState([]);
  const [cargandoCatalogos, setCargandoCatalogos] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [errorApi, setErrorApi] = useState(null);

  useEffect(() => {
    async function cargarCatalogos() {
      try {
        const [respEmp, respArea] = await Promise.all([
          consultarEmpresas(),
          consultarAreas()
        ]);
        if (respEmp.exito) setEmpresas(respEmp.datos || []);
        if (respArea.exito) setAreas(respArea.datos || []);
      } catch (err) {
        setErrorApi('Error al cargar catálogos: ' + err.message);
      } finally {
        setCargandoCatalogos(false);
      }
    }
    cargarCatalogos();
  }, []);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setEnviando(true);
    setErrorApi(null);

    try {
      // Mapeo simple al formato que espera tu backend
      const payload = {
        CodigoUsuario: usuario?.codigoUsuario || 0,
        Nombre: formData.nombre,
        Correo: formData.correo,
        CodigoEmpresa: Number(formData.codigoEmpresa),
        CodigoArea: Number(formData.codigoArea),
        Rol: formData.rol,
        Estado: formData.estado,
        PasswordHash: formData.passwordHash // En edición puede ir vacío si no la cambias
      };

      const respuesta = esEdicion 
        ? await editarUsuario(payload) 
        : await agregarUsuario(payload);

      if (respuesta.exito) {
        onGuardadoExitoso();
      } else {
        setErrorApi(respuesta.mensaje || 'Error al guardar el usuario.');
      }
    } catch (err) {
      setErrorApi(err.message);
    } finally {
      setEnviando(false);
    }
  }

  if (cargandoCatalogos) return <p style={{ textAlign: 'center', padding: '20px' }}>Cargando formulario...</p>;

  return (
    <form onSubmit={handleSubmit} className="empresa-form">
      {errorApi && <div className="alert alert-error">⚠️ {errorApi}</div>}

      <div className="form-group">
        <label>Nombre Completo *</label>
        <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required className="form-control" />
      </div>

      <div className="form-group">
        <label>Correo Electrónico *</label>
        <input type="email" name="correo" value={formData.correo} onChange={handleChange} required className="form-control" />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Empresa *</label>
          <select name="codigoEmpresa" value={formData.codigoEmpresa} onChange={handleChange} required className="form-control">
            <option value="">Selecciona...</option>
            {empresas.map(e => <option key={e.codigoEmpresa} value={e.codigoEmpresa}>{e.nombre}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label>Área</label>
          <select name="codigoArea" value={formData.codigoArea} onChange={handleChange} className="form-control">
            <option value="">Sin Área</option>
            {areas.map(a => <option key={a.codigoArea} value={a.codigoArea}>{a.nombre}</option>)}
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Rol *</label>
          <select name="rol" value={formData.rol} onChange={handleChange} required className="form-control">
            {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label>Password</label>
          <input type="text" name="passwordHash" value={formData.passwordHash} onChange={handleChange} placeholder="Escriba para cambiar contraceña" className="form-control" />
        </div>
      </div>

      <div className="form-group">
        <label className="checkbox-label">
          <input type="checkbox" name="estado" checked={formData.estado} onChange={handleChange} />
          <span>Usuario Activo</span>
        </label>
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancelar} disabled={enviando}>Cancelar</button>
        <button type="submit" className="btn btn-primary" disabled={enviando}>
          {enviando ? 'Guardando...' : (esEdicion ? '💾 Guardar Cambios' : '➕ Crear Usuario')}
        </button>
      </div>
    </form>
  );
}