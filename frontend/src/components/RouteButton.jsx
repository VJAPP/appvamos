import { colors } from '../theme';

export default function RouteButton({ origin, destination }) {

  // Extraemos el texto sin importar si nos llega un objeto o un string simple
  // Si es objeto { name, lat, lon } → usamos .name
  // Si es string → lo usamos directamente
  const getText = (value) => {
    if (!value) return '';
    if (typeof value === 'object') return value.name || '';
    return value;
  };

  const getCoords = (value) => {
    if (value && typeof value === 'object' && value.lat && value.lon) {
      return { lat: value.lat, lon: value.lon };
    }
    return null;
  };

  const originText = getText(origin);
  const destText   = getText(destination);

  // No mostramos nada si falta alguno de los dos textos
  if (!originText.trim() || !destText.trim()) return null;

  const handleGoogleMaps = () => {
    const originCoords = getCoords(origin);
    const destCoords   = getCoords(destination);

    let url;
    if (originCoords && destCoords) {
      // Con coordenadas exactas
      url = `https://www.google.com/maps/dir/${originCoords.lat},${originCoords.lon}/${destCoords.lat},${destCoords.lon}`;
    } else {
      // Con texto — Google Maps lo resuelve igual
      url = `https://www.google.com/maps/dir/${encodeURIComponent(originText)}/${encodeURIComponent(destText)}`;
    }
    window.open(url, '_blank');
  };

  const handleWaze = () => {
    window.open(`https://waze.com/ul?q=${encodeURIComponent(destText)}&navigate=yes`, '_blank');
  };

  return (
    <div style={{
      backgroundColor: '#e8f5e9',
      border: '1px solid #a5d6a7',
      borderRadius: '10px',
      padding: '10px 12px',
      marginTop: '10px',
      marginBottom: '4px',
    }}>
      <p style={{ margin: '0 0 8px', fontSize: '12px', color: '#2e7d32', fontWeight: 'bold' }}>
        🗺️ {originText} → {destText}
      </p>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button type="button" onClick={handleGoogleMaps} style={{
          flex: 1, backgroundColor: '#4285F4', color: 'white',
          border: 'none', borderRadius: '8px', padding: '7px',
          fontSize: '12px', cursor: 'pointer', fontWeight: 'bold',
        }}>
          Google Maps
        </button>
        <button type="button" onClick={handleWaze} style={{
          flex: 1, backgroundColor: '#00BCD4', color: 'white',
          border: 'none', borderRadius: '8px', padding: '7px',
          fontSize: '12px', cursor: 'pointer', fontWeight: 'bold',
        }}>
          Waze
        </button>
      </div>
    </div>
  );
}