import { styles, colors } from '../theme';
import LocationInput from './LocationInput';
import RouteButton from './RouteButton';

export default function PublishProduct({ mode, tripForm, onInputChange, onLocationChange, onSubmit, onBack, message, isError }) {
  const isCarry = mode === 'carry';
  const accentColor = isCarry ? colors.cyan : colors.orange;
  const title = isCarry ? '🚚 Ofrezco llevar un paquete' : '📦 Necesito enviar algo';

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <button style={styles.btnGray} onClick={onBack}>← Volver</button>
        <h2 style={{ color: accentColor, marginTop: '16px' }}>{title}</h2>

        {message && (
          <div style={isError ? styles.msgError : styles.msgSuccess}>{message}</div>
        )}

        <form onSubmit={onSubmit}>

          <LocationInput
            label="Desde dónde"
            value={tripForm.originLocation}
            onChange={(loc) => onLocationChange('origin', loc)}
            placeholder="Ej: Gualeguaychú..."
          />

          <LocationInput
            label="Hasta dónde"
            value={tripForm.destinationLocation}
            onChange={(loc) => onLocationChange('destination', loc)}
            placeholder="Ej: Buenos Aires..."
          />

          <RouteButton
            origin={tripForm.originLocation}
            destination={tripForm.destinationLocation}
          />

          <label style={styles.label}>Fecha estimada</label>
          <input style={styles.input} name="date" placeholder="Ej: Viernes 18/4"
            value={tripForm.date} onChange={onInputChange} />

          <label style={styles.label}>Descripción del paquete</label>
          <input style={styles.input} name="description" placeholder="Ej: Caja mediana, ropa, no frágil"
            value={tripForm.description} onChange={onInputChange} />

          <label style={styles.label}>Tamaño del paquete</label>
          <select style={styles.input} name="package_size"
            value={tripForm.package_size} onChange={onInputChange}>
            <option value="pequeño">🟢 Pequeño (entra en mochila)</option>
            <option value="mediano">🟡 Mediano (caja de zapatos)</option>
            <option value="grande">🔴 Grande (caja grande / bolso)</option>
          </select>

          <label style={styles.label}>{isCarry ? 'Colaboración esperada' : 'Colaboración ofrecida'}</label>
          <input style={styles.input} name="collaboration" placeholder="Ej: $1500"
            value={tripForm.collaboration} onChange={onInputChange} />

          <label style={styles.label}>Método de contacto</label>
          <select style={styles.input} name="contact_method"
            value={tripForm.contact_method} onChange={onInputChange}>
            <option value="whatsapp">WhatsApp</option>
            <option value="telegram">Telegram</option>
            <option value="messenger">Facebook Messenger</option>
            <option value="line">LINE</option>
            <option value="email">Email</option>
          </select>

          <label style={styles.label}>Tu número / usuario / email</label>
          <input style={styles.input} name="contact_info" placeholder="Ej: +5493446000000"
            value={tripForm.contact_info} onChange={onInputChange} />

          <button type="submit" style={isCarry ? styles.btnCyan : styles.btnOrange}>
            Publicar
          </button>
        </form>
      </div>
    </div>
  );
}