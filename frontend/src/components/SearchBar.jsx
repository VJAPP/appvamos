// ============================================================
// SEARCHBAR.JSX — Buscador y filtros para las listas
// ============================================================
// Tiene dos modos:
//   - Barra de texto simple (busca en origen, destino y nombre)
//   - Panel de filtros avanzados (tipo, colaboración, fecha)
// ============================================================

import { useState } from 'react';
import { colors } from '../theme';

export default function SearchBar({ onFilter, type = 'trips' }) {

  const [text,        setText]        = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filterType,  setFilterType]  = useState('all');   // 'all', 'offer', 'request' / 'carry', 'send'
  const [minCollab,   setMinCollab]   = useState('');
  const [maxCollab,   setMaxCollab]   = useState('');
  const [filterDate,  setFilterDate]  = useState('');

  // Cada vez que cambia cualquier valor, construimos el objeto de filtros
  // y se lo pasamos al componente padre
  const applyFilters = (newText, newType, newMin, newMax, newDate) => {
    onFilter({
      text:      newText,
      type:      newType,
      minCollab: newMin,
      maxCollab: newMax,
      date:      newDate,
    });
  };

  const handleText = (e) => {
    setText(e.target.value);
    applyFilters(e.target.value, filterType, minCollab, maxCollab, filterDate);
  };

  const handleType = (val) => {
    setFilterType(val);
    applyFilters(text, val, minCollab, maxCollab, filterDate);
  };

  const handleMinCollab = (e) => {
    setMinCollab(e.target.value);
    applyFilters(text, filterType, e.target.value, maxCollab, filterDate);
  };

  const handleMaxCollab = (e) => {
    setMaxCollab(e.target.value);
    applyFilters(text, filterType, minCollab, e.target.value, filterDate);
  };

  const handleDate = (e) => {
    setFilterDate(e.target.value);
    applyFilters(text, filterType, minCollab, maxCollab, e.target.value);
  };

  const handleClear = () => {
    setText('');
    setFilterType('all');
    setMinCollab('');
    setMaxCollab('');
    setFilterDate('');
    onFilter({ text: '', type: 'all', minCollab: '', maxCollab: '', date: '' });
  };

  // ¿Hay algún filtro activo distinto de los valores por defecto?
  const hasActiveFilters = text || filterType !== 'all' || minCollab || maxCollab || filterDate;

  // Labels para el selector de tipo según la sección
  const typeOptions = type === 'trips'
    ? [
        { value: 'all',     label: 'Todos' },
        { value: 'offer',   label: '🚗 Conductores' },
        { value: 'request', label: '🙋 Pasajeros' },
      ]
    : [
        { value: 'all',  label: 'Todos' },
        { value: 'carry', label: '🚚 Pueden llevar' },
        { value: 'send',  label: '📦 Necesitan enviar' },
      ];

  return (
    <div style={{ marginBottom: '16px' }}>

      {/* ── Barra de búsqueda principal ── */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <span style={{
            position: 'absolute', left: '12px', top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '16px', pointerEvents: 'none',
          }}>
            🔍
          </span>
          <input
            type="text"
            placeholder="Buscar por origen, destino o nombre..."
            value={text}
            onChange={handleText}
            style={{
              width: '100%',
              padding: '11px 12px 11px 38px',
              borderRadius: '10px',
              border: `1px solid ${colors.gray300}`,
              fontSize: '14px',
              boxSizing: 'border-box',
              fontFamily: 'Arial, sans-serif',
            }}
          />
        </div>

        {/* Botón filtros */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          style={{
            padding: '11px 14px',
            borderRadius: '10px',
            border: `1px solid ${showFilters ? colors.cyan : colors.gray300}`,
            backgroundColor: showFilters ? colors.cyanLight : 'white',
            color: showFilters ? colors.cyanDark : colors.gray500,
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 'bold',
            whiteSpace: 'nowrap',
            position: 'relative',
          }}
        >
          ⚙️ Filtros
          {/* Punto rojo si hay filtros activos */}
          {hasActiveFilters && (
            <span style={{
              position: 'absolute', top: '6px', right: '6px',
              width: '8px', height: '8px',
              backgroundColor: colors.error,
              borderRadius: '50%',
            }} />
          )}
        </button>
      </div>

      {/* ── Panel de filtros avanzados ── */}
      {showFilters && (
        <div style={{
          backgroundColor: 'white',
          border: `1px solid ${colors.gray300}`,
          borderRadius: '12px',
          padding: '16px',
        }}>

          {/* Tipo */}
          <p style={{ fontSize: '12px', fontWeight: '600', color: colors.gray500, margin: '0 0 8px' }}>
            TIPO
          </p>
          <div style={{ display: 'flex', gap: '6px', marginBottom: '14px', flexWrap: 'wrap' }}>
            {typeOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleType(opt.value)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '20px',
                  border: `1px solid ${filterType === opt.value ? colors.cyan : colors.gray300}`,
                  backgroundColor: filterType === opt.value ? colors.cyanLight : 'white',
                  color: filterType === opt.value ? colors.cyanDark : colors.gray500,
                  fontSize: '13px',
                  fontWeight: filterType === opt.value ? 'bold' : 'normal',
                  cursor: 'pointer',
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Rango de colaboración */}
          <p style={{ fontSize: '12px', fontWeight: '600', color: colors.gray500, margin: '0 0 8px' }}>
            COLABORACIÓN (número sin $)
          </p>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
            <input
              type="number"
              placeholder="Mínimo"
              value={minCollab}
              onChange={handleMinCollab}
              style={{
                flex: 1, padding: '8px 10px',
                borderRadius: '8px',
                border: `1px solid ${colors.gray300}`,
                fontSize: '14px',
              }}
            />
            <span style={{ alignSelf: 'center', color: colors.gray300 }}>—</span>
            <input
              type="number"
              placeholder="Máximo"
              value={maxCollab}
              onChange={handleMaxCollab}
              style={{
                flex: 1, padding: '8px 10px',
                borderRadius: '8px',
                border: `1px solid ${colors.gray300}`,
                fontSize: '14px',
              }}
            />
          </div>

          {/* Filtro de fecha (texto libre) */}
          <p style={{ fontSize: '12px', fontWeight: '600', color: colors.gray500, margin: '0 0 8px' }}>
            FECHA (busca en el texto)
          </p>
          <input
            type="text"
            placeholder="Ej: viernes, 18/4, abril..."
            value={filterDate}
            onChange={handleDate}
            style={{
              width: '100%',
              padding: '8px 10px',
              borderRadius: '8px',
              border: `1px solid ${colors.gray300}`,
              fontSize: '14px',
              boxSizing: 'border-box',
              marginBottom: '14px',
            }}
          />

          {/* Botón limpiar */}
          {hasActiveFilters && (
            <button
              onClick={handleClear}
              style={{
                width: '100%',
                padding: '9px',
                borderRadius: '8px',
                border: `1px solid ${colors.error}`,
                backgroundColor: 'white',
                color: colors.error,
                fontSize: '13px',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              🗑️ Limpiar filtros
            </button>
          )}
        </div>
      )}

    </div>
  );
}