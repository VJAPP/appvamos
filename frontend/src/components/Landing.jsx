import { colors, shadows } from '../theme';
export default function Landing({ onNavigate }) {
  return (
    <div style={{
      minHeight:   '100vh',
      background:  colors.white,
      fontFamily:  "'Plus Jakarta Sans', sans-serif",
      overflow:    'hidden',
      position:    'relative',
    }}>

      {/* Círculos decorativos de fondo */}
      <div style={{
        position: 'absolute', top: '-200px', right: '-200px',
        width: '500px', height: '500px', borderRadius: '50%',
        background: 'radial-gradient(circle, #e0f2fe 0%, transparent 70%)',
        zIndex: 0,
      }} />
      <div style={{
        position: 'absolute', bottom: '-150px', left: '-100px',
        width: '400px', height: '400px', borderRadius: '50%',
        background: 'radial-gradient(circle, #fff7ed 0%, transparent 70%)',
        zIndex: 0,
      }} />

      {/* Nav */}
      <nav style={{
        position:       'relative', zIndex: 1,
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'space-between',
        padding:        '20px 32px',
        borderBottom:   `1px solid ${colors.border}`,
      }}>
     <div style={{ fontFamily: "'Fraunces', serif", fontSize: '24px', fontWeight: '700', color: colors.text }}>
  Vamos<span style={{ color: colors.cyan }}>.</span>
</div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button onClick={() => onNavigate('login')} style={{
            padding: '8px 18px', border: `1.5px solid ${colors.border}`,
            borderRadius: '8px', background: 'transparent',
            color: colors.text, fontSize: '13px', fontWeight: '500',
            cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}>
            Ingresar
          </button>
          <button onClick={() => onNavigate('register')} style={{
            padding: '8px 18px', border: 'none',
            borderRadius: '8px', background: colors.text,
            color: 'white', fontSize: '13px', fontWeight: '600',
            cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}>
            Registrarse
          </button>
        </div>
      </nav>

      {/* Cuerpo */}
      <div style={{
        position: 'relative', zIndex: 1,
        display:  'grid',
        gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)',
        gap:      '40px',
        padding:  '60px 40px',
        maxWidth: '1100px',
        margin:   '0 auto',
        alignItems: 'center',
      }}>

        {/* Columna izquierda */}
        <div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '6px 12px', background: colors.cyanBg,
            borderRadius: '20px', fontSize: '12px', fontWeight: '600',
            color: colors.cyan, marginBottom: '20px',
          }}>
            🚗 Red colaborativa de viajes
          </div>

          <h1 style={{
            fontFamily:  "'Fraunces', serif",
            fontSize:    'clamp(32px, 5vw, 56px)',
            fontWeight:  '700',
            lineHeight:  '1.05',
            letterSpacing: '-2px',
            color:       colors.text,
            marginBottom:'20px',
          }}>
            Compartí el<br />
            camino,{' '}
            <em style={{ color: colors.cyan, fontStyle: 'italic' }}>
              no el costo.
            </em>
          </h1>

          <p style={{
            fontSize: '16px', color: colors.text2,
            lineHeight: '1.7', marginBottom: '32px',
            maxWidth: '400px',
          }}>
            Conectamos conductores y pasajeros para viajar juntos. Dividís los gastos, hacés nuevos contactos y llegás a destino.
          </p>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '32px' }}>
            <button onClick={() => onNavigate('register')} style={{
              padding: '14px 28px', background: colors.cyan,
              color: 'white', border: 'none', borderRadius: '10px',
              fontSize: '15px', fontWeight: '700', cursor: 'pointer',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}>
              Empezar gratis →
            </button>
            <button onClick={() => onNavigate('browse')} style={{
              padding: '14px 28px', background: colors.bg2,
              color: colors.text, border: 'none', borderRadius: '10px',
              fontSize: '15px', fontWeight: '500', cursor: 'pointer',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}>
              Ver viajes
            </button>
          </div>

          {/* Login social */}
          <div>
            <p style={{ fontSize: '12px', color: colors.text3, marginBottom: '10px' }}>
              O ingresá con
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              {[
                { label: 'Google', color: '#EA4335', letter: 'G', href: 'http://localhost:3000/api/auth/google' },
                { label: 'Facebook', color: '#1877F2', letter: 'f', href: 'http://localhost:3000/api/auth/facebook' },
              ].map((s) => (
                <a key={s.label} href={s.href} style={{
                  padding: '8px 16px', border: `1.5px solid ${colors.border}`,
                  borderRadius: '8px', background: 'white',
                  fontSize: '13px', fontWeight: '600', color: colors.text2,
                  cursor: 'pointer', display: 'flex', alignItems: 'center',
                  gap: '8px', textDecoration: 'none',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}>
                  <span style={{
                    width: '16px', height: '16px', borderRadius: '50%',
                    background: s.color, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', color: 'white',
                    fontSize: '9px', fontWeight: '900', flexShrink: 0,
                  }}>
                    {s.letter}
                  </span>
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Columna derecha — preview de tarjetas */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

          {/* Stats */}
          <div style={{ display: 'flex', gap: '12px' }}>
            {[
              { num: '2.4k', label: 'Viajes' },
              { num: '890',  label: 'Usuarios' },
              { num: '4.8★', label: 'Promedio' },
            ].map((s) => (
              <div key={s.label} style={{
                flex: 1, background: colors.white,
                border: `1.5px solid ${colors.border}`,
                borderRadius: '12px', padding: '12px',
                textAlign: 'center', boxShadow: shadows.sm,
              }}>
                <div style={{
                  fontFamily: "'Fraunces', serif",
                  fontSize: '22px', fontWeight: '700', color: colors.cyan,
                }}>
                  {s.num}
                </div>
                <div style={{ fontSize: '11px', color: colors.text3, marginTop: '2px' }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* Tarjetas preview */}
          {[
            { badge: '🚗 Conductor ofrece', badgeColor: colors.cyan, badgeBg: colors.cyanBg,
              route: 'Buenos Aires → Mar del Plata', info: '📅 Sáb 20/4 · ★★★★★ 4.9',
              price: '$4.500', priceColor: colors.cyan },
            { badge: '🙋 Pasajero busca', badgeColor: colors.orange, badgeBg: colors.orangeBg,
              route: 'Rosario → Córdoba', info: '📅 Dom 21/4 · ★★★★ 4.2',
              price: '$2.800', priceColor: colors.orange },
          ].map((c, i) => (
            <div key={i} style={{
              background: colors.white, border: `1.5px solid ${colors.border}`,
              borderRadius: '16px', padding: '16px', boxShadow: shadows.sm,
              borderTop: `3px solid ${c.badgeColor}`,
            }}>
              <span style={{
                fontSize: '11px', fontWeight: '700', padding: '3px 10px',
                borderRadius: '20px', display: 'inline-block', marginBottom: '10px',
                background: c.badgeBg, color: c.badgeColor,
              }}>
                {c.badge}
              </span>
              <div style={{
                fontFamily: "'Fraunces', serif", fontSize: '16px',
                fontWeight: '700', color: colors.text, marginBottom: '8px',
              }}>
                {c.route}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '12px', color: colors.text3 }}>{c.info}</span>
                <span style={{ fontSize: '14px', fontWeight: '700', color: c.priceColor }}>
                  {c.price}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}