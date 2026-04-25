// ============================================================
// LOCATIONINPUT.JSX — Campo de búsqueda de lugares con
//                     autocompletado usando OpenStreetMap
// ============================================================
// Cómo funciona:
// 1. El usuario escribe al menos 3 letras
// 2. Le preguntamos a OpenStreetMap: "¿qué lugares conocés con ese nombre?"
// 3. Mostramos la lista de sugerencias
// 4. El usuario elige una y guardamos el nombre + coordenadas
// ============================================================

import { useState, useEffect, useRef } from 'react';
import { styles, colors } from '../theme';

export default function LocationInput({ label, value, onChange, placeholder }) {
  // Lista de sugerencias que nos devuelve OpenStreetMap
  const [suggestions, setSuggestions] = useState([]);
  // Lo que el usuario está escribiendo en este momento
  const [inputText, setInputText] = useState(value?.name || '');
  // Para no hacer una búsqueda por cada letra (esperamos que deje de escribir)
  const debounceTimer = useRef(null);
  // Para cerrar la lista si hace click afuera
  const containerRef = useRef(null);

  // Si el valor externo cambia (ej: cuando se limpia el formulario), actualizamos el texto
  useEffect(() => {
    setInputText(value?.name || '');
  }, [value]);

  // Cerrar sugerencias si el usuario hace click fuera del componente
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setSuggestions([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cada vez que el usuario escribe, esperamos 400ms antes de buscar
  // Esto evita hacer 10 búsquedas mientras escribe "Buenos Aires"
  const handleType = (e) => {
    const text = e.target.value;
    setInputText(text);

    // Si borra todo, limpiamos también el valor guardado
    if (!text) {
      onChange({ name: '', lat: null, lon: null });
      setSuggestions([]);
      return;
    }

    // Cancelamos el timer anterior y creamos uno nuevo
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      if (text.length >= 3) searchPlaces(text);
    }, 400);
  };

  // Búsqueda real en OpenStreetMap
  const searchPlaces = async (query) => {
    try {
      // Preguntamos a OpenStreetMap con el texto del usuario
      // &countrycodes=ar  → solo muestra resultados de Argentina (podés sacarlo si querés mundial)
      // &limit=5          → máximo 5 sugerencias
const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&addressdetails=1`;
      const res = await fetch(url, {
        headers: {
          // OpenStreetMap pide que te identifiques. Ponemos el nombre de tu app.
          'Accept-Language': 'es',
          'User-Agent': 'VAMOS-App/1.0',
        }
      });

      const data = await res.json();
      setSuggestions(data);
    } catch (error) {
      console.error('Error buscando lugares:', error);
      setSuggestions([]);
    }
  };

  // Cuando el usuario hace click en una sugerencia
  const handleSelect = (place) => {
    // Armamos un nombre corto y legible del lugar
    const name = formatPlaceName(place);
    setInputText(name);
    setSuggestions([]); // Cerramos la lista

    // Guardamos el nombre, latitud y longitud en el componente padre
    onChange({
      name: name,
      lat: parseFloat(place.lat),
      lon: parseFloat(place.lon),
    });
  };

  // Convierte el objeto de OpenStreetMap en un texto legible
  // Ej: "Avenida Corrientes, Buenos Aires, Argentina" → "Av. Corrientes, Buenos Aires"
  const formatPlaceName = (place) => {
    const addr = place.address || {};
    const parts = [];

    // Tomamos los datos más útiles si existen
    if (addr.road)            parts.push(addr.road);
    if (addr.city || addr.town || addr.village) parts.push(addr.city || addr.town || addr.village);
    if (addr.state)           parts.push(addr.state);

    // Si no pudimos armar nada, usamos el nombre genérico de OpenStreetMap
    return parts.length > 0 ? parts.join(', ') : place.display_name;
  };

  return (
    <div ref={containerRef} style={{ position: 'relative', marginBottom: '12px' }}>

      {/* Label */}
      <label style={styles.label}>{label}</label>

      {/* Input de texto */}
      <input
        style={{ ...styles.input, marginBottom: 0 }}
        type="text"
        placeholder={placeholder || 'Escribí al menos 3 letras...'}
        value={inputText}
        onChange={handleType}
        autoComplete="off"
      />

      {/* Lista de sugerencias (aparece solo si hay resultados) */}
      {suggestions.length > 0 && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          backgroundColor: colors.white,
          border: `1px solid ${colors.gray300}`,
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          zIndex: 100, // Aparece encima de otros elementos
          overflow: 'hidden',
        }}>
          {suggestions.map((place, index) => (
            <div
              key={place.place_id}
              onClick={() => handleSelect(place)}
              style={{
                padding: '10px 14px',
                cursor: 'pointer',
                fontSize: '14px',
                color: colors.gray800,
                borderBottom: index < suggestions.length - 1
                  ? `1px solid ${colors.gray100}` : 'none',
                // Efecto hover
                transition: 'background 0.1s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.gray100}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.white}
            >
              📍 {formatPlaceName(place)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}