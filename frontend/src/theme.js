// ============================================================
// THEME.JS — Sistema de diseño VAMOS (Diseño Cálido)
// ============================================================

export const colors = {
  // Primarios
  cyan:        '#0ea5e9',
  cyanBg:      '#e0f2fe',
  cyanDark:    '#0284c7',
  orange:      '#f97316',
  orangeBg:    '#fff7ed',
  orangeDark:  '#ea6a0a',

  // Fondos
  bg:          '#faf9f7',
  bg2:         '#f3f1ed',
  white:       '#ffffff',

  // Texto
  text:        '#1c1917',
  text2:       '#57534e',
  text3:       '#a8a29e',

  // Estados
  success:     '#10b981',
  successBg:   '#d1fae5',
  error:       '#ef4444',
  errorBg:     '#fee2e2',

  // Bordes
  border:      '#e7e5e4',

  // VIP
  vip:         '#7c3aed',
  vipBg:       '#ede9fe',

  // Legados (para compatibilidad con componentes existentes)
  gray100:     '#f3f1ed',
  gray300:     '#e7e5e4',
  gray500:     '#a8a29e',
  gray800:     '#1c1917',
  cyanLight:   '#e0f2fe',
  orangeLight: '#fff7ed',
};

// Sombras reutilizables
export const shadows = {
  sm: '0 1px 3px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.04)',
  md: '0 2px 8px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)',
  lg: '0 4px 24px rgba(0,0,0,0.08)',
};

export const styles = {
  // Pantalla completa
  page: {
    minHeight:       '100vh',
    backgroundColor: colors.bg,
    display:         'flex',
    flexDirection:   'column',
    alignItems:      'center',
    padding:         '20px 16px',
    fontFamily:      "'Plus Jakarta Sans', sans-serif",
  },

  // Tarjeta base
  card: {
    backgroundColor: colors.white,
    borderRadius:    '16px',
    padding:         '20px',
    border:          `1.5px solid ${colors.border}`,
    boxShadow:       shadows.sm,
    width:           '100%',
    maxWidth:        '480px',
    marginBottom:    '12px',
  },

  // Input
  input: {
    width:           '100%',
    padding:         '11px 14px',
    borderRadius:    '10px',
    border:          `1.5px solid ${colors.border}`,
    fontSize:        '14px',
    marginBottom:    '12px',
    boxSizing:       'border-box',
    fontFamily:      "'Plus Jakarta Sans', sans-serif",
    color:           colors.text,
    backgroundColor: colors.white,
    outline:         'none',
  },

  // Botón cian
  btnCyan: {
    backgroundColor: colors.cyan,
    color:           colors.white,
    border:          'none',
    borderRadius:    '10px',
    padding:         '12px 24px',
    fontSize:        '14px',
    fontWeight:      '700',
    cursor:          'pointer',
    width:           '100%',
    marginTop:       '8px',
    fontFamily:      "'Plus Jakarta Sans', sans-serif",
  },

  // Botón naranja
  btnOrange: {
    backgroundColor: colors.orange,
    color:           colors.white,
    border:          'none',
    borderRadius:    '10px',
    padding:         '12px 24px',
    fontSize:        '14px',
    fontWeight:      '700',
    cursor:          'pointer',
    width:           '100%',
    marginTop:       '8px',
    fontFamily:      "'Plus Jakarta Sans', sans-serif",
  },

  // Botón secundario
  btnGray: {
    backgroundColor: colors.bg2,
    color:           colors.text2,
    border:          `1.5px solid ${colors.border}`,
    borderRadius:    '10px',
    padding:         '10px 20px',
    fontSize:        '13px',
    fontWeight:      '500',
    cursor:          'pointer',
    marginTop:       '4px',
    fontFamily:      "'Plus Jakarta Sans', sans-serif",
  },

  // Botón borrar
  btnDelete: {
    backgroundColor: 'transparent',
    color:           colors.error,
    border:          `1.5px solid ${colors.error}`,
    borderRadius:    '8px',
    padding:         '6px 12px',
    fontSize:        '12px',
    fontWeight:      '600',
    cursor:          'pointer',
    fontFamily:      "'Plus Jakarta Sans', sans-serif",
  },

  // Mensajes
  msgSuccess: {
    backgroundColor: colors.successBg,
    color:           colors.success,
    padding:         '12px 16px',
    borderRadius:    '10px',
    marginBottom:    '12px',
    textAlign:       'center',
    fontWeight:      '600',
    fontSize:        '14px',
    border:          `1px solid ${colors.success}30`,
  },
  msgError: {
    backgroundColor: colors.errorBg,
    color:           colors.error,
    padding:         '12px 16px',
    borderRadius:    '10px',
    marginBottom:    '12px',
    textAlign:       'center',
    fontWeight:      '600',
    fontSize:        '14px',
    border:          `1px solid ${colors.error}30`,
  },

  // Label
  label: {
    fontSize:    '12px',
    fontWeight:  '600',
    color:       colors.text3,
    marginBottom:'4px',
    display:     'block',
    letterSpacing:'0.3px',
  },
};