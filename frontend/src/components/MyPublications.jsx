// ============================================================
// MYPUBLICATIONS.JSX — Mis publicaciones propias
// ============================================================
// Muestra los viajes y productos que publicó el usuario.
// Desde acá puede borrarlos y ver quién se conectó a cada uno.
// ============================================================

import { useState, useEffect } from 'react';
import { styles, colors }      from '../theme';
import RouteButton             from './RouteButton';
import {
  getMyTrips, getMyProducts,
  deleteTrip, deleteProduct,
  getTripConnections, getProductConnections2,
} from '../services/api';

const SIZE_LABELS = {
  'pequeño': '🟢 Pequeño',
  'mediano': '🟡 Mediano',
  'grande':  '🔴 Grande',
};

export default function MyPublications({ user, onBack }) {

  // Pestaña activa: 'personas' o 'productos'
  const [tab,      setTab]      = useState('personas');
  const [trips,    setTrips]    = useState([]);
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [message,  setMessage]  = useState('');

  // ID de la publicación cuyas conexiones estamos viendo (null = ninguna)
  const [expandedId, setExpandedId] = useState(null);
  // Conexiones de la publicación expandida
  const [expandedConnections, setExpandedConnections] = useState([]);
  const [loadingConns, setLoadingConns] = useState(false);

  // Cargamos los datos al montar el componente
  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    setLoading(true);
    const [myTrips, myProducts] = await Promise.all([
      getMyTrips(user.email),
      getMyProducts(user.email),
    ]);
    setTrips(myTrips);
    setProducts(myProducts);
    setLoading(false);
  };

  // ── Borrar viaje ──
  const handleDeleteTrip = async (tripId) => {
    if (!window.confirm('¿Eliminar este viaje?')) return;
    const { ok } = await deleteTrip(tripId, user.email);
    if (ok) {
      setTrips(trips.filter(t => t.id !== tripId));
      if (expandedId === tripId) setExpandedId(null);
      setMessage('🗑️ Viaje eliminado');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  // ── Borrar producto ──
  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('¿Eliminar esta publicación?')) return;
    const { ok } = await deleteProduct(productId, user.email);
    if (ok) {
      setProducts(products.filter(p => p.id !== productId));
      if (expandedId === productId) setExpandedId(null);
      setMessage('🗑️ Publicación eliminada');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  // ── Ver / ocultar conexiones de una publicación ──
  const handleToggleConnections = async (id, type) => {
    // Si ya estaba expandido, lo cerramos
    if (expandedId === id) {
      setExpandedId(null);
      setExpandedConnections([]);
      return;
    }

    setExpandedId(id);
    setLoadingConns(true);

    const conns = type === 'trip'
      ? await getTripConnections(id)
      : await getProductConnections2(id);

    setExpandedConnections(conns);
    setLoadingConns(false);
  };

  // ── Tarjeta de conexión (mini) ──
  const ConnectionMini = ({ conn }) => (
    <div style={{
      backgroundColor: colors.gray100,
      borderRadius: '8px',
      padding: '10px 14px',
      marginTop: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '8px',
    }}>
      <div>
        <p style={{ margin: 0, fontWeight: '600', fontSize: '14px', color: colors.gray800 }}>
          👤 {conn.requester_name}
        </p>
        <p style={{ margin: '2px 0 0', fontSize: '12px', color: colors.gray500 }}>
          📅 Se conectó el {conn.created_at?.slice(0, 10)}
        </p>
      </div>
      {/* Botón de contacto rápido */}
      {conn.contact_info && (
        <button
          onClick={() => {
            const m = conn.contact_method;
            const i = conn.contact_info;
            if (m === 'whatsapp')       window.open(`https://wa.me/${i.replace(/\D/g,'')}`, '_blank');
            else if (m === 'telegram')  window.open(`https://t.me/${i}`, '_blank');
            else if (m === 'messenger') window.open(`https://m.me/${i}`, '_blank');
            else if (m === 'line')      window.open(`https://line.me/ti/p/~${i}`, '_blank');
            else if (m === 'email')     window.open(`mailto:${i}`, '_blank');
          }}
          style={{
            backgroundColor: colors.successBg,
            color: colors.success,
            border: 'none', borderRadius: '8px',
            padding: '6px 12px', fontSize: '12px',
            cursor: 'pointer', fontWeight: 'bold',
            whiteSpace: 'nowrap',
          }}
        >
          💬 Contactar
        </button>
      )}
    </div>
  );

  // ── Tarjeta de viaje propio ──
  const TripCard = ({ trip }) => {
    const isOffer      = trip.type === 'offer';
    const accentColor  = isOffer ? colors.cyan   : colors.orange;
    const accentLight  = isOffer ? colors.cyanLight : colors.orangeLight;
    const isExpanded   = expandedId === trip.id;

    return (
      <div style={{ ...styles.card, borderLeft: `4px solid ${accentColor}` }}>

        <span style={{
          backgroundColor: accentLight, color: accentColor,
          borderRadius: '20px', padding: '2px 12px',
          fontSize: '12px', fontWeight: 'bold',
        }}>
          {isOffer ? '🚗 Conductor' : '🙋 Pasajero'}
        </span>

        <h3 style={{ margin: '10px 0 4px', color: colors.gray800 }}>
          {trip.origin} → {trip.destination}
        </h3>
        <p style={{ margin: '2px 0', color: colors.gray500, fontSize: '14px' }}>📅 {trip.date}</p>
        <p style={{ margin: '2px 0', color: accentColor, fontSize: '14px', fontWeight: 'bold' }}>
          💰 {isOffer ? 'Colaboración esperada:' : 'Colaboración ofrecida:'} {trip.collaboration}
        </p>
        {trip.description && (
          <p style={{ margin: '4px 0 0', color: colors.gray500, fontSize: '14px' }}>{trip.description}</p>
        )}

        <RouteButton origin={trip.origin} destination={trip.destination} />

        {/* Botones de gestión */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>

          {/* Ver quién se conectó */}
          <button
            onClick={() => handleToggleConnections(trip.id, 'trip')}
            style={{
              backgroundColor: isExpanded ? colors.cyanLight : colors.gray100,
              color:           isExpanded ? colors.cyanDark  : colors.gray500,
              border: 'none', borderRadius: '10px',
              padding: '8px 14px', fontSize: '13px',
              cursor: 'pointer', fontWeight: 'bold',
            }}
          >
            {isExpanded ? '▲ Ocultar' : '👥 Ver conexiones'}
          </button>

          {/* Borrar */}
          <button
            style={{ ...styles.btnDelete, marginLeft: 'auto' }}
            onClick={() => handleDeleteTrip(trip.id)}
          >
            🗑️ Borrar
          </button>
        </div>

        {/* Panel de conexiones expandido */}
        {isExpanded && (
          <div style={{ marginTop: '8px' }}>
            {loadingConns ? (
              <p style={{ fontSize: '13px', color: colors.gray500, textAlign: 'center', padding: '8px' }}>
                Cargando...
              </p>
            ) : expandedConnections.length === 0 ? (
              <p style={{
                fontSize: '13px', color: colors.gray500,
                textAlign: 'center', padding: '12px',
                backgroundColor: colors.gray100,
                borderRadius: '8px', marginTop: '8px',
              }}>
                Nadie se conectó todavía a este viaje.
              </p>
            ) : (
              <>
                <p style={{ fontSize: '12px', color: colors.gray500, fontWeight: '600', margin: '4px 0' }}>
                  {expandedConnections.length} {expandedConnections.length === 1 ? 'persona conectada' : 'personas conectadas'}
                </p>
                {expandedConnections.map(conn => (
                  <ConnectionMini key={conn.id} conn={conn} />
                ))}
              </>
            )}
          </div>
        )}

      </div>
    );
  };

  // ── Tarjeta de producto propio ──
  const ProductCard = ({ product }) => {
    const isCarry    = product.type === 'carry';
    const accent     = isCarry ? colors.cyan : colors.orange;
    const accentBg   = isCarry ? colors.cyanLight : colors.orangeLight;
    const isExpanded = expandedId === product.id;

    return (
      <div style={{ ...styles.card, borderLeft: `4px solid ${accent}` }}>

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
        <p style={{ margin: '2px 0', color: colors.gray500, fontSize: '14px' }}>
          📐 {SIZE_LABELS[product.package_size] || product.package_size}
        </p>
        {product.description && (
          <p style={{ margin: '4px 0', color: colors.gray500, fontSize: '14px' }}>📝 {product.description}</p>
        )}
        <p style={{ margin: '4px 0', color: accent, fontSize: '14px', fontWeight: 'bold' }}>
          💰 {isCarry ? 'Colaboración esperada:' : 'Colaboración ofrecida:'} {product.collaboration}
        </p>

        <RouteButton origin={product.origin} destination={product.destination} />

        <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
          <button
            onClick={() => handleToggleConnections(product.id, 'product')}
            style={{
              backgroundColor: isExpanded ? colors.cyanLight : colors.gray100,
              color:           isExpanded ? colors.cyanDark  : colors.gray500,
              border: 'none', borderRadius: '10px',
              padding: '8px 14px', fontSize: '13px',
              cursor: 'pointer', fontWeight: 'bold',
            }}
          >
            {isExpanded ? '▲ Ocultar' : '👥 Ver conexiones'}
          </button>

          <button
            style={{ ...styles.btnDelete, marginLeft: 'auto' }}
            onClick={() => handleDeleteProduct(product.id)}
          >
            🗑️ Borrar
          </button>
        </div>

        {isExpanded && (
          <div style={{ marginTop: '8px' }}>
            {loadingConns ? (
              <p style={{ fontSize: '13px', color: colors.gray500, textAlign: 'center', padding: '8px' }}>
                Cargando...
              </p>
            ) : expandedConnections.length === 0 ? (
              <p style={{
                fontSize: '13px', color: colors.gray500,
                textAlign: 'center', padding: '12px',
                backgroundColor: colors.gray100,
                borderRadius: '8px', marginTop: '8px',
              }}>
                Nadie se conectó todavía a esta publicación.
              </p>
            ) : (
              <>
                <p style={{ fontSize: '12px', color: colors.gray500, fontWeight: '600', margin: '4px 0' }}>
                  {expandedConnections.length} {expandedConnections.length === 1 ? 'persona conectada' : 'personas conectadas'}
                </p>
                {expandedConnections.map(conn => (
                  <ConnectionMini key={conn.id} conn={conn} />
                ))}
              </>
            )}
          </div>
        )}

      </div>
    );
  };

  return (
    <div style={styles.page}>
      <div style={{ width: '100%', maxWidth: '480px' }}>

        <button style={styles.btnGray} onClick={onBack}>← Volver</button>
        <h2 style={{ color: colors.gray800 }}>📋 Mis publicaciones</h2>

        {/* Mensaje de estado */}
        {message && <div style={styles.msgSuccess}>{message}</div>}

        {/* Pestañas Personas / Productos */}
        <div style={{
          display: 'flex', backgroundColor: colors.gray100,
          borderRadius: '12px', padding: '4px', marginBottom: '20px',
        }}>
          {[
            { key: 'personas',  label: '🧑 Personas',  count: trips.length },
            { key: 'productos', label: '📦 Productos', count: products.length },
          ].map(({ key, label, count }) => (
            <button key={key} onClick={() => { setTab(key); setExpandedId(null); }} style={{
              flex: 1, padding: '10px', border: 'none', borderRadius: '10px',
              cursor: 'pointer', fontWeight: 'bold', fontSize: '14px',
              backgroundColor: tab === key
                ? (key === 'personas' ? colors.cyan : colors.orange)
                : 'transparent',
              color: tab === key ? colors.white : colors.gray500,
              transition: 'all 0.2s',
            }}>
              {label}
              {count > 0 && (
                <span style={{
                  marginLeft: '6px',
                  backgroundColor: tab === key ? 'rgba(255,255,255,0.3)' : colors.gray300,
                  borderRadius: '20px', padding: '1px 7px', fontSize: '12px',
                }}>
                  {count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Estado de carga */}
        {loading && (
          <div style={styles.card}>
            <p style={{ textAlign: 'center', color: colors.gray500 }}>Cargando...</p>
          </div>
        )}

        {/* Lista de viajes propios */}
        {!loading && tab === 'personas' && (
          trips.length === 0
            ? <div style={styles.card}>
                <p style={{ textAlign: 'center', color: colors.gray500 }}>
                  No publicaste ningún viaje todavía.
                </p>
              </div>
            : trips.map(trip => <TripCard key={trip.id} trip={trip} />)
        )}

        {/* Lista de productos propios */}
        {!loading && tab === 'productos' && (
          products.length === 0
            ? <div style={styles.card}>
                <p style={{ textAlign: 'center', color: colors.gray500 }}>
                  No publicaste ningún envío todavía.
                </p>
              </div>
            : products.map(product => <ProductCard key={product.id} product={product} />)
        )}

      </div>
    </div>
  );
}