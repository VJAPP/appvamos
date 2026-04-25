const API_URL = 'https://vamos-backend-ggqq.onrender.com';

// ---- USUARIOS ----
export async function registerUser({ name, email, password }) {
  const res = await fetch(`${API_URL}/api/users/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  return res.json();
}

export async function loginUser({ email, password }) {
  const res = await fetch(`${API_URL}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return { ok: res.ok, data: await res.json() };
}

export async function updateProfile({ email, name, city }) {
  const res = await fetch(`${API_URL}/api/users/profile`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, name, city }),
  });
  return { ok: res.ok, data: await res.json() };
}

// La foto se envía como FormData (formato especial para archivos)
export async function uploadPhoto(email, file) {
  const formData = new FormData();
  formData.append('email', email);
  formData.append('photo', file);

  const res = await fetch(`${API_URL}/api/users/profile/photo`, {
    method: 'POST',
    body: formData, // Sin Content-Type — el navegador lo setea solo para archivos
  });
  return { ok: res.ok, data: await res.json() };
}

// ---- VIAJES ----
export async function getTrips() {
  const res = await fetch(`${API_URL}/api/trips`);
  const data = await res.json();
  return data.trips || [];
}

export async function createTrip(tripData) {
  const res = await fetch(`${API_URL}/api/trips`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tripData),
  });
  return { ok: res.ok, data: await res.json() };
}

export async function deleteTrip(tripId, email) {
  const res = await fetch(`${API_URL}/api/trips/${tripId}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  return { ok: res.ok, data: await res.json() };
}

// ---- CONEXIONES ----
export async function getConnections(email) {
  const res = await fetch(`${API_URL}/api/connections?email=${email}`);
  const data = await res.json();
  return data.connections || [];
}

export async function createConnection(connectionData) {
  const res = await fetch(`${API_URL}/api/connections`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(connectionData),
  });
  return { ok: res.ok, data: await res.json() };
}

export async function deleteConnection(connectionId, email) {
  const res = await fetch(`${API_URL}/api/connections/${connectionId}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  return { ok: res.ok, data: await res.json() };
}

// ---- PRODUCTOS ----
export async function getProducts() {
  const res = await fetch(`${API_URL}/api/products`);
  const data = await res.json();
  return data.products || [];
}

export async function createProduct(productData) {
  const res = await fetch(`${API_URL}/api/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData),
  });
  return { ok: res.ok, data: await res.json() };
}

export async function deleteProduct(productId, email) {
  const res = await fetch(`${API_URL}/api/products/${productId}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  return { ok: res.ok, data: await res.json() };
}

export async function getProductConnections(email) {
  const res = await fetch(`${API_URL}/api/products/connections?email=${email}`);
  const data = await res.json();
  return data.connections || [];
}

export async function createProductConnection(connectionData) {
  const res = await fetch(`${API_URL}/api/products/connections`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(connectionData),
  });
  return { ok: res.ok, data: await res.json() };
}

export async function deleteProductConnection(connectionId, email) {
  const res = await fetch(`${API_URL}/api/products/connections/${connectionId}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  return { ok: res.ok, data: await res.json() };
}
// ---- CALIFICACIONES ----

// Crear una calificación nueva
export async function createRating({ from_email, to_email, connection_id, score, comment }) {
  const res = await fetch(`${API_URL}/api/ratings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ from_email, to_email, connection_id, score, comment }),
  });
  return { ok: res.ok, data: await res.json() };
}

// Obtener el promedio de calificaciones de un usuario
export async function getUserRating(email) {
  const res  = await fetch(`${API_URL}/api/ratings?email=${email}`);
  const data = await res.json();
  return data; // { average: 4.5, count: 12 }
}

// Ver qué conexiones ya califiqué (para no mostrar el botón dos veces)
export async function getMyRatings(email) {
  const res  = await fetch(`${API_URL}/api/ratings/mine?email=${email}`);
  const data = await res.json();
  return data.rated || []; // [1, 4, 7, ...]
}
// ---- MIS PUBLICACIONES ----

export async function getMyTrips(email) {
  const res  = await fetch(`${API_URL}/api/trips/mine?email=${email}`);
  const data = await res.json();
  return data.trips || [];
}

export async function getMyProducts(email) {
  const res  = await fetch(`${API_URL}/api/products/mine?email=${email}`);
  const data = await res.json();
  return data.products || [];
}

export async function getTripConnections(tripId) {
  const res  = await fetch(`${API_URL}/api/trips/${tripId}/connections`);
  const data = await res.json();
  return data.connections || [];
}

export async function getProductConnections2(productId) {
  const res  = await fetch(`${API_URL}/api/products/${productId}/connections`);
  const data = await res.json();
  return data.connections || [];
}