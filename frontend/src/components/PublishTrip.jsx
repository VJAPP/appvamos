import { useState } from 'react';
import { styles, colors } from '../theme';
import LocationInput from './LocationInput';
import RouteButton from './RouteButton';

export default function PublishTrip({ tripForm, onInputChange, onLocationChange, onSubmit, onBack, message, isError }) {
  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <button style={styles.btnGray} onClick={onBack}>← Volver</button>
        <h2 style={{ color: colors.cyan, marginTop: '16px' }}>🚗 Publicar viaje</h2>
        <p style={{ color: colors.gray500, marginTop: 0 }}>
          Completá los datos y encontrá pasajeros para compartir los gastos.
        </p>

        {message && (
          <div style={isError ? styles.msgError : styles.msgSuccess}>{message}</div>
        )}

        <form onSubmit={onSubmit}>

          {/* Campos de ubicación con autocompletado */}
          <LocationInput
            label="Origen"
            value={tripForm.originLocation}
            onChange={(loc) => onLocationChange('origin', loc)}
            placeholder="Ej: Gualeguaychú..."
          />

          <LocationInput
            label="Destino"
            value={tripForm.destinationLocation}
            onChange={(loc) => onLocationChange('destination', loc)}
            placeholder="Ej: Buenos Aires..."
          />

          {/* Botón de ruta — aparece solo cuando hay origen y destino */}
          <RouteButton
            origin={tripForm.originLocation}
            destination={tripForm.destinationLocation}
          />

          <label style={styles.label}>Fecha y hora</label>
          <input style={styles.input} name="date" placeholder="Ej: Viernes 18/4 a las 08:00"
            value={tripForm.date} onChange={onInputChange} />

          <label style={styles.label}>Colaboración esperada por pasajero</label>
          <input style={styles.input} name="collaboration" placeholder="Ej: $3000"
            value={tripForm.collaboration} onChange={onInputChange} />

          <label style={styles.label}>Descripción (opcional)</label>
          <input style={styles.input} name="description" placeholder="Ej: Viaje directo, salimos a tiempo"
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

          <button type="submit" style={styles.btnCyan}>Publicar viaje</button>
        </form>
      </div>
    </div>
  );
}