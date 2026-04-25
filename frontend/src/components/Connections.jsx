// ============================================================
// CONNECTIONS.JSX — Con botón de calificación
// ============================================================

import { useState, useEffect } from 'react';
import { styles, colors }      from '../theme';
import RouteButton             from './RouteButton';
import StarRating              from './StarRating';
import { createRating, getMyRatings } from '../services/api';

export default function Connections({ connections, currentEmail, onDelete, onBack }) {

  const [tab, setTab]                 = useState('recibidas');
  // IDs de conexiones que ya califiqué
  const [ratedIds, setRatedIds]       = useState([]);
  // Qué conexión está siendo calificada ahora (null = modal cerrado)
  const [ratingConn, setRatingConn]   = useState(null);
  const [ratingMsg, setRatingMsg]     = useState('');

  // Al cargar, traemos qué conexiones ya calificamos
  useEffect(() => {
    if (currentEmail) loadMyRatings();
  }, [currentEmail]);

  const loadMyRatings = async () => {
    const rated = await getMyRatings(currentEmail);
    setRatedIds(rated);
  };

  const recibidas = connections.filter(c => c.owner_email     === currentEmail);
  const enviadas  = connections.filter(c => c.requester_email === currentEmail);
  const lista     = tab === 'recibidas' ? recibidas : enviadas;

  const handleContact = (method, info) => {
    if (!info) return alert('Esta persona no dejó datos de contacto.');
    if (method === 'whatsapp')       window.open(`https://wa.me/${info.replace(/\D/g,'')}`, '_blank');
    else if (method === 'telegram')  window.open(`https://t.me/${info}`, '_blank');
    else if (method === 'messenger') window.open(`https://m.me/${info}`, '_blank');
    else if (method === 'line')      window.open(`https://line.me/ti/p/~${info}`, '_blank');
    else if (method === 'email')     window.open(`mailto:${info}`, '_blank');
  };

  const contactLabel = (method) => ({
    whatsapp: 'WhatsApp', telegram: 'Telegram',
    messenger: 'Messenger', line: 'LINE', email: 'Email',
  }[method] || 'Contactar');

  // Cuando el usuario envía la calificación desde el modal
  const handleRatingSubmit = async (score, comment) => {
    const conn = ratingConn;

    // A quién calificamos:
    // En "Recibidas" → calificamos al que se unió (requester)
    // En "Enviadas"  → calificamos al dueño del viaje (owner)
    const toEmail = tab === 'recibidas'
      ? conn.requester_email
      : conn.owner_email;

    const { ok, data } = await createRating({
      from_email:    currentEmail,
      to_email:      toEmail,
      connection_id: conn.id,
      score,
      comment,
    });

    if (ok) {
      // Agregamos este ID a la lista de ya calificados
      setRatedIds([...ratedIds, conn.id]);
      setRatingConn(null);
      setRatingMsg('✅ ¡Calificación enviada!');
      setTimeout(() => setRatingMsg(''), 3000);
    } else {
      alert(data.error || 'Error al enviar calificación');
    }
  };

  return (
    <div style={styles.page}>
      <div style={{ width: '100%', maxWidth: '480px' }}>

        <button style={styles.btnGray} onClick={onBack}>← Volver</button>
        <h2 style={{ color: colors.gray800 }}>🤝 Mis conexiones</h2>

        {/* Mensaje de éxito flotante */}
        {ratingMsg && (
          <div style={styles.msgSuccess}>{ratingMsg}</div>
        )}

        {/* Pestañas */}
        <div style={{
          display: 'flex', backgroundColor: colors.gray100,
          borderRadius: '12px', padding: '4px', marginBottom: '20px',
        }}>
          {['recibidas', 'enviadas'].map((t) => (
            <button key={t} onClick={() => setTab(t)} style={{
              flex: 1, padding: '10px', border: 'none', borderRadius: '10px',
              cursor: 'pointer', fontWeight: 'bold', fontSize: '14px',
              backgroundColor: tab === t ? colors.cyan : 'transparent',
              color: tab === t ? colors.white : colors.gray500,
              transition: 'all 0.2s',
            }}>
              {t === 'recibidas' ? '📥 Recibidas' : '📤 Enviadas'}
              {(t === 'recibidas' ? recibidas : enviadas).length > 0 && (
                <span style={{
                  marginLeft: '6px',
                  backgroundColor: tab === t ? 'rgba(255,255,255,0.3)' : colors.gray300,
                  borderRadius: '20px', padding: '1px 7px', fontSize: '12px',
                }}>
                  {(t === 'recibidas' ? recibidas : enviadas).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Lista vacía */}
        {lista.length === 0 && (
          <div style={styles.card}>
            <p style={{ textAlign: 'center', color: colors.gray500, lineHeight: '1.6' }}>
              {tab === 'recibidas'
                ? 'Nadie se conectó a tus publicaciones todavía.'
                : 'Todavía no te uniste a ningún viaje.'}
            </p>
          </div>
        )}

        {/* Tarjetas */}
        {lista.map((conn) => {
          const contactName  = tab === 'recibidas' ? conn.requester_name : conn.owner_name;
          const yaCalifique  = ratedIds.includes(conn.id);

          return (
            <div key={conn.id} style={{
              ...styles.card,
              borderLeft: `4px solid ${tab === 'recibidas' ? colors.orange : colors.cyan}`,
            }}>

              <span style={{
                backgroundColor: tab === 'recibidas' ? colors.orangeLight : colors.cyanLight,
                color: tab === 'recibidas' ? colors.orange : colors.cyan,
                borderRadius: '20px', padding: '2px 10px',
                fontSize: '11px', fontWeight: 'bold',
              }}>
                {tab === 'recibidas' ? '📥 Se unió a tu viaje' : '📤 Te uniste a su viaje'}
              </span>

              <h3 style={{ margin: '10px 0 10px', color: colors.gray800 }}>
                👤 {contactName}
              </h3>

              <div style={{
                backgroundColor: colors.gray100, borderRadius: '8px',
                padding: '10px 14px', marginBottom: '4px',
              }}>
                <p style={{ margin: '3px 0', color: colors.gray500, fontSize: '14px' }}>
                  📍 <strong>Recorrido:</strong> {conn.origin} → {conn.destination}
                </p>
                <p style={{ margin: '3px 0', color: colors.gray500, fontSize: '14px' }}>
                  📅 <strong>Fecha:</strong> {conn.date}
                </p>
                <p style={{ margin: '3px 0', color: colors.cyan, fontSize: '14px', fontWeight: 'bold' }}>
                  💰 <strong>Colaboración:</strong> {conn.collaboration}
                </p>
              </div>

              <RouteButton origin={conn.origin} destination={conn.destination} />

              <div style={{ display: 'flex', gap: '8px', marginTop: '10px', flexWrap: 'wrap' }}>

                {/* Contacto */}
                <button
                  style={{
                    backgroundColor: colors.successBg, color: colors.success,
                    border: 'none', borderRadius: '10px',
                    padding: '8px 14px', fontSize: '13px',
                    cursor: 'pointer', fontWeight: 'bold',
                  }}
                  onClick={() => handleContact(conn.contact_method, conn.contact_info)}
                >
                  💬 {contactLabel(conn.contact_method)}
                </button>

                {/* Calificar — solo si no califiqué todavía */}
                {yaCalifique ? (
                  <span style={{
                    padding: '8px 14px', fontSize: '13px',
                    color: '#f59e0b', fontWeight: 'bold',
                  }}>
                    ⭐ Calificado
                  </span>
                ) : (
                  <button
                    style={{
                      backgroundColor: '#fef3c7', color: '#92400e',
                      border: 'none', borderRadius: '10px',
                      padding: '8px 14px', fontSize: '13px',
                      cursor: 'pointer', fontWeight: 'bold',
                    }}
                    onClick={() => setRatingConn(conn)}
                  >
                    ⭐ Calificar
                  </button>
                )}

                {/* Borrar */}
                <button
                  style={{ ...styles.btnDelete, marginLeft: 'auto' }}
                  onClick={() => onDelete(conn.id)}
                >
                  🗑️ Borrar
                </button>
              </div>

            </div>
          );
        })}

      </div>

      {/* Modal de calificación — aparece encima de todo cuando ratingConn no es null */}
      {ratingConn && (
        <StarRating
          targetName={tab === 'recibidas' ? ratingConn.requester_name : ratingConn.owner_name}
          onSubmit={handleRatingSubmit}
          onClose={() => setRatingConn(null)}
        />
      )}

    </div>
  );
}