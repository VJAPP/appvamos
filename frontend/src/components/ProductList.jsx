import { styles, colors } from '../theme';
import RouteButton        from './RouteButton';
import SearchBar          from './SearchBar';
import { useState }       from 'react';

const SIZE_LABELS = {
  'pequeño': '🟢 Pequeño',
  'mediano': '🟡 Mediano',
  'grande':  '🔴 Grande',
};

const extractNumber = (str) => {
  if (!str) return 0;
  const num = str.replace(/[^0-9]/g, '');
  return num ? parseInt(num) : 0;
};

export default function ProductList({ products, currentEmail, onConnect, onDelete, onBack }) {

  const [activeFilters, setActiveFilters] = useState(null);

  const filteredProducts = products.filter((product) => {
    if (!activeFilters) return true;
    const { text, type, minCollab, maxCollab, date } = activeFilters;

    if (text) {
      const q = text.toLowerCase();
      const match =
        product.origin?.toLowerCase().includes(q)       ||
        product.destination?.toLowerCase().includes(q)  ||
        product.creator_name?.toLowerCase().includes(q) ||
        product.description?.toLowerCase().includes(q);
      if (!match) return false;
    }

    if (type && type !== 'all' && product.type !== type) return false;

    if (minCollab) {
      if (extractNumber(product.collaboration) < parseInt(minCollab)) return false;
    }
    if (maxCollab) {
      if (extractNumber(product.collaboration) > parseInt(maxCollab)) return false;
    }
    if (date) {
      if (!product.date?.toLowerCase().includes(date.toLowerCase())) return false;
    }

    return true;
  });

  return (
    <div style={styles.page}>
      <div style={{ width: '100%', maxWidth: '480px' }}>

        <button style={styles.btnGray} onClick={onBack}>← Volver</button>
        <h2 style={{ color: colors.gray800 }}>📦 Envíos disponibles</h2>

        {/* Buscador */}
        <SearchBar type="products" onFilter={setActiveFilters} />

        {/* Contador */}
        {activeFilters && (
          <p style={{ fontSize: '13px', color: colors.gray500, marginBottom: '12px' }}>
            {filteredProducts.length === 0
              ? 'No se encontraron resultados.'
              : `${filteredProducts.length} resultado${filteredProducts.length !== 1 ? 's' : ''}`}
          </p>
        )}

        {products.length === 0 && (
          <div style={styles.card}>
            <p style={{ textAlign: 'center', color: colors.gray500 }}>
              No hay publicaciones todavía.
            </p>
          </div>
        )}

        {filteredProducts.map((product) => {
          const isCarry  = product.type === 'carry';
          const isOwner  = product.creator_email === currentEmail;
          const accent   = isCarry ? colors.cyan : colors.orange;
          const accentBg = isCarry ? colors.cyanLight : colors.orangeLight;

          return (
            <div key={product.id} style={{ ...styles.card, borderLeft: `4px solid ${accent}` }}>

              <span style={{
                backgroundColor: accentBg, color: accent,
                borderRadius: '20px', padding: '2px 12px',
                fontSize: '12px', fontWeight: 'bold',
              }}>
                {isCarry ? '🚚 Puede llevar' : '📦 Necesita enviar'}
              </span>

              <h3 style={{ margin: '10px 0 4px', color: colors.gray800 }}>
                {product.origin} → {product.destination}
              </h3>
              <p style={{ margin: '2px 0', color: colors.gray500, fontSize: '14px' }}>📅 {product.date}</p>
              <p style={{ margin: '2px 0', color: colors.gray500, fontSize: '14px' }}>👤 {product.creator_name}</p>
              <p style={{ margin: '2px 0', color: colors.gray500, fontSize: '14px' }}>
                📐 {SIZE_LABELS[product.package_size] || product.package_size}
              </p>
              {product.description && (
                <p style={{ margin: '4px 0', color: colors.gray500, fontSize: '14px' }}>
                  📝 {product.description}
                </p>
              )}
              <p style={{ margin: '4px 0', color: accent, fontSize: '14px', fontWeight: 'bold' }}>
                💰 {isCarry ? 'Colaboración esperada:' : 'Colaboración ofrecida:'} {product.collaboration}
              </p>

              <RouteButton origin={product.origin} destination={product.destination} />

              <div style={{ display: 'flex', gap: '8px', marginTop: '10px', flexWrap: 'wrap' }}>
                {!isOwner && (
                  <button style={{
                    backgroundColor: accent, color: colors.white,
                    border: 'none', borderRadius: '10px',
                    padding: '8px 16px', fontSize: '13px',
                    cursor: 'pointer', fontWeight: 'bold',
                  }} onClick={() => onConnect(product)}>
                    {isCarry ? '📦 Enviar con él/ella' : '🚚 Me ofrezco a llevarlo'}
                  </button>
                )}
                {isOwner && (
                  <button style={{ ...styles.btnDelete, marginLeft: 'auto' }}
                    onClick={() => onDelete(product.id)}>
                    🗑️ Borrar
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}