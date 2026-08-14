// =============================================================================
// Modal.jsx - Modal reutilizable
// =============================================================================

import React, { useEffect } from 'react';

export default function Modal({ titulo, abierto, onCerrar, children }) {
  useEffect(() => {
    if (!abierto) return;

    function handleEsc(e) {
      if (e.key === 'Escape') onCerrar();
    }

    window.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [abierto, onCerrar]);

  if (!abierto) return null;

  return (
    <div className="modal-overlay" onClick={onCerrar}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{titulo}</h2>
          <button className="modal-close" onClick={onCerrar} aria-label="Cerrar">×</button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
}
