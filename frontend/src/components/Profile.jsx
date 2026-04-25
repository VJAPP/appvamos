// ============================================================
// PROFILE.JSX — Pantalla de perfil del usuario
// ============================================================

import { useState } from 'react';
import { styles, colors } from '../theme';
import { updateProfile, uploadPhoto } from '../services/api';

export default function Profile({ user, onBack, onProfileUpdate }) {
  const [name, setName]       = useState(user.name || '');
  const [city, setCity]       = useState(user.city || '');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(user.photo_url || '');

  // Calculamos el % de completitud del perfil
  const calcProgress = (photoUrl, userName, userCity) => {
    let score = 0;
    if (userName)  score += 40;  // Nombre vale 40%
    if (photoUrl)  score += 40;  // Foto vale 40%
    if (userCity)  score += 20;  // Ciudad vale 20%
    return score;
  };

  const progress = calcProgress(photoPreview, name, city);

  const progressColor = progress < 50 ? colors.error
    : progress < 100 ? colors.orange
    : colors.success;

  // ── Guardar nombre y ciudad ──
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setMessage('Guardando...');

    const { ok } = await updateProfile({ email: user.email, name, city });

    if (ok) {
      setMessage('✅ Perfil actualizado correctamente');
      setIsError(false);
      // Avisamos al componente padre (App.jsx) que el usuario cambió
      onProfileUpdate({ ...user, name, city });
    } else {
      setMessage('Error al actualizar el perfil');
      setIsError(true);
    }
  };

  // ── Subir foto ──
  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Mostramos preview local inmediato antes de subir
    const localPreview = URL.createObjectURL(file);
    setPhotoPreview(localPreview);
    setUploading(true);
    setMessage('Subiendo foto...');

    const { ok, data } = await uploadPhoto(user.email, file);

    if (ok) {
      setPhotoPreview(data.photo_url); // URL definitiva de Cloudinary
      setMessage('✅ Foto actualizada');
      setIsError(false);
      onProfileUpdate({ ...user, photo_url: data.photo_url });
    } else {
      setMessage('Error al subir la foto');
      setIsError(true);
    }
    setUploading(false);
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        <button style={styles.btnGray} onClick={onBack}>← Volver</button>
        <h2 style={{ color: colors.gray800, marginTop: '16px' }}>✏️ Mi Perfil</h2>

        {/* ── BARRA DE PROGRESO ── */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '6px',
          }}>
            <span style={{ fontSize: '13px', color: colors.gray500, fontWeight: '600' }}>
              Completitud del perfil
            </span>
            <span style={{ fontSize: '13px', fontWeight: '700', color: progressColor }}>
              {progress}%
            </span>
          </div>
          {/* Barra gris de fondo */}
          <div style={{
            backgroundColor: colors.gray100,
            borderRadius: '20px',
            height: '8px',
            overflow: 'hidden',
          }}>
            {/* Barra de color que avanza */}
            <div style={{
              width: `${progress}%`,
              backgroundColor: progressColor,
              height: '100%',
              borderRadius: '20px',
              transition: 'width 0.4s ease',
            }} />
          </div>
          {progress < 100 && (
            <p style={{ fontSize: '12px', color: colors.gray500, marginTop: '6px' }}>
              {!photoPreview && '📷 Agregá una foto · '}
              {!city && '🏙️ Agregá tu ciudad'}
            </p>
          )}
        </div>

        {/* ── FOTO DE PERFIL ── */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          {/* Círculo con la foto o placeholder */}
          <div style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            backgroundColor: colors.gray100,
            border: `3px solid ${colors.cyan}`,
            margin: '0 auto 12px',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '40px',
          }}>
            {photoPreview
              ? <img src={photoPreview} alt="Foto de perfil"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : '👤'
            }
          </div>

          {/* Input oculto + botón visible */}
          <input
            type="file"
            id="photo-input"
            accept="image/*"
            onChange={handlePhotoChange}
            style={{ display: 'none' }} // Lo ocultamos visualmente
          />
          <label
            htmlFor="photo-input"
            style={{
              backgroundColor: colors.cyanLight,
              color: colors.cyanDark,
              borderRadius: '8px',
              padding: '7px 16px',
              fontSize: '13px',
              fontWeight: 'bold',
              cursor: uploading ? 'not-allowed' : 'pointer',
              opacity: uploading ? 0.6 : 1,
            }}
          >
            {uploading ? 'Subiendo...' : '📷 Cambiar foto'}
          </label>
        </div>

        {/* ── MENSAJE ── */}
        {message && (
          <div style={isError ? styles.msgError : styles.msgSuccess}>
            {message}
          </div>
        )}

        {/* ── FORMULARIO ── */}
        <form onSubmit={handleSaveProfile}>

          <label style={styles.label}>Nombre</label>
          <input
            style={styles.input}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tu nombre completo"
          />

          <label style={styles.label}>Ciudad base (opcional)</label>
          <input
            style={styles.input}
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Ej: Gualeguaychú"
          />

          <label style={styles.label}>Email</label>
          <input
            style={{ ...styles.input, backgroundColor: colors.gray100, color: colors.gray500 }}
            type="text"
            value={user.email}
            disabled // El email no se puede cambiar
          />

          <button type="submit" style={styles.btnCyan}>
            Guardar cambios
          </button>
        </form>

      </div>
    </div>
  );
}