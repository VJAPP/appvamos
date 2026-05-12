import { useState, useEffect } from 'react';
import Landing         from './components/Landing';
import Auth            from './components/Auth';
import Home            from './components/Home';
import Profile         from './components/Profile';
import TripList        from './components/TripList';
import Connections     from './components/Connections';
import PublishTrip     from './components/PublishTrip';
import PublishRequest  from './components/PublishRequest';
import PublishProduct  from './components/PublishProduct';
import ProductList     from './components/ProductList';
import MyPublications from './components/MyPublications';
import NotFound from './components/NotFound';
import {
  loginUser, registerUser,
  getTrips, createTrip, deleteTrip,
  getConnections, createConnection, deleteConnection,
  getProducts, createProduct, deleteProduct,
  getProductConnections, createProductConnection, deleteProductConnection,
} from './services/api';

const EMPTY_FORM = {
  origin: '', destination: '',
  originLocation:      { name: '', lat: null, lon: null },
  destinationLocation: { name: '', lat: null, lon: null },
  date: '', collaboration: '', description: '',
  contact_method: 'whatsapp', contact_info: '',
  package_size: 'pequeño',
};

export default function App() {
  const [view, setView]               = useState('landing');
  const [user, setUser]               = useState(null);
  const [trips, setTrips]             = useState([]);
  const [connections, setConnections] = useState([]);
  const [products, setProducts]       = useState([]);
  const [productConns, setProductConns] = useState([]);
  const [tripForm, setTripForm]       = useState(EMPTY_FORM);
  const [message, setMessage]         = useState('');
  const [isError, setIsError]         = useState(false);
  const [name, setName]               = useState('');
  const [email, setEmail]             = useState('');
  const [password, setPassword]       = useState('');

  useEffect(() => {
  const search = new URLSearchParams(window.location.search);
  const auth   = search.get('auth');

  if (auth === 'ok') {
    const socialUser = {
      id:        search.get('id'),
      name:      search.get('name'),
      email:     search.get('email'),
      photo_url: search.get('photo_url') || '',
      city:      search.get('city')      || '',
    };
    if (socialUser.id && socialUser.email) {
      window.history.replaceState({}, '', '/');
      setUser(socialUser);
      setView('home');
    }
  }

  if (auth === 'error') {
    window.history.replaceState({}, '', '/');
    setView('login');
  }
}, []);
  useEffect(() => {
    if (view === 'browse')              loadTrips();
    if (view === 'connections')         loadConnections();
    if (view === 'browse_products')     loadProducts();
    if (view === 'product_connections') loadProductConns();
  }, [view]);

  const showMsg = (text, error = false) => { setMessage(text); setIsError(error); };
  const handleInputChange    = (e) => setTripForm({ ...tripForm, [e.target.name]: e.target.value });
  const handleLocationChange = (field, loc) => setTripForm({
    ...tripForm,
    [field]: loc.name,
    [`${field}Location`]: loc,
  });

  // ---- AUTH ----
  const handleRegister = async (e) => {
    e.preventDefault(); showMsg('Procesando...');
    const data = await registerUser({ name, email, password });
    if (data.error) showMsg(data.error, true);
    else { showMsg('¡Registro exitoso!'); setTimeout(() => setView('login'), 1500); }
  };

  const handleLogin = async (e) => {
    e.preventDefault(); showMsg('Verificando...');
    const { ok, data } = await loginUser({ email, password });
    if (!ok) showMsg(data.error || 'Error al ingresar', true);
    else { setUser(data.user); showMsg(''); setView('home'); }
  };

  const handleLogout = () => {
    setUser(null); setEmail(''); setPassword(''); setName(''); setView('landing');
  };

  // Cuando el usuario edita su perfil, actualizamos el estado global
  const handleProfileUpdate = (updatedUser) => {
    setUser(updatedUser);
  };

  // ---- VIAJES ----
  const loadTrips = async () => setTrips(await getTrips());

  const handlePublishOffer = async (e) => {
    e.preventDefault(); showMsg('Publicando...');
    const { ok, data } = await createTrip({
      ...tripForm,
      creator_name:  user.name,
      creator_email: user.email,
      creator_photo: user.photo_url || '',
      type: 'offer',
    });
    if (!ok) showMsg(data.error || 'Error', true);
    else { showMsg('✅ Viaje publicado'); setTripForm(EMPTY_FORM); setTimeout(() => setView('browse'), 1500); }
  };

  const handlePublishRequest = async (e) => {
    e.preventDefault(); showMsg('Publicando...');
    const { ok, data } = await createTrip({
      ...tripForm,
      creator_name:  user.name,
      creator_email: user.email,
      creator_photo: user.photo_url || '',
      type: 'request',
    });
    if (!ok) showMsg(data.error || 'Error', true);
    else { showMsg('✅ Solicitud publicada'); setTripForm(EMPTY_FORM); setTimeout(() => setView('browse'), 1500); }
  };

  const handleDeleteTrip = async (tripId) => {
    if (!window.confirm('¿Eliminar este viaje?')) return;
    const { ok } = await deleteTrip(tripId, user.email);
    if (ok) { setTrips(trips.filter(t => t.id !== tripId)); showMsg('🗑️ Viaje eliminado'); }
    else showMsg('Error al eliminar', true);
  };

  // ---- CONEXIONES ----
  const loadConnections = async () => { if (user) setConnections(await getConnections(user.email)); };

  const handleConnect = async (trip) => {
    const action = trip.type === 'offer' ? 'unirte a este viaje' : 'ofrecerte para este viaje';
    if (!window.confirm(`¿Seguro que querés ${action} con ${trip.creator_name}?`)) return;
    const { ok } = await createConnection({
      trip_id: trip.id,
      requester_name: user.name, requester_email: user.email,
      owner_name: trip.creator_name, owner_email: trip.creator_email,
      origin: trip.origin, destination: trip.destination,
      date: trip.date, collaboration: trip.collaboration,
      contact_method: trip.contact_method, contact_info: trip.contact_info,
    });
    if (ok) alert('✅ ¡Conexión creada! La encontrás en "Mis conexiones".');
    else showMsg('Error al crear conexión', true);
  };

  const handleDeleteConnection = async (connId) => {
    if (!window.confirm('¿Borrar esta conexión?')) return;
    const { ok } = await deleteConnection(connId, user.email);
    if (ok) setConnections(connections.filter(c => c.id !== connId));
    else showMsg('Error al borrar', true);
  };

  // ---- PRODUCTOS ----
  const loadProducts = async () => setProducts(await getProducts());

  const handlePublishProduct = async (e, type) => {
    e.preventDefault(); showMsg('Publicando...');
    const { ok, data } = await createProduct({
      ...tripForm,
      creator_name:  user.name,
      creator_email: user.email,
      creator_photo: user.photo_url || '',
      type,
    });
    if (!ok) showMsg(data.error || 'Error', true);
    else { showMsg('✅ Publicado'); setTripForm(EMPTY_FORM); setTimeout(() => setView('browse_products'), 1500); }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('¿Eliminar esta publicación?')) return;
    const { ok } = await deleteProduct(productId, user.email);
    if (ok) setProducts(products.filter(p => p.id !== productId));
    else showMsg('Error al eliminar', true);
  };

  const loadProductConns = async () => { if (user) setProductConns(await getProductConnections(user.email)); };

  const handleConnectProduct = async (product) => {
    if (!window.confirm(`¿Conectarte con ${product.creator_name} por este envío?`)) return;
    const { ok } = await createProductConnection({
      product_id: product.id,
      requester_name: user.name, requester_email: user.email,
      owner_name: product.creator_name, owner_email: product.creator_email,
      origin: product.origin, destination: product.destination,
      date: product.date, collaboration: product.collaboration,
      contact_method: product.contact_method, contact_info: product.contact_info,
    });
    if (ok) alert('✅ ¡Conexión creada!');
    else showMsg('Error al crear conexión', true);
  };

  const handleDeleteProductConn = async (connId) => {
    if (!window.confirm('¿Borrar esta conexión?')) return;
    const { ok } = await deleteProductConnection(connId, user.email);
    if (ok) setProductConns(productConns.filter(c => c.id !== connId));
    else showMsg('Error al borrar', true);
  };

  // ---- RENDERIZADO ----
  if (view === 'landing')    return <Landing onNavigate={setView} />;
  if (view === 'register')   return <Auth mode="register" name={name} email={email} password={password}
    setName={setName} setEmail={setEmail} setPassword={setPassword}
    onRegister={handleRegister} onSwitchMode={() => setView('login')}
    message={message} isError={isError} />;
  if (view === 'login')      return <Auth mode="login" email={email} password={password}
    setEmail={setEmail} setPassword={setPassword}
    onLogin={handleLogin} onSwitchMode={() => setView('register')}
    message={message} isError={isError} />;

  if (view === 'home')       return <Home user={user} onNavigate={setView} onLogout={handleLogout} />;

  if (view === 'profile')    return <Profile user={user} onBack={() => setView('home')}
    onProfileUpdate={handleProfileUpdate} />;

  if (view === 'publish_offer')   return <PublishTrip tripForm={tripForm}
    onInputChange={handleInputChange} onLocationChange={handleLocationChange}
    onSubmit={handlePublishOffer} onBack={() => setView('home')}
    message={message} isError={isError} />;
  if (view === 'publish_request') return <PublishRequest tripForm={tripForm}
    onInputChange={handleInputChange} onLocationChange={handleLocationChange}
    onSubmit={handlePublishRequest} onBack={() => setView('home')}
    message={message} isError={isError} />;
  if (view === 'browse')          return <TripList trips={trips} currentEmail={user?.email}
    onConnect={handleConnect} onDelete={handleDeleteTrip} onBack={() => setView('home')} />;
  if (view === 'connections')     return <Connections connections={connections} currentEmail={user?.email}
    onDelete={handleDeleteConnection} onBack={() => setView('home')} />;

  if (view === 'publish_carry')   return <PublishProduct mode="carry" tripForm={tripForm}
    onInputChange={handleInputChange} onLocationChange={handleLocationChange}
    onSubmit={(e) => handlePublishProduct(e, 'carry')}
    onBack={() => setView('home')} message={message} isError={isError} />;
  if (view === 'publish_send')    return <PublishProduct mode="send" tripForm={tripForm}
    onInputChange={handleInputChange} onLocationChange={handleLocationChange}
    onSubmit={(e) => handlePublishProduct(e, 'send')}
    onBack={() => setView('home')} message={message} isError={isError} />;
  if (view === 'browse_products') return <ProductList products={products} currentEmail={user?.email}
    onConnect={handleConnectProduct} onDelete={handleDeleteProduct} onBack={() => setView('home')} />;
  if (view === 'product_connections') return <Connections connections={productConns} currentEmail={user?.email}
    onDelete={handleDeleteProductConn} onBack={() => setView('home')} />;
  if (view === 'my_publications') return <MyPublications user={user} onBack={() => setView('home')} />; 
  if (view === 'login-error') return <div style={{ textAlign: 'center', padding: '40px', color: '#ef4444' }}><h2>Error al iniciar sesion</h2><button onClick={() => setView('login')} style={{ marginTop: '16px', cursor: 'pointer' }}>Volver al login</button></div>;
if (view === 'not-found') return <NotFound onNavigate={setView} />;
}