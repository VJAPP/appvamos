import { styles, colors, shadows } from '../theme';
const LOGO = 'https://res.cloudinary.com/dl5og2uxd/image/upload/v1778507470/logo.png_foiemx.jpg';

export default function Auth({
  mode, name, email, password,
  setName, setEmail, setPassword,
  onLogin, onRegister, onSwitchMode,
  message, isError
}) {
  const isLogin = mode === 'login';

  return (
    <div style={{
      minHeight: '100vh', background: colors.bg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px', fontFamily: "'Plus Jakarta Sans', sans-serif",
    }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>

        {/* Logo */}
       <div style={{ textAlign: 'center', marginBottom: '28px' }}>
  <img src={LOGO} alt="VAMOS" style={{ height: '52px', width: 'auto', borderRadius: '12px', marginBottom: '8px' }} />
  <p style={{ fontSize: '14px', color: colors.text3, margin: 0 }}>
    {isLogin ? 'Bienvenido de vuelta' : 'Creá tu cuenta gratis'}
  </p>
</div>

        <div style={{
          background: colors.white, borderRadius: '20px',
          padding: '28px', border: `1.5px solid ${colors.border}`,
          boxShadow: shadows.md,
        }}>

          {message && (
            <div style={isError ? styles.msgError : styles.msgSuccess}>
              {message}
            </div>
          )}

          {/* Botones sociales */}
          <div style={{ marginBottom: '20px' }}>
            {[
              { label: 'Continuar con Google', color: '#EA4335', letter: 'G',
                href: 'https://vamos-backend-ggqq.onrender.com/api/auth/google', bg: 'white', textColor: colors.text },
              { label: 'Continuar con Facebook', color: '#1877F2', letter: 'f',
                href: 'https://vamos-backend-ggqq.onrender.com/api/auth/facebook', bg: '#1877F2', textColor: 'white' },
            ].map((s) => (
              <a key={s.label} href={s.href} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: '10px', width: '100%', padding: '11px',
                borderRadius: '10px', marginBottom: '8px',
                border: s.bg === 'white' ? `1.5px solid ${colors.border}` : 'none',
                backgroundColor: s.bg, color: s.textColor,
                fontSize: '14px', fontWeight: '600', textDecoration: 'none',
                boxSizing: 'border-box', cursor: 'pointer',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                boxShadow: shadows.sm,
              }}>
                <span style={{
                  width: '20px', height: '20px', borderRadius: '50%',
                  background: s.color, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', color: 'white',
                  fontSize: '10px', fontWeight: '900', flexShrink: 0,
                }}>
                  {s.letter}
                </span>
                {s.label}
              </a>
            ))}
          </div>

          {/* Separador */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ flex: 1, height: '1px', background: colors.border }} />
            <span style={{ fontSize: '12px', color: colors.text3 }}>o con email</span>
            <div style={{ flex: 1, height: '1px', background: colors.border }} />
          </div>

          {/* Formulario */}
          <form onSubmit={isLogin ? onLogin : onRegister}>
            {!isLogin && (
              <>
                <label style={styles.label}>Tu nombre</label>
                <input style={styles.input} type="text" placeholder="Ej: Juan Pérez"
                  value={name || ''} onChange={(e) => setName(e.target.value)} />
              </>
            )}

            <label style={styles.label}>Email</label>
            <input style={styles.input} type="email" placeholder="tu@email.com"
              value={email || ''} onChange={(e) => setEmail(e.target.value)} />

            <label style={styles.label}>Contraseña</label>
            <input style={styles.input} type="password" placeholder="••••••••"
              value={password || ''} onChange={(e) => setPassword(e.target.value)} />

            <button type="submit" style={{ ...styles.btnCyan, marginTop: '16px' }}>
              {isLogin ? 'Ingresar' : 'Crear cuenta'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '13px', color: colors.text3 }}>
            {isLogin ? '¿No tenés cuenta? ' : '¿Ya tenés cuenta? '}
            <span onClick={onSwitchMode}
              style={{ color: colors.cyan, cursor: 'pointer', fontWeight: '700' }}>
              {isLogin ? 'Registrate' : 'Ingresá'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}