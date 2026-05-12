import { colors, shadows } from '../theme';
const LOGO = 'https://res.cloudinary.com/dl5og2uxd/image/upload/v1778507470/logo.png_foiemx.jpg';

export default function Landing({ onNavigate }) {
  return (
    <div style={{
      minHeight: '100vh', background: colors.white,
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      overflow: 'hidden', position: 'relative',
    }}>

      {/* Círculos decorativos */}
      <div style={{
        position: 'absolute', top: '-200px', right: '-200px',
        width: '500px', height: '500px', borderRadius: '50%',
        background: 'radial-gradient(circle, #e0f2fe 0%, transparent 70%)', zIndex: 0,
      }} />
      <div style={{
        position: 'absolute', bottom: '-150px', left: '-100px',
        width: '400px', height: '400px', borderRadius: '50%',
        background: 'radial-gradient(circle, #fff7ed 0%, transparent 70%)', zIndex: 0,
      }} />

      {/* Nav */}
      <nav style={{
        position: 'relative', zIndex: 1,
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 32px',
        borderBottom: `1px solid ${colors.border}`,
      }}>
        <img src={LOGO} alt="VAMOS" style={{ height: '38px', width: 'auto', borderRadius: '8px' }} />
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
  <button
    onClick={() => document.getElementById('como-funciona').scrollIntoView({ behavior: 'smooth' })}
    style={{
      padding: '8px 18px', border: 'none',
      background: 'transparent', color: colors.text2,
      fontSize: '13px', fontWeight: '500', cursor: 'pointer',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
    }}
  >
    ¿Cómo funciona?
  </button>
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

      {/* ── HERO ── */}
      <div style={{
        position: 'relative', zIndex: 1,
        display: 'grid',
        gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)',
        gap: '40px', padding: '60px 40px',
        maxWidth: '1100px', margin: '0 auto', alignItems: 'center',
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
            fontFamily: "'Fraunces', serif",
            fontSize: 'clamp(32px, 5vw, 56px)',
            fontWeight: '700', lineHeight: '1.05',
            letterSpacing: '-2px', color: colors.text, marginBottom: '20px',
          }}>
            Compartí el<br />
            camino,{' '}
            <em style={{ color: colors.cyan, fontStyle: 'italic' }}>
              no el costo.
            </em>
          </h1>

          <p style={{
            fontSize: '16px', color: colors.text2,
            lineHeight: '1.7', marginBottom: '32px', maxWidth: '400px',
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
                { label: 'Google',   color: '#EA4335', letter: 'G', href: 'https://vamos-backend-ggqq.onrender.com/api/auth/google' },
                { label: 'Facebook', color: '#1877F2', letter: 'f', href: 'https://vamos-backend-ggqq.onrender.com/api/auth/facebook' },
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

        {/* Columna derecha — preview */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
                <div style={{ fontFamily: "'Fraunces', serif", fontSize: '22px', fontWeight: '700', color: colors.cyan }}>
                  {s.num}
                </div>
                <div style={{ fontSize: '11px', color: colors.text3, marginTop: '2px' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {[
            { badge: '🚗 Conductor ofrece', badgeColor: colors.cyan,   badgeBg: colors.cyanBg,
              route: 'Buenos Aires → Mar del Plata', info: '📅 Sáb 20/4 · ★★★★★ 4.9', price: '$4.500', priceColor: colors.cyan },
            { badge: '🙋 Pasajero busca',   badgeColor: colors.orange, badgeBg: colors.orangeBg,
              route: 'Rosario → Córdoba', info: '📅 Dom 21/4 · ★★★★ 4.2', price: '$2.800', priceColor: colors.orange },
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
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: '16px', fontWeight: '700', color: colors.text, marginBottom: '8px' }}>
                {c.route}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '12px', color: colors.text3 }}>{c.info}</span>
                <span style={{ fontSize: '14px', fontWeight: '700', color: c.priceColor }}>{c.price}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── SECCIÓN: CÓMO FUNCIONA ── */}
      <div id="como-funciona" style={{
        position: 'relative', zIndex: 1,
        background: colors.bg,
        borderTop: `1px solid ${colors.border}`,
        padding: '64px 40px',
      }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>

          {/* Título de sección */}
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '6px 12px', background: colors.cyanBg,
              borderRadius: '20px', fontSize: '12px', fontWeight: '600',
              color: colors.cyan, marginBottom: '16px',
            }}>
              ¿Cómo funciona?
            </div>
            <h2 style={{
              fontFamily: "'Fraunces', serif",
              fontSize: 'clamp(26px, 4vw, 40px)',
              fontWeight: '700', color: colors.text,
              letterSpacing: '-1px', margin: 0,
            }}>
              Tres pasos y ya estás viajando
            </h2>
          </div>

          {/* Los 3 pasos */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '20px',
          }}>
            {[
              {
                num: '01',
                icon: '👤',
                title: 'Registrate',
                desc: 'Creá tu cuenta en segundos con tu email, Google o Facebook. Completá tu perfil con una foto para generar más confianza.',
                color: colors.cyan,
                bg: colors.cyanBg,
              },
              {
                num: '02',
                icon: '🚗',
                title: 'Publicá o buscá',
                desc: 'Si tenés auto, publicá tu viaje y esperá pasajeros. Si necesitás viajar, buscá en la lista y uníte a alguien que ya va.',
                color: colors.orange,
                bg: colors.orangeBg,
              },
              {
                num: '03',
                icon: '🤝',
                title: 'Conectate y viajá',
                desc: 'Cuando encontrás a alguien, se crea una conexión. Desde ahí podés contactarlos por WhatsApp, Telegram o el método que prefieran.',
                color: '#10b981',
                bg: '#d1fae5',
              },
            ].map((step) => (
              <div key={step.num} style={{
                background: colors.white,
                border: `1.5px solid ${colors.border}`,
                borderRadius: '20px',
                padding: '28px 24px',
                boxShadow: shadows.sm,
                position: 'relative',
                overflow: 'hidden',
              }}>
                {/* Número de fondo decorativo */}
                <div style={{
                  position: 'absolute', top: '12px', right: '16px',
                  fontFamily: "'Fraunces', serif",
                  fontSize: '52px', fontWeight: '700',
                  color: step.bg, lineHeight: 1,
                  userSelect: 'none',
                }}>
                  {step.num}
                </div>

                {/* Ícono */}
                <div style={{
                  width: '52px', height: '52px',
                  borderRadius: '14px',
                  background: step.bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '24px', marginBottom: '16px',
                }}>
                  {step.icon}
                </div>

                <h3 style={{
                  fontFamily: "'Fraunces', serif",
                  fontSize: '20px', fontWeight: '700',
                  color: colors.text, marginBottom: '10px',
                }}>
                  {step.title}
                </h3>

                <p style={{
                  fontSize: '14px', color: colors.text2,
                  lineHeight: '1.65', margin: 0,
                }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

          {/* CTA final */}
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <button onClick={() => onNavigate('register')} style={{
              padding: '14px 36px', background: colors.cyan,
              color: 'white', border: 'none', borderRadius: '10px',
              fontSize: '15px', fontWeight: '700', cursor: 'pointer',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}>
              Empezar ahora — es gratis →
            </button>
            <p style={{ fontSize: '12px', color: colors.text3, marginTop: '12px' }}>
              Sin tarjeta de crédito. Sin costos ocultos. Sin comisiones.
            </p>
          </div>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <div style={{
        position: 'relative', zIndex: 1,
        borderTop: `1px solid ${colors.border}`,
        padding: '24px 40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        background: colors.white,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img src={LOGO} alt="VAMOS" style={{ height: '24px', borderRadius: '4px' }} />
          <span style={{ fontSize: '13px', color: colors.text3 }}>
            Red colaborativa de viajes
          </span>
        </div>
        <div style={{ display: 'flex', gap: '20px' }}>
          <span
            onClick={() => onNavigate('terminos')}
            style={{ fontSize: '12px', color: colors.text3, cursor: 'pointer' }}
          >
            Términos y Condiciones
          </span>
          <span
            onClick={() => onNavigate('privacidad')}
            style={{ fontSize: '12px', color: colors.text3, cursor: 'pointer' }}
          >
            Política de Privacidad
          </span>
        </div>
      </div>

    </div>
  );
}