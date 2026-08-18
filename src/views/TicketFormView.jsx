import React, { useState, useEffect } from 'react';
import { consultarCategorias, consultarPrioridades, consultarAreas } from '../api/catalogoService.js';
import { crearTicket, subirAdjuntoTicket } from '../api/ticketService.js';

export default function TicketFormView({ onGuardadoExitoso, onCancelar }) {
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    codigoCategoria: '',
    codigoPrioridad: '',
    codigoArea: ''
  });

  const [categorias, setCategorias] = useState([]);
  const [prioridades, setPrioridades] = useState([]);
  const [areas, setAreas] = useState([]);
  const [cargandoCatalogos, setCargandoCatalogos] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [errores, setErrores] = useState({});
  const [errorApi, setErrorApi] = useState(null);
  const [archivoSeleccionado, setArchivoSeleccionado] = useState(null); // ⭐ Nuevo estado

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

  // ⭐ Manejar la selección de archivo
  function handleFileChange(e) {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validar tamaño (5MB máximo)
      if (file.size > 5 * 1024 * 1024) {
        setErrorApi('El archivo supera el límite de 5MB.');
        e.target.value = ''; // Limpiar el input
        return;
      }
      
      // Validar extensión
      const extensionesPermitidas = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
      if (!extensionesPermitidas.includes(file.type)) {
        setErrorApi('Solo se permiten imágenes (JPG, PNG, GIF) o PDF.');
        e.target.value = '';
        return;
      }

      setArchivoSeleccionado(file);
      setErrorApi(null);
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
      // 1. Crear el ticket
      const respuesta = await crearTicket({
        titulo: formData.titulo.trim(),
        descripcion: formData.descripcion.trim(),
        codigoCategoria: Number(formData.codigoCategoria),
        codigoPrioridad: Number(formData.codigoPrioridad),
        codigoArea: Number(formData.codigoArea)
      });

      if (respuesta.exito) {
        // 2. Si hay archivo, subirlo
        if (archivoSeleccionado) {
          // Aquí asumimos que la respuesta de crearTicket nos devuelve el ID del nuevo ticket
          // Si tu API no lo devuelve, tendríamos que ajustar el backend para que lo devuelva.
          const nuevoTicketId = respuesta.datos?.codigoTicket || respuesta.datos;
          
          if (nuevoTicketId) {
            const respAdjunto = await subirAdjuntoTicket(nuevoTicketId, archivoSeleccionado);
            if (!respAdjunto.exito) {
              // Si el adjunto falla, el ticket ya fue creado, pero avisamos al usuario
              alert('El ticket se creó, pero hubo un error al subir el archivo: ' + (respAdjunto.mensaje || ''));
            }
          }
        }
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

      {/* ⭐ NUEVO: Input para adjuntar archivo */}
      <div className="form-group">
        <label htmlFor="adjunto">Adjuntar captura o archivo (Opcional)</label>
        <input
          type="file"
          id="adjunto"
          name="adjunto"
          onChange={handleFileChange}
          accept="image/png, image/jpeg, image/gif, application/pdf"
          className="input-file"
        />
        <span className="field-hint">Formatos permitidos: JPG, PNG, GIF, PDF (Máx 5MB)</span>
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