import { useState, useEffect } from 'react';
import { colors, shadows }     from '../theme';
import RouteButton             from './RouteButton';
import SearchBar               from './SearchBar';
import { getUserRating }       from '../services/api';

function Stars({ average, count }) {
  if (!average) return (
    <span style={{ fontSize: '11px', color: colors.text3 }}>Sin calificaciones</span>
  );
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
      {[1,2,3,4,5].map((s) => (
        <span key={s} style={{ color: s <= Math.round(average) ? '#f59e0b' : colors.border, fontSize: '12px' }}>★</span>
      ))}
      <span style={{ fontSize: '11px', color: colors.text3, marginLeft: '4px' }}>
        {average} · {count} {count === 1 ? 'viaje' : 'viajes'}
      </span>
    </span>
  );
}

const extractNumber = (str) => {
  if (!str) return 0;
  const num = str.replace(/[^0-9]/g, '');
  return num ? parseInt(num) : 0;
};

export default function TripList({ trips, currentEmail, onConnect, onDelete, onBack }) {
  const [ratings,       setRatings]       = useState({});
  const [activeFilters, setActiveFilters] = useState(null);

  useEffect(() => {
    const loadRatings = async () => {
      const emails  = [...new Set(trips.map(t => t.creator_email).filter(Boolean))];
      const results = {};
      await Promise.all(emails.map(async (email) => {
        results[email] = await getUserRating(email);
      }));
      setRatings(results);
    };
    if (trips.length > 0) loadRatings();
  }, [trips]);

  const filteredTrips = trips.filter((trip) => {
    if (!activeFilters) return true;
    const { text, type, minCollab, maxCollab, date } = activeFilters;
    if (text) {
      const q = text.toLowerCase();
      if (!trip.origin?.toLowerCase().includes(q) &&
          !trip.destination?.toLowerCase().includes(q) &&
          !trip.creator_name?.toLowerCase().includes(q)) return false;
    }
    if (type && type !== 'all' && trip.type !== type) return false;
    if (minCollab && extractNumber(trip.collaboration) < parseInt(minCollab)) return false;
    if (maxCollab && extractNumber(trip.collaboration) > parseInt(maxCollab)) return false;
    if (date && !trip.date?.toLowerCase().includes(date.toLowerCase())) return false;
    return true;
  });

  return (
    <div style={{
      minHeight: '100vh', background: colors.bg,
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      padding: '16px', maxWidth: '520px', margin: '0 auto',
    }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
        <button onClick={onBack} style={{
          width: '36px', height: '36px', borderRadius: '10px',
          border: `1.5px solid ${colors.border}`, background: colors.white,
          color: colors.text2, fontSize: '16px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: shadows.sm, flexShrink: 0,
        }}>←</button>
        <div style={{
          fontFamily: "'Fraunces', serif", fontSize: '20px',
          fontWeight: '700', color: colors.text, flex: 1,
        }}>
          Viajes disponibles
        </div>
        <div style={{
          fontSize: '12px', color: colors.text3,
          background: colors.bg2, padding: '4px 10px', borderRadius: '20px',
        }}>
          {filteredTrips.length} resultados
        </div>
      </div>

      <SearchBar type="trips" onFilter={setActiveFilters} />

      {trips.length === 0 && (
        <div style={{
          background: colors.white, borderRadius: '16px', padding: '32px',
          textAlign: 'center', border: `1.5px solid ${colors.border}`,
          boxShadow: shadows.sm,
        }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>🚗</div>
          <p style={{ color: colors.text2, fontWeight: '600' }}>No hay viajes publicados todavía.</p>
          <p style={{ color: colors.text3, fontSize: '13px', marginTop: '4px' }}>Sé el primero en publicar uno.</p>
        </div>
      )}

      {filteredTrips.map((trip) => {
        const isOffer     = trip.type === 'offer';
        const isOwner     = trip.creator_email === currentEmail;
        const accent      = isOffer ? colors.cyan : colors.orange;
        const accentBg    = isOffer ? colors.cyanBg : colors.orangeBg;
        const tripRating  = ratings[trip.creator_email];

        return (
          <div key={trip.id} style={{
            background: colors.white, border: `1.5px solid ${colors.border}`,
            borderRadius: '16px', padding: '16px', marginBottom: '10px',
            boxShadow: shadows.sm, position: 'relative', overflow: 'hidden',
            borderTop: `3px solid ${accent}`,
          }}>

            {/* Badge */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{
                fontSize: '11px', fontWeight: '700', padding: '3px 10px',
                borderRadius: '20px', background: accentBg, color: accent,
              }}>
                {isOffer ? '🚗 Conductor ofrece' : '🙋 Pasajero busca'}
              </span>
            </div>

            {/* Usuario */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%',
                background: colors.bg2, border: `2px solid ${colors.border}`,
                overflow: 'hidden', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '14px', fontWeight: '700', color: colors.text2,
              }}>
                {trip.creator_photo
                  ? <img src={trip.creator_photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : trip.creator_name?.[0]?.toUpperCase()
                }
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: colors.text }}>
                  {trip.creator_name}
                </div>
                <Stars average={tripRating?.average} count={tripRating?.count} />
              </div>
            </div>

            {/* Ruta */}
            <div style={{
              fontFamily: "'Fraunces', serif", fontSize: '17px',
              fontWeight: '700', color: colors.text, marginBottom: '8px',
            }}>
              {trip.origin} <span style={{ color: colors.text3, fontFamily: 'sans-serif', fontWeight: 400 }}>→</span> {trip.destination}
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', color: colors.text3 }}>📅 <strong style={{ color: colors.text2 }}>{trip.date}</strong></span>
            </div>

            <div style={{ fontSize: '15px', fontWeight: '700', color: accent, marginBottom: '12px' }}>
              💰 {isOffer ? 'Colaboración esperada:' : 'Colaboración ofrecida:'} {trip.collaboration}
            </div>

            {trip.description && (
              <p style={{ fontSize: '13px', color: colors.text3, marginBottom: '12px', lineHeight: '1.5' }}>
                {trip.description}
              </p>
            )}

            <RouteButton origin={trip.origin} destination={trip.destination} />

            <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
              {!isOwner && (
                <button style={{
                  flex: 1, padding: '10px', border: 'none', borderRadius: '10px',
                  background: accent, color: 'white', fontSize: '13px',
                  fontWeight: '700', cursor: 'pointer',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }} onClick={() => onConnect(trip)}>
                  {isOffer ? '✋ Unirme' : '🚗 Ofrecerme'}
                </button>
              )}
              {isOwner && (
                <button style={{
                  marginLeft: 'auto', padding: '8px 14px',
                  background: 'transparent', border: `1.5px solid ${colors.error}`,
                  borderRadius: '8px', color: colors.error,
                  fontSize: '12px', fontWeight: '600', cursor: 'pointer',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }} onClick={() => onDelete(trip.id)}>
                  🗑️ Borrar
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}