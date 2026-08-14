// =============================================================================
// EstadoCarga.jsx - Componentes para los 3 estados de una vista
// =============================================================================

import React from 'react';

export function Cargando({ mensaje = 'Cargando...' }) {
  return (
    <div className="estado-container">
      <div className="spinner"></div>
      <p className="estado-mensaje">{mensaje}</p>
    </div>
  );
}

export function Vacio({ mensaje = 'No hay registros para mostrar.' }) {
  return (
    <div className="estado-container">
      <div className="estado-icon estado-icon-vacio">📭</div>
      <p className="estado-mensaje">{mensaje}</p>
    </div>
  );
}

export function ErrorEstado({ mensaje, onReintentar }) {
  return (
    <div className="estado-container">
      <div className="estado-icon estado-icon-error">⚠️</div>
      <p className="estado-mensaje estado-mensaje-error">{mensaje}</p>
      {onReintentar && (
        <button className="btn btn-reintentar" onClick={onReintentar}>
          🔄 Reintentar
        </button>
      )}
    </div>
  );
}
