// ============================================================
// SERVICES/EMAIL.JS — Envío de emails con Resend
// ============================================================
// Este archivo tiene una función por cada tipo de email
// que la app puede enviar. Así si mañana queremos cambiar
// el diseño de un email, sabemos exactamente dónde ir.
// ============================================================

const { Resend } = require('resend');

// Inicializamos Resend con la API Key del .env
const resend = new Resend(process.env.RESEND_API_KEY);

// ── Email que se envía al dueño de un viaje cuando alguien se conecta ──
// Parámetros:
//   ownerEmail    = email de quien publicó el viaje
//   ownerName     = nombre de quien publicó
//   requesterName = nombre de quien se conectó
//   origin        = origen del viaje
//   destination   = destino del viaje
//   date          = fecha del viaje
async function sendConnectionEmail({ ownerEmail, ownerName, requesterName, origin, destination, date }) {
  try {
    await resend.emails.send({
      from:    'VAMOS <onboarding@resend.dev>',
      to:      ownerEmail,
      subject: `¡${requesterName} se conectó a tu viaje! 🚗`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">

          <!-- Header -->
          <div style="background: #06b6d4; border-radius: 16px; padding: 24px; text-align: center; margin-bottom: 24px;">
            <h1 style="color: white; margin: 0; font-size: 28px;">VAMOS 🚗</h1>
            <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0; font-size: 14px;">
              Red colaborativa de viajes
            </p>
          </div>

          <!-- Cuerpo -->
          <div style="background: #ffffff; border-radius: 16px; padding: 24px; border: 1px solid #e5e7eb;">
            <p style="color: #6b7280; margin: 0 0 4px; font-size: 14px;">Hola, <strong style="color: #1f2937;">${ownerName}</strong></p>
            <h2 style="color: #1f2937; margin: 8px 0 20px; font-size: 20px;">
              ¡Tenés una nueva conexión! 🤝
            </h2>

            <p style="color: #374151; font-size: 15px; line-height: 1.6;">
              <strong>${requesterName}</strong> se interesó en tu viaje y se conectó con vos.
            </p>

            <!-- Datos del viaje -->
            <div style="background: #f3f4f6; border-radius: 10px; padding: 16px; margin: 16px 0;">
              <p style="margin: 4px 0; color: #6b7280; font-size: 14px;">
                📍 <strong>Recorrido:</strong> ${origin} → ${destination}
              </p>
              <p style="margin: 4px 0; color: #6b7280; font-size: 14px;">
                📅 <strong>Fecha:</strong> ${date}
              </p>
              <p style="margin: 4px 0; color: #6b7280; font-size: 14px;">
                👤 <strong>Se conectó:</strong> ${requesterName}
              </p>
            </div>

            <p style="color: #374151; font-size: 14px; line-height: 1.6;">
              Entrá a la app y revisá tus <strong>Mis Conexiones</strong> para ver sus datos de contacto y coordinar el viaje.
            </p>

            <!-- Botón -->
            <div style="text-align: center; margin-top: 24px;">
              <a href="http://localhost:5173"
                style="background: #06b6d4; color: white; padding: 12px 32px;
                       border-radius: 10px; text-decoration: none; font-weight: bold;
                       font-size: 15px; display: inline-block;">
                Ver mis conexiones →
              </a>
            </div>
          </div>

          <!-- Footer -->
          <p style="text-align: center; color: #9ca3af; font-size: 12px; margin-top: 20px;">
            VAMOS — Red colaborativa de viajes
          </p>

        </div>
      `,
    });

    console.log(`✅ Email enviado a ${ownerEmail}`);
  } catch (error) {
    // Si el email falla, lo logueamos pero NO rompemos el flujo de la app
    // La conexión igual se guarda — el email es un extra, no una dependencia
    console.error('❌ Error enviando email:', error.message);
  }
}

// ── Email para conexiones de productos ──
async function sendProductConnectionEmail({ ownerEmail, ownerName, requesterName, origin, destination, date, packageSize }) {
  try {
    await resend.emails.send({
      from:    'VAMOS <onboarding@resend.dev>',
      to:      ownerEmail,
      subject: `¡${requesterName} se conectó a tu publicación de envío! 📦`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">

          <div style="background: #f97316; border-radius: 16px; padding: 24px; text-align: center; margin-bottom: 24px;">
            <h1 style="color: white; margin: 0; font-size: 28px;">VAMOS 📦</h1>
            <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0; font-size: 14px;">
              Red colaborativa de envíos
            </p>
          </div>

          <div style="background: #ffffff; border-radius: 16px; padding: 24px; border: 1px solid #e5e7eb;">
            <p style="color: #6b7280; margin: 0 0 4px; font-size: 14px;">Hola, <strong style="color: #1f2937;">${ownerName}</strong></p>
            <h2 style="color: #1f2937; margin: 8px 0 20px; font-size: 20px;">
              ¡Nueva conexión en envíos! 🤝
            </h2>

            <p style="color: #374151; font-size: 15px; line-height: 1.6;">
              <strong>${requesterName}</strong> se conectó con vos por tu publicación de envío.
            </p>

            <div style="background: #f3f4f6; border-radius: 10px; padding: 16px; margin: 16px 0;">
              <p style="margin: 4px 0; color: #6b7280; font-size: 14px;">
                📍 <strong>Recorrido:</strong> ${origin} → ${destination}
              </p>
              <p style="margin: 4px 0; color: #6b7280; font-size: 14px;">
                📅 <strong>Fecha:</strong> ${date}
              </p>
              ${packageSize ? `<p style="margin: 4px 0; color: #6b7280; font-size: 14px;">📐 <strong>Tamaño:</strong> ${packageSize}</p>` : ''}
              <p style="margin: 4px 0; color: #6b7280; font-size: 14px;">
                👤 <strong>Se conectó:</strong> ${requesterName}
              </p>
            </div>

            <div style="text-align: center; margin-top: 24px;">
              <a href="http://localhost:5173"
                style="background: #f97316; color: white; padding: 12px 32px;
                       border-radius: 10px; text-decoration: none; font-weight: bold;
                       font-size: 15px; display: inline-block;">
                Ver mis conexiones →
              </a>
            </div>
          </div>

          <p style="text-align: center; color: #9ca3af; font-size: 12px; margin-top: 20px;">
            VAMOS — Red colaborativa de viajes
          </p>
        </div>
      `,
    });

    console.log(`✅ Email de producto enviado a ${ownerEmail}`);
  } catch (error) {
    console.error('❌ Error enviando email de producto:', error.message);
  }
}

module.exports = { sendConnectionEmail, sendProductConnectionEmail };