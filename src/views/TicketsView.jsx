import React, { useState, useMemo } from 'react';
import { Cargando, Vacio, ErrorEstado } from '../components/EstadoCarga.jsx';
import Modal from '../components/Modal.jsx';
import TicketFormView from './TicketFormView.jsx';

// ⭐ CORREGIDO: IDs reales de tu BD
const ESTADOS = {
  2: { label: 'Nueva',       className: 'badge-azul'    },
  3: { label: 'Asignada',    className: 'badge-naranja' },
  4: { label: 'En Proceso',  className: 'badge-morado'  },
  5: { label: 'Resuelta',    className: 'badge-verde'   },
  6: { label: 'Cerrada',     className: 'badge-gris'    },
  7: { label: 'Cancelada',   className: 'badge-rojo'    },
};

const PRIORIDADES = {
  1: { label: 'Baja',    className: 'badge-gris'    },
  2: { label: 'Media',   className: 'badge-naranja' },
  3: { label: 'Alta',    className: 'badge-rojo'    },
  4: { label: 'Crítica', className: 'badge-morado'  },
};

export default function TicketsView({ tickets, cargando, error, onReintentar }) {
  const [filtroEstado, setFiltroEstado]         = useState('');
  const [filtroPrioridad, setFiltroPrioridad]   = useState('');
  const [busqueda, setBusqueda]                 = useState('');

  // ⭐ Estado para el modal
  const [modalAbierto, setModalAbierto] = useState(false);
  const [mensajeExito, setMensajeExito] = useState('');

  function abrirModalCrear() {
    setModalAbierto(true);
  }

  function cerrarModal() {
    setModalAbierto(false);
  }

  async function onGuardadoExitoso() {
    cerrarModal();

    setMensajeExito('¡Ticket creado correctamente!'); 
    setTimeout(() => setMensajeExito(''), 3000);
    if (onReintentar) {
      onReintentar();
    }
  }

  const ticketsFiltrados = useMemo(() => {
    return tickets.filter(t => {
      const cumpleEstado    = !filtroEstado    || t.codigoEstado    === Number(filtroEstado);
      const cumplePrioridad = !filtroPrioridad || t.codigoPrioridad === Number(filtroPrioridad);
      const cumpleBusqueda  = !busqueda ||
        t.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
        (t.nombreCreador || '').toLowerCase().includes(busqueda.toLowerCase());
      return cumpleEstado && cumplePrioridad && cumpleBusqueda;
    });
  }, [tickets, filtroEstado, filtroPrioridad, busqueda]);

  function limpiarFiltros() {
    setFiltroEstado('');
    setFiltroPrioridad('');
    setBusqueda('');
  }

  if (cargando) return <Cargando mensaje="Cargando tickets..." />;
  if (error)    return <ErrorEstado mensaje={error} onReintentar={onReintentar} />;

  return (
    <div className="tickets-view">
      {mensajeExito && (
        <div style={{
          backgroundColor: '#10b981',
          color: 'white',
          padding: '12px 20px',
          borderRadius: '8px',
          marginBottom: '15px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1',
          fontWeight:'bold',
          textAlign: 'center'
        }}>
          ✅ {mensajeExito}
          </div>
      )}
      <div className="action-bar">
        <div style={{ margin: 0, padding: 0, background: 'transparent', color: '#64748b' }}>
          <strong>{tickets.length}</strong> tickets en total
        </div>
        <button className="btn btn-primary" onClick={abrirModalCrear}>
          ➕ Nuevo Ticket
        </button>
      </div>

      {/* Filtros */}
      <div className="filtros-bar">
        <div className="filtro-group">
          <label>Estado:</label>
          <select value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)}>
            <option value="">Todos</option>
            <option value="2">Nueva</option>
            <option value="3">Asignada</option>
            <option value="4">En Proceso</option>
            <option value="5">Resuelta</option>
            <option value="6">Cerrada</option>
            <option value="7">Cancelada</option>
          </select>
        </div>

        <div className="filtro-group">
          <label>Prioridad:</label>
          <select value={filtroPrioridad} onChange={e => setFiltroPrioridad(e.target.value)}>
            <option value="">Todas</option>
            <option value="1">Baja</option>
            <option value="2">Media</option>
            <option value="3">Alta</option>
            <option value="4">Crítica</option>
          </select>
        </div>

        <div className="filtro-group filtro-grow">
          <label>Buscar:</label>
          <input
            type="text"
            placeholder="Título o creador..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
          />
        </div>

        <button className="btn btn-secondary" onClick={limpiarFiltros}>
          🗑️ Limpiar
        </button>
      </div>

      {/* Tabla */}
      <div className="table-container">
        {ticketsFiltrados.length === 0 ? (
          <Vacio mensaje="No se encontraron tickets con los filtros aplicados." />
        ) : (
          <>
            <div className="table-info">
              Mostrando {ticketsFiltrados.length} de {tickets.length} tickets
            </div>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Título</th>
                  <th>Creador</th>
                  <th>Asignado</th>
                  <th>Prioridad</th>
                  <th>Estado</th>
                  <th>Fecha Creación</th>
                </tr>
              </thead>
              <tbody>
                {ticketsFiltrados.map(ticket => (
                  <tr key={ticket.codigoTicket}>
                    <td>#{ticket.codigoTicket}</td>
                    <td className="td-titulo">{ticket.titulo}</td>
                    <td>{ticket.nombreCreador}</td>
                    <td>{ticket.nombreAsignado}</td>
                    <td>
                      <span className={`badge ${PRIORIDADES[ticket.codigoPrioridad]?.className || ''}`}>
                        {PRIORIDADES[ticket.codigoPrioridad]?.label || 'N/A'}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${ESTADOS[ticket.codigoEstado]?.className || ''}`}>
                        {ESTADOS[ticket.codigoEstado]?.label || 'Desconocido'}
                      </span>
                    </td>
                    <td>{new Date(ticket.fechaCreacion).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>

      {/* ⭐ AGREGADO: El Modal que faltaba */}
      <Modal
        titulo="Crear Nuevo Ticket"
        abierto={modalAbierto}
        onCerrar={cerrarModal}
      >
        <TicketFormView
          onGuardadoExitoso={onGuardadoExitoso}
          onCancelar={cerrarModal}
        />
      </Modal>
    </div>
  );
}