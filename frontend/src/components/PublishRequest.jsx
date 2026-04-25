import { styles, colors } from '../theme';
import LocationInput from './LocationInput';
import RouteButton from './RouteButton';

export default function PublishRequest({ tripForm, onInputChange, onLocationChange, onSubmit, onBack, message, isError }) {
  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <button style={styles.btnGray} onClick={onBack}>← Volver</button>
        <h2 style={{ color: colors.orange, marginTop: '16px' }}>🙋 Buscar viaje</h2>
        <p style={{ color: colors.gray500, marginTop: 0 }}>
          Publicá tu solicitud y encontrá un conductor.
        </p>

        {message && (
          <div style={isError ? styles.msgError : styles.msgSuccess}>{message}</div>
        )}

        <form onSubmit={onSubmit}>

          <LocationInput
            label="Desde dónde salís"
            value={tripForm.originLocation}
            onChange={(loc) => onLocationChange('origin', loc)}
            placeholder="Ej: Gualeguaychú..."
          />

          <LocationInput
            label="A dónde vas"
            value={tripForm.destinationLocation}
            onChange={(loc) => onLocationChange('destination', loc)}
            placeholder="Ej: Buenos Aires..."
          />

          <RouteButton
            origin={tripForm.originLocation}
            destination={tripForm.destinationLocation}
          />

          <label style={styles.label}>Fecha y hora</label>
          <input style={styles.input} name="date" placeholder="Ej: Viernes 18/4 a las 08:00"
            value={tripForm.date} onChange={onInputChange} />

          <label style={styles.label}>Colaboración ofrecida</label>
          <input style={styles.input} name="collaboration" placeholder="Ej: $3000"
            value={tripForm.collaboration} onChange={onInputChange} />

          <label style={styles.label}>Descripción (opcional)</label>
          <input style={styles.input} name="description" placeholder="Ej: Viajo liviano, soy puntual"
            value={tripForm.description} onChange={onInputChange} />

          <label style={styles.label}>Método de contacto</label>
          <select style={styles.input} name="contact_method"
            value={tripForm.contact_method} onChange={onInputChange}>
            <option value="whatsapp">WhatsApp</option>
            <option value="telegram">Telegram</option>
            <option value="messenger">Facebook Messenger</option>
            <option value="line">LINE</option>
            <option value="email">Email</option>
          </select>

          <label style={styles.label}>Tu número / usuario / email de contacto</label>
          <input style={styles.input} name="contact_info" placeholder="Ej: +5493446000000"
            value={tripForm.contact_info} onChange={onInputChange} />

          <button type="submit" style={styles.btnOrange}>Publicar solicitud</button>
        </form>
      </div>
    </div>
  );
}