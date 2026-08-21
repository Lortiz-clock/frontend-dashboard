import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getToken } from '../api/authService'; // Ajusta la ruta si es necesario

// Diccionario de colores para cada estado
const COLORES_ESTADOS = {
  'Nueva': '#3b82f6',       // Azul
  'Asignada': '#f59e0b',    // Naranja
  'EnProceso': '#8b5cf6',   // Morado
  'Resuelta': '#10b981',    // Verde
  'Cerrada': '#6b7280',     // Gris
  'Cancelada': '#ef4444'    // Rojo
};

export default function ReportesView() {
  const [data, setData] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function cargarDatos() {
      try {
        const token = getToken();
        const response = await fetch('https://localhost:7122/api/Ticket/EstadoTicket', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const resp = await response.json();

        if (resp.exito && resp.datos) {
          
          // 🧠 TRUCO SENIOR: Sumar los tickets agrupándolos solo por Estado
          const agrupado = resp.datos.reduce((acc, curr) => {
            const estado = curr.estado;
            if (!acc[estado]) acc[estado] = 0;
            acc[estado] += curr.cantidadTickets; // Sumamos la cantidad
            return acc;
          }, {});

          // Convertimos el objeto agrupado a un arreglo que Recharts pueda entender
          const datosFormateados = Object.keys(agrupado).map(estado => ({
            name: estado,
            value: agrupado[estado],
            color: COLORES_ESTADOS[estado] || '#cccccc' // Color por defecto
          }));

          setData(datosFormateados);
        }
      } catch (error) {
        console.error("Error al cargar reportes:", error);
      } finally {
        setCargando(false);
      }
    }

    cargarDatos();
  }, []);

  if (cargando) return <div style={{ padding: '40px', textAlign: 'center' }}>Cargando reportes...</div>;

  return (
    <div className="reportes-view" style={{ padding: '30px', height: '100vh' }}>
      
      {/* Título del Dashboard */}
      <div className="action-bar" style={{ marginBottom: '30px' }}>
        <h2 style={{ margin: 0, color: '#1e293b' }}>📈 Dashboard de Reportes</h2>
      </div>

      {/* Tarjeta del Gráfico */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        backgroundColor: 'white', 
        padding: '30px', 
        borderRadius: '12px', 
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        
        <h3 style={{ textAlign: 'center', color: '#475569', marginBottom: '20px' }}>
          Distribución de Tickets por Estado
        </h3>

        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${value} Tickets`, 'Cantidad']} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>

      </div>

    </div>
  );
}