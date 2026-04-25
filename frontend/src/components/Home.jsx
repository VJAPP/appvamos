import { useState } from 'react';
import { colors, shadows } from '../theme';

export default function Home({ user, onNavigate, onLogout }) {
  const [section, setSection] = useState('personas');

  const progress = (() => {
    let s = 0;
    if (user?.name)      s += 40;
    if (user?.photo_url) s += 40;
    if (user?.city)      s += 20;
    return s;
  })();

  return (
    <div style={{
      minHeight: '100vh', background: colors.bg,
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      padding: '16px', maxWidth: '520px', margin: '0 auto',
    }}>

      {/* Topbar */}
      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', marginBottom: '16px',
      }}>
        <div style={{ fontFamily: "'Fraunces', serif", fontSize: '20px', fontWeight: '700', color: colors.text }}>
  Vamos<span style={{ color: colors.cyan }}>.</span>
</div>
        <button onClick={() => onNavigate('profile')} style={{
          width: '38px', height: '38px', borderRadius: '50%',
          background: colors.cyanBg, border: `2px solid ${colors.cyan}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', overflow: 'hidden', flexShrink: 0,
        }}>
          {user?.photo_url
            ? <img src={user.photo_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <span style={{ fontSize: '14px', fontWeight: '700', color: colors.cyan }}>
                {user?.name?.[0]?.toUpperCase()}
              </span>
          }
        </button>
      </div>

      {/* Tarjeta de bienvenida */}
      <div style={{
        background: colors.text, borderRadius: '20px',
        padding: '20px', marginBottom: '14px',
        color: 'white', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', right: '16px', top: '50%',
          transform: 'translateY(-50%)',
          fontSize: '52px', opacity: 0.1,
        }}>
          🚗
        </div>
        <p style={{ fontSize: '13px', opacity: 0.6, margin: '0 0 4px' }}>Buen día,</p>
        <p style={{
          fontFamily: "'Fraunces', serif", fontSize: '22px',
          fontWeight: '700', margin: '0 0 16px',
        }}>
          {user?.name} 👋
        </p>
        {progress < 100 && (
          <div onClick={() => onNavigate('profile')} style={{ cursor: 'pointer' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', opacity: 0.6, marginBottom: '6px' }}>
              <span>Completá tu perfil para generar confianza</span>
              <span style={{ fontWeight: '700' }}>{progress}%</span>
            </div>
            <div style={{ height: '4px', background: 'rgba(255,255,255,0.2)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${progress}%`, height: '100%', background: colors.cyan, borderRadius: '4px' }} />
            </div>
          </div>
        )}
      </div>

      {/* Pestañas */}
      <div style={{
        display: 'flex', background: colors.bg2,
        borderRadius: '12px', padding: '4px', marginBottom: '14px',
      }}>
        {[
          { key: 'personas',  label: '🧑 Personas' },
          { key: 'productos', label: '📦 Productos' },
        ].map(({ key, label }) => (
          <button key={key} onClick={() => setSection(key)} style={{
            flex: 1, padding: '10px', border: 'none', borderRadius: '9px',
            cursor: 'pointer', fontWeight: '700', fontSize: '13px',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            backgroundColor: section === key
              ? (key === 'personas' ? colors.cyan : colors.orange)
              : 'transparent',
            color: section === key ? 'white' : colors.text3,
            transition: 'all 0.2s',
          }}>
            {label}
          </button>
        ))}
      </div>

      {/* Opciones */}
      {section === 'personas' && (
        <>
          {[
            { icon: '🚗', title: 'Ofrezco un viaje', desc: 'Soy conductor, busco pasajeros', view: 'publish_offer', color: colors.cyan, bg: colors.cyanBg },
            { icon: '🙋', title: 'Busco un viaje', desc: 'Soy pasajero, busco conductor', view: 'publish_request', color: colors.orange, bg: colors.orangeBg },
          ].map((opt) => (
            <div key={opt.view} onClick={() => onNavigate(opt.view)} style={{
              background: colors.white, border: `1.5px solid ${colors.border}`,
              borderRadius: '14px', padding: '14px 16px',
              display: 'flex', alignItems: 'center', gap: '14px',
              cursor: 'pointer', boxShadow: shadows.sm, marginBottom: '10px',
              transition: 'all 0.15s',
            }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '12px',
                background: opt.bg, display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '22px', flexShrink: 0,
              }}>
                {opt.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: '700', color: colors.text, marginBottom: '2px' }}>
                  {opt.title}
                </div>
                <div style={{ fontSize: '12px', color: colors.text3 }}>{opt.desc}</div>
              </div>
              <span style={{ color: colors.text3, fontSize: '18px' }}>›</span>
            </div>
          ))}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '4px' }}>
            {[
              { label: '🔍 Ver viajes', view: 'browse' },
              { label: '🤝 Conexiones', view: 'connections' },
              { label: '📋 Mis publicaciones', view: 'my_publications' },
              { label: '👤 Mi perfil', view: 'profile' },
            ].map((b) => (
              <button key={b.view} onClick={() => onNavigate(b.view)} style={{
                background: colors.white, border: `1.5px solid ${colors.border}`,
                borderRadius: '12px', padding: '12px', textAlign: 'center',
                fontSize: '13px', fontWeight: '600', color: colors.text2,
                cursor: 'pointer', boxShadow: shadows.sm,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}>
                {b.label}
              </button>
            ))}
          </div>
        </>
      )}

      {section === 'productos' && (
        <>
          {[
            { icon: '🚚', title: 'Puedo llevar un paquete', desc: 'Viajo y tengo espacio disponible', view: 'publish_carry', color: colors.cyan, bg: colors.cyanBg },
            { icon: '📦', title: 'Necesito enviar algo', desc: 'Busco a alguien que lo lleve', view: 'publish_send', color: colors.orange, bg: colors.orangeBg },
          ].map((opt) => (
            <div key={opt.view} onClick={() => onNavigate(opt.view)} style={{
              background: colors.white, border: `1.5px solid ${colors.border}`,
              borderRadius: '14px', padding: '14px 16px',
              display: 'flex', alignItems: 'center', gap: '14px',
              cursor: 'pointer', boxShadow: shadows.sm, marginBottom: '10px',
            }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '12px',
                background: opt.bg, display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '22px', flexShrink: 0,
              }}>
                {opt.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: '700', color: colors.text, marginBottom: '2px' }}>
                  {opt.title}
                </div>
                <div style={{ fontSize: '12px', color: colors.text3 }}>{opt.desc}</div>
              </div>
              <span style={{ color: colors.text3, fontSize: '18px' }}>›</span>
            </div>
          ))}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '4px' }}>
            {[
              { label: '🔍 Ver envíos', view: 'browse_products' },
              { label: '🤝 Mis conexiones', view: 'product_connections' },
              { label: '📋 Mis publicaciones', view: 'my_publications' },
            ].map((b) => (
              <button key={b.view} onClick={() => onNavigate(b.view)} style={{
                background: colors.white, border: `1.5px solid ${colors.border}`,
                borderRadius: '12px', padding: '12px', textAlign: 'center',
                fontSize: '13px', fontWeight: '600', color: colors.text2,
                cursor: 'pointer', boxShadow: shadows.sm,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}>
                {b.label}
              </button>
            ))}
          </div>
        </>
      )}

      {/* Banner VIP */}
      <div style={{
        background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
        borderRadius: '16px', padding: '16px', marginTop: '14px',
        display: 'flex', alignItems: 'center', gap: '14px',
        color: 'white',
      }}>
        <span style={{ fontSize: '28px' }}>⭐</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: '700', fontSize: '14px', marginBottom: '3px' }}>VAMOS VIP</div>
          <div style={{ fontSize: '12px', opacity: 0.8 }}>Destacá tus publicaciones y eliminá anuncios</div>
        </div>
        <button style={{
          padding: '8px 14px', background: 'white', border: 'none',
          borderRadius: '8px', fontSize: '12px', fontWeight: '700',
          color: '#7c3aed', cursor: 'pointer', whiteSpace: 'nowrap',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}>
          Ver planes
        </button>
      </div>

      {/* Cerrar sesión */}
      <button onClick={onLogout} style={{
        width: '100%', marginTop: '12px', padding: '11px',
        background: 'transparent', border: `1.5px solid ${colors.border}`,
        borderRadius: '10px', fontSize: '13px', fontWeight: '500',
        color: colors.error, cursor: 'pointer',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}>
        Cerrar sesión
      </button>

    </div>
  );
}

function cardOption(borderColor, bgColor) {
  return {
    backgroundColor: bgColor, borderRadius: '14px',
    padding: '14px 16px', marginBottom: '10px',
    cursor: 'pointer', border: `1.5px solid ${borderColor}`,
    display: 'flex', alignItems: 'center', gap: '14px', textAlign: 'left',
  };
}