// =============================================================================
// EmpresaFormView.jsx - Formulario para crear o editar empresa
// =============================================================================

import React, { useState } from 'react';
import { agregarEmpresa, editarEmpresa } from '../api/empresaService.js';

export default function EmpresaFormView({ empresa, onGuardadoExitoso, onCancelar }) {
  const esEdicion = empresa !== null;

  const [formData, setFormData] = useState({
    nombre: empresa?.nombre || '',
    estado: empresa?.estado ?? true,
  });

  const [errores, setErrores] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [errorApi, setErrorApi] = useState(null);

  function validar() {
    const nuevosErrores = {};
    if (!formData.nombre.trim()) {
      nuevosErrores.nombre = 'El nombre es obligatorio.';
    } else if (formData.nombre.trim().length < 3) {
      nuevosErrores.nombre = 'El nombre debe tener al menos 3 caracteres.';
    } else if (formData.nombre.length > 50) {
      nuevosErrores.nombre = 'El nombre no puede exceder 50 caracteres.';
    }
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errores[name]) {
      setErrores(prev => ({ ...prev, [name]: null }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validar()) return;

    setEnviando(true);
    setErrorApi(null);

    try {
      const payload = esEdicion
        ? {
            codigoEmpresa: empresa.codigoEmpresa,
            nombre: formData.nombre.trim(),
            estado: formData.estado,
          }
        : {
            nombre: formData.nombre.trim(),
            estado: formData.estado,
          };

      const respuesta = esEdicion
        ? await editarEmpresa(payload)
        : await agregarEmpresa(payload);

      if (respuesta.exito) {
        onGuardadoExitoso();
      } else {
        setErrorApi(respuesta.mensaje || respuesta.detalle || 'Error al guardar.');
      }
    } catch (err) {
      setErrorApi(err.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="empresa-form">
      {errorApi && (
        <div className="alert alert-error">⚠️ {errorApi}</div>
      )}

      <div className="form-group">
        <label htmlFor="nombre">Nombre de la Empresa *</label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          maxLength={50}
          className={errores.nombre ? 'input-error' : ''}
          placeholder="Ej: TechSoluciones S.A."
          autoFocus
        />
        {errores.nombre && <span className="field-error">{errores.nombre}</span>}
        <span className="field-hint">{formData.nombre.length}/50 caracteres</span>
      </div>

      <div className="form-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="estado"
            checked={formData.estado}
            onChange={handleChange}
          />
          <span>Empresa activa</span>
        </label>
        <span className="field-hint">
          Las empresas inactivas no aparecen en listados públicos pero conservan
          sus tickets históricos.
        </span>
      </div>

      <div className="form-actions">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onCancelar}
          disabled={enviando}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={enviando}
        >
          {enviando ? 'Guardando...' : (esEdicion ? '💾 Guardar Cambios' : '➕ Crear Empresa')}
        </button>
      </div>
    </form>
  );
}
