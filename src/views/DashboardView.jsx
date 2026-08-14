// =============================================================================
// DashboardView.jsx - Pantalla principal con KPIs
// =============================================================================

import React, { useMemo } from 'react';
import { Cargando, ErrorEstado } from '../components/EstadoCarga.jsx';

const ESTADOS = {
  1: { label: 'Abierto',      color: 'card-blue'   },
  2: { label: 'En Progreso',  color: 'card-yellow' },
  3: { label: 'Resuelto',     color: 'card-green'  },
  4: { label: 'Cerrado',      color: 'card-gray'   },
  5: { label: 'Cancelado',    color: 'card-red'    },
};

export default function DashboardView({ tickets, cargando, error, onReintentar }) {
  const stats = useMemo(() => {
    return {
      total:    tickets.length,
      abiertos: tickets.filter(t => t.codigoEstado === 1).length,
      progreso: tickets.filter(t => t.codigoEstado === 2).length,
      resueltos: tickets.filter(t => t.codigoEstado === 3).length,
      cerrados: tickets.filter(t => t.codigoEstado === 4).length,
    };
  }, [tickets]);

  if (cargando) return <Cargando mensaje="Cargando dashboard..." />;
  if (error)    return <ErrorEstado mensaje={error} onReintentar={onReintentar} />;

  return (
    <div className="dashboard-content">
      <div className="cards-container">
        <div className={`card ${ESTADOS[1].color}`}>
          <h3>Total Tickets</h3>
          <p className="card-number">{stats.total}</p>
          <p className="card-subtitle">Acumulados</p>
        </div>
        <div className={`card ${ESTADOS[2].color}`}>
          <h3>En Progreso</h3>
          <p className="card-number">{stats.progreso}</p>
          <p className="card-subtitle">Siendo atendidos</p>
        </div>
        <div className={`card ${ESTADOS[3].color}`}>
          <h3>Resueltos</h3>
          <p className="card-number">{stats.resueltos}</p>
          <p className="card-subtitle">Pendientes de cerrar</p>
        </div>
        <div className={`card ${ESTADOS[4].color}`}>
          <h3>Cerrados</h3>
          <p className="card-number">{stats.cerrados}</p>
          <p className="card-subtitle">Finalizados</p>
        </div>
      </div>

      <div className="recent-section">
        <div className="section-header">
          <h2>Tickets Recientes</h2>
        </div>
        <div className="table-container">
          {stats.total === 0 ? (
            <div className="estado-container">
              <div className="estado-icon estado-icon-vacio">📭</div>
              <p className="estado-mensaje">Aún no hay tickets registrados.</p>
            </div>
          ) : (
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Título</th>
                  <th>Creador</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {tickets.slice(0, 5).map(ticket => (
                  <tr key={ticket.codigoTicket}>
                    <td>#{ticket.codigoTicket}</td>
                    <td>{ticket.titulo}</td>
                    <td>{ticket.nombreCreador}</td>
                    <td>
                      <span className="badge badge-estado">
                        {ESTADOS[ticket.codigoEstado]?.label || 'Desconocido'}
                      </span>
                    </td>
                    <td>{new Date(ticket.fechaCreacion).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
