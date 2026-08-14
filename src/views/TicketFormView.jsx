import React, { useState, useEffect } from 'react';
import { consultarCategorias, consultarPrioridades, consultarAreas } from '../api/catalogoService.js';
import { crearTicket } from '../api/ticketService.js';

export default function TicketFormView({ onGuardadoExitoso, onCancelar }) {
  // Estado del formulario
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    codigoCategoria: '',
    codigoPrioridad: '',
    codigoArea: ''
  });

  // Estados para los catálogos
  const [categorias, setCategorias] = useState([]);
  const [prioridades, setPrioridades] = useState([]);
  const [areas, setAreas] = useState([]);
  const [cargandoCatalogos, setCargandoCatalogos] = useState(true);

  // Estado de envío y errores
  const [enviando, setEnviando] = useState(false);
  const [errores, setErrores] = useState({});
  const [errorApi, setErrorApi] = useState(null);

  // ⭐ Cargar catálogos al montar el componente
  useEffect(() => {
    async function cargarCatalogos() {
      try {
        const [respCat, respPri, respArea] = await Promise.all([
          consultarCategorias(),
          consultarPrioridades(),
          consultarAreas()
        ]);

        if (respCat.exito) setCategorias(respCat.datos || []);
        if (respPri.exito) setPrioridades(respPri.datos || []);
        if (respArea.exito) setAreas(respArea.datos || []);
      } catch (err) {
        setErrorApi('Error al cargar los catálogos: ' + err.message);
      } finally {
        setCargandoCatalogos(false);
      }
    }
    cargarCatalogos();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errores[name]) {
      setErrores(prev => ({ ...prev, [name]: null }));
    }
  }

  function validar() {
    const nuevosErrores = {};
    if (!formData.titulo.trim()) nuevosErrores.titulo = 'El título es obligatorio.';
    else if (formData.titulo.trim().length < 5) nuevosErrores.titulo = 'Debe tener al menos 5 caracteres.';
    
    if (!formData.descripcion.trim()) nuevosErrores.descripcion = 'La descripción es obligatoria.';
    else if (formData.descripcion.trim().length < 10) nuevosErrores.descripcion = 'Debe tener al menos 10 caracteres.';
    
    if (!formData.codigoCategoria) nuevosErrores.codigoCategoria = 'Selecciona una categoría.';
    if (!formData.codigoPrioridad) nuevosErrores.codigoPrioridad = 'Selecciona una prioridad.';
    if (!formData.codigoArea) nuevosErrores.codigoArea = 'Selecciona un área.';

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validar()) return;

    setEnviando(true);
    setErrorApi(null);

    try {
      const respuesta = await crearTicket({
        titulo: formData.titulo.trim(),
        descripcion: formData.descripcion.trim(),
        codigoCategoria: Number(formData.codigoCategoria),
        codigoPrioridad: Number(formData.codigoPrioridad),
        codigoArea: Number(formData.codigoArea)
      });

      if (respuesta.exito) {
        onGuardadoExitoso();
      } else {
        setErrorApi(respuesta.mensaje || 'Error al crear el ticket.');
      }
    } catch (err) {
      setErrorApi(err.message);
    } finally {
      setEnviando(false);
    }
  }

  if (cargandoCatalogos) {
    return <p style={{ textAlign: 'center', padding: '20px' }}>Cargando formulario...</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="empresa-form">
      {errorApi && <div className="alert alert-error">⚠️ {errorApi}</div>}

      <div className="form-group">
        <label htmlFor="titulo">Título *</label>
        <input
          type="text"
          id="titulo"
          name="titulo"
          value={formData.titulo}
          onChange={handleChange}
          maxLength={150}
          className={errores.titulo ? 'input-error' : ''}
          placeholder="Ej: No puedo acceder al sistema"
          autoFocus
        />
        {errores.titulo && <span className="field-error">{errores.titulo}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="descripcion">Descripción *</label>
        <textarea
          id="descripcion"
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          rows={4}
          className={errores.descripcion ? 'input-error' : ''}
          placeholder="Describe el problema o solicitud en detalle..."
        />
        {errores.descripcion && <span className="field-error">{errores.descripcion}</span>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="codigoCategoria">Categoría *</label>
          <select
            id="codigoCategoria"
            name="codigoCategoria"
            value={formData.codigoCategoria}
            onChange={handleChange}
            className={errores.codigoCategoria ? 'input-error' : ''}
          >
            <option value="">Selecciona...</option>
            {categorias.map(cat => (
              <option key={cat.codigoCategoria} value={cat.codigoCategoria}>
                {cat.nombre}
              </option>
            ))}
          </select>
          {errores.codigoCategoria && <span className="field-error">{errores.codigoCategoria}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="codigoPrioridad">Prioridad *</label>
          <select
            id="codigoPrioridad"
            name="codigoPrioridad"
            value={formData.codigoPrioridad}
            onChange={handleChange}
            className={errores.codigoPrioridad ? 'input-error' : ''}
          >
            <option value="">Selecciona...</option>
            {prioridades.map(pri => (
              <option key={pri.codigoPrioridad} value={pri.codigoPrioridad}>
                {pri.nombre}
              </option>
            ))}
          </select>
          {errores.codigoPrioridad && <span className="field-error">{errores.codigoPrioridad}</span>}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="codigoArea">Área Destino *</label>
        <select
          id="codigoArea"
          name="codigoArea"
          value={formData.codigoArea}
          onChange={handleChange}
          className={errores.codigoArea ? 'input-error' : ''}
        >
          <option value="">Selecciona...</option>
          {areas.map(area => (
            <option key={area.codigoArea} value={area.codigoArea}>
              {area.nombre}
            </option>
          ))}
        </select>
        {errores.codigoArea && <span className="field-error">{errores.codigoArea}</span>}
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancelar} disabled={enviando}>
          Cancelar
        </button>
        <button type="submit" className="btn btn-primary" disabled={enviando}>
          {enviando ? 'Guardando...' : '🎫 Crear Ticket'}
        </button>
      </div>
    </form>
  );
}
