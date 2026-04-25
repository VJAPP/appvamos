// ============================================================
// STARRATING.JSX — Modal para calificar a otro usuario
// ============================================================
// Aparece como una ventana encima de la pantalla.
// El usuario elige de 1 a 5 estrellas y opcionalmente
// escribe un comentario corto.
// ============================================================

import { useState } from 'react';
import { colors } from '../theme';

export default function StarRating({ targetName, onSubmit, onClose }) {

  const [score,   setScore]   = useState(0);   // Estrella seleccionada
  const [hovered, setHovered] = useState(0);   // Estrella sobre la que pasa el mouse
  const [comment, setComment] = useState('');
  const [error,   setError]   = useState('');

  const handleSubmit = () => {
    if (score === 0) {
      setError('Por favor elegí al menos una estrella.');
      return;
    }
    onSubmit(score, comment);
  };

  const displayScore = hovered || score;

  const scoreLabels = {
    1: 'Muy malo',
    2: 'Malo',
    3: 'Regular',
    4: 'Bueno',
    5: 'Excelente',
  };

  return (
    // Fondo oscuro semitransparente que cubre toda la pantalla
    <div style={{
      position:        'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display:         'flex',
      alignItems:      'center',
      justifyContent:  'center',
      zIndex:          999,
      padding:         '20px',
    }}>

      {/* Tarjeta del modal */}
      <div style={{
        backgroundColor: 'white',
        borderRadius:    '20px',
        padding:         '28px 24px',
        width:           '100%',
        maxWidth:        '360px',
        textAlign:       'center',
      }}>

        <p style={{ fontSize: '13px', color: colors.gray500, marginBottom: '4px' }}>
          Calificá tu experiencia con
        </p>
        <h3 style={{ color: colors.gray800, margin: '0 0 24px', fontSize: '20px' }}>
          👤 {targetName}
        </h3>

        {/* Estrellas */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              onClick={() => setScore(star)}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              style={{
                fontSize:   '40px',
                cursor:     'pointer',
                color:      star <= displayScore ? '#f59e0b' : colors.gray300,
                transition: 'color 0.1s, transform 0.1s',
                transform:  star <= displayScore ? 'scale(1.1)' : 'scale(1)',
                userSelect: 'none',
              }}
            >
              ★
            </span>
          ))}
        </div>

        {/* Label del puntaje */}
        <p style={{
          fontSize:     '14px',
          fontWeight:   '600',
          color:        displayScore ? '#f59e0b' : colors.gray300,
          marginBottom: '16px',
          minHeight:    '20px',
        }}>
          {displayScore ? scoreLabels[displayScore] : 'Tocá las estrellas'}
        </p>

        {/* Comentario opcional */}
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Comentario opcional (ej: Muy puntual, viaje cómodo...)"
          maxLength={200}
          style={{
            width:        '100%',
            padding:      '10px',
            borderRadius: '8px',
            border:       `1px solid ${colors.gray300}`,
            fontSize:     '14px',
            resize:       'none',
            height:       '72px',
            fontFamily:   'Arial, sans-serif',
            marginBottom: '8px',
            boxSizing:    'border-box',
          }}
        />
        <p style={{ fontSize: '11px', color: colors.gray300, textAlign: 'right', marginBottom: '12px' }}>
          {comment.length}/200
        </p>

        {/* Error */}
        {error && (
          <p style={{ color: colors.error, fontSize: '13px', marginBottom: '12px' }}>{error}</p>
        )}

        {/* Botones */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={onClose}
            style={{
              flex:            1,
              padding:         '11px',
              border:          `1px solid ${colors.gray300}`,
              borderRadius:    '10px',
              backgroundColor: 'white',
              color:           colors.gray500,
              fontWeight:      'bold',
              cursor:          'pointer',
              fontSize:        '14px',
            }}
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            style={{
              flex:            2,
              padding:         '11px',
              border:          'none',
              borderRadius:    '10px',
              backgroundColor: score ? '#f59e0b' : colors.gray300,
              color:           score ? 'white' : colors.gray500,
              fontWeight:      'bold',
              cursor:          score ? 'pointer' : 'not-allowed',
              fontSize:        '14px',
              transition:      'background 0.2s',
            }}
          >
            Enviar calificación
          </button>
        </div>

      </div>
    </div>
  );
}