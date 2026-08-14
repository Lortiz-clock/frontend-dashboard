// =============================================================================
// ReportesView.jsx - Pantalla de reportes con exportación CSV
// =============================================================================

import React from 'react';
import { Vacio } from '../components/EstadoCarga.jsx';

export default function ReportesView({ tickets }) {
  function exportarCSV() {
    if (!tickets || tickets.length === 0) {
      alert('No hay tickets para exportar.');
      return;
    }

    const headers = ['Código', 'Título', 'Creador', 'Asignado', 'Estado', 'Prioridad', 'Fecha Creación'];
    const filas = tickets.map(t => [
      t.codigoTicket,
      `"${t.titulo.replace(/"/g, '""')}"`,
      `"${t.nombreCreador}"`,
      `"${t.nombreAsignado}"`,
      t.codigoEstado,
      t.codigoPrioridad,
      new Date(t.fechaCreacion).toISOString()
    ]);

    const csv = [headers, ...filas].map(fila => fila.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `reporte_tickets_${new Date().toISOString().slice(0,10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="reportes-view">
      <div className="reportes-grid">
        <div className="reporte-card">
          <div className="reporte-icon">📊</div>
          <h3>Resumen de Tickets</h3>
          <p>Exporta todos los tickets a un archivo CSV compatible con Excel.</p>
          <button className="btn btn-primary" onClick={exportarCSV}>
            📥 Exportar CSV ({tickets?.length || 0} tickets)
          </button>
        </div>

        <div className="reporte-card">
          <div className="reporte-icon">🏢</div>
          <h3>Empresas Activas</h3>
          <p>Reporte de empresas con métricas de tickets por empresa.</p>
          <button className="btn btn-secondary" disabled>
            🚧 Próximamente
          </button>
        </div>

        <div className="reporte-card">
          <div className="reporte-icon">⏱️</div>
          <h3>Tiempos de Atención</h3>
          <p>Análisis de SLA: tiempo promedio de resolución por categoría.</p>
          <button className="btn btn-secondary" disabled>
            🚧 Próximamente
          </button>
        </div>

        <div className="reporte-card">
          <div className="reporte-icon">👤</div>
          <h3>Performance de Agentes</h3>
          <p>Tickets resueltos por agente en el período seleccionado.</p>
          <button className="btn btn-secondary" disabled>
            🚧 Próximamente
          </button>
        </div>
      </div>
    </div>
  );
}
