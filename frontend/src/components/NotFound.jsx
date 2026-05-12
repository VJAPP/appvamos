import { colors, shadows } from '../theme';
const LOGO = 'https://res.cloudinary.com/dl5og2uxd/image/upload/v1778507470/logo.png_foiemx.jpg';

export default function NotFound({ onNavigate }) {
  return (
    <div style={{
      minHeight: '100vh',
      background: colors.bg,
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    }}>
      <div style={{
        background: colors.white,
        border: `1.5px solid ${colors.border}`,
        borderRadius: '24px',
        padding: '48px 36px',
        textAlign: 'center',
        maxWidth: '420px',
        width: '100%',
        boxShadow: shadows.md,
      }}>

        <img src={LOGO} alt="VAMOS" style={{ height: '48px', borderRadius: '10px', marginBottom: '24px' }} />

        <div style={{
          fontSize: '64px',
          fontFamily: "'Fraunces', serif",
          fontWeight: '700',
          color: colors.border,
          lineHeight: 1,
          marginBottom: '16px',
        }}>
          404
        </div>

        <h2 style={{
          fontFamily: "'Fraunces', serif",
          fontSize: '22px', fontWeight: '700',
          color: colors.text, marginBottom: '10px',
        }}>
          Esta página no existe
        </h2>

        <p style={{
          fontSize: '14px', color: colors.text3,
          lineHeight: '1.6', marginBottom: '28px',
        }}>
          La dirección que escribiste no corresponde a ninguna sección de VAMOS.
        </p>

        <button
          onClick={() => onNavigate('landing')}
          style={{
            padding: '12px 28px',
            background: colors.cyan,
            color: 'white', border: 'none',
            borderRadius: '10px', fontSize: '14px',
            fontWeight: '700', cursor: 'pointer',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            width: '100%',
          }}
        >
          Volver al inicio
        </button>

      </div>
    </div>
  );
}