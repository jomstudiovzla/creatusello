import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { initRealtimeNotifications, stopRealtimeNotifications } from './infrastructure/notifications/realtimeListener';
import toast from 'react-hot-toast';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './lib/firebase';
import { useStore, type Currency } from './store/useStore';
import { useBcvRate } from './shared/api/useBcvRate';
import logoCreaTuSello from './assets/logo-crea-tu-sello.svg';
import HomePage from './pages/home_page';
import AuthLogin from './pages/auth_login';
import ContactPage from './pages/contact_page';
import ProductCustomizer from './pages/product_customizer';
import InventoryManager from './pages/inventory_manager';
import OrdersPanel from './pages/orders_panel';
import CheckoutPage from './features/checkout/CheckoutPage';
import AdminLogin from './pages/admin/admin_login';
import AdminDashboard from './pages/admin/admin_dashboard';
import ProfilePage from './pages/profile_page';
import TermsPage from './pages/terms_page';
import PrivacyPage from './pages/privacy_page';
import ReturnsPage from './pages/returns_page';
import OrderSuccessPage from './pages/order_success_page';
import CartDrawer from './components/CartDrawer';
import AdminRoute from './components/AdminRoute';

function Navigation() {
  const { user, currency, setCurrency, setUser, cart, exchangeRates, openCart } = useStore();
  const [showProfile, setShowProfile] = useState(false);
  const [showCurrency, setShowCurrency] = useState(false);
  const navigate = useNavigate();

  // Mount the global BCV rate listener
  useBcvRate();

  const [unreadOrders, setUnreadOrders] = useState(0);

  useEffect(() => {
    if (user?.rol === 'admin') {
      initRealtimeNotifications((order) => {
        toast.success(`¡Nuevo pedido de ${order.customerName || 'Cliente'}!`, {
          icon: '🔔',
          duration: 6000,
          style: { border: '1px solid #1A237E', padding: '16px', color: '#1A237E', fontWeight: 'bold' }
        });
        setUnreadOrders(prev => prev + 1);
      });
    } else {
      stopRealtimeNotifications();
    }
    return () => stopRealtimeNotifications();
  }, [user]);

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setShowProfile(false);
    navigate('/');
  };

  const handleCurrencyChange = (c: Currency) => {
    setCurrency(c);
    setShowCurrency(false);
  };

  const vesPerEur = exchangeRates['VES'] || 0;
  const vesPerUsd = exchangeRates['USD'] ? vesPerEur / exchangeRates['USD'] : 0;

  return (
    <>
    <div className="bg-primary text-white text-xs md:text-sm py-2 px-4 text-center font-bold flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 z-50 relative">
      <span>⚠️ Precios sujetos a la tasa oficial del Banco Central de Venezuela (BCV).</span>
      <div className="flex gap-2">
        {vesPerUsd > 0 && <span className="bg-white/20 px-3 py-1 rounded-full">Bs. {vesPerUsd.toFixed(2)} / USD</span>}
        {vesPerEur > 0 && <span className="bg-white/20 px-3 py-1 rounded-full">Bs. {vesPerEur.toFixed(2)} / EUR</span>}
      </div>
    </div>
    <header className="bg-surface-canvas shadow-[0px_4px_20px_rgba(0,0,0,0.04)] h-20 sticky top-0 z-50">
      <nav className="flex justify-between items-center w-full px-4 md:px-10 max-w-[1280px] mx-auto h-full">
        <Link to="/" className="flex items-center"><img src={logoCreaTuSello} alt="Crea tu Sello" className="h-12" /></Link>
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="font-title-md text-on-surface-variant hover:text-secondary transition-colors duration-200">Home</Link>
          <Link to="/customizer" className="font-title-md text-secondary border-b-2 border-secondary pb-1">Catálogo</Link>
          <Link to="/contact" className="font-title-md text-on-surface-variant hover:text-secondary transition-colors duration-200">Contacto</Link>
          {user?.rol === 'admin' && (
            <Link to="/admin/dashboard" className="font-title-md text-on-surface-variant hover:text-secondary transition-colors duration-200">Admin</Link>
          )}
        </div>
        <div className="flex items-center gap-4 md:gap-6 relative">
          
          <div className="relative">
            <button onClick={() => setShowCurrency(!showCurrency)} className="flex items-center gap-1 text-on-surface-variant hover:text-primary font-bold bg-surface-container px-3 py-1.5 rounded-full text-sm transition-colors">
              <span className="material-symbols-outlined text-[18px]">currency_exchange</span> {currency}
            </button>
            {showCurrency && (
              <div className="absolute top-10 right-0 bg-white border border-outline shadow-xl rounded-xl py-2 w-32 flex flex-col z-[100]">
                <button onClick={() => handleCurrencyChange('VES')} className="px-4 py-2 text-left hover:bg-surface-container-low text-sm font-bold">🇻🇪 VES (Bs)</button>
                <button onClick={() => handleCurrencyChange('USD')} className="px-4 py-2 text-left hover:bg-surface-container-low text-sm font-bold">🇺🇸 USD ($)</button>
                <button onClick={() => handleCurrencyChange('EUR')} className="px-4 py-2 text-left hover:bg-surface-container-low text-sm font-bold">🇪🇺 EUR (€)</button>
              </div>
            )}
          </div>

          <button onClick={openCart} className="relative flex items-center bg-transparent border-none outline-none">
            <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary transition-colors">shopping_cart</span>
            {cart.length > 0 && <span className="absolute -top-2 -right-2 bg-error text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{cart.length}</span>}
          </button>
          
          {user?.rol === 'admin' && (
            <button onClick={() => navigate('/admin/dashboard')} className="relative flex items-center bg-transparent border-none outline-none ml-2">
              <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary transition-colors">notifications</span>
              {unreadOrders > 0 && <span className="absolute -top-2 -right-2 bg-vibrant-orange text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{unreadOrders}</span>}
            </button>
          )}
          
          {user ? (
            <div className="relative">
              <button onClick={() => setShowProfile(!showProfile)} className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-bold hover:bg-primary/20 transition-colors border border-primary/20">
                {user.email ? user.email[0].toUpperCase() : 'U'}
              </button>
              {showProfile && (
                <div className="absolute top-12 right-0 bg-white border border-outline shadow-2xl rounded-xl py-2 w-48 flex flex-col z-[100]">
                  <div className="px-4 py-2 border-b border-outline-variant text-xs text-text-secondary truncate">{user.email}</div>
                  <Link to="/profile" onClick={() => setShowProfile(false)} className="px-4 py-3 text-left hover:bg-surface-container-low flex items-center gap-2 text-primary font-bold text-sm"><span className="material-symbols-outlined text-[18px]">person</span> Mi Perfil</Link>
                  {user.rol === 'admin' && (
                    <Link to="/admin/dashboard" onClick={() => setShowProfile(false)} className="px-4 py-3 text-left hover:bg-surface-container-low flex items-center gap-2 text-primary font-bold text-sm"><span className="material-symbols-outlined text-[18px]">admin_panel_settings</span> Panel Administrativo</Link>
                  )}
                  <button onClick={handleLogout} className="px-4 py-3 text-left hover:bg-error/10 text-error flex items-center gap-2 font-bold text-sm"><span className="material-symbols-outlined text-[18px]">logout</span> Cerrar Sesión</button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="bg-primary text-white px-6 py-2 rounded-lg font-bold hover:opacity-90 transition-all text-sm">Login</Link>
          )}
        </div>
      </nav>
    </header>
    </>
  );
}

function Footer() {
  return (
    <footer className="bg-[#ffffff] border-t border-outline-variant py-12 px-10 w-full mt-auto">
      <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row justify-between items-start gap-8">
        <div className="flex flex-col gap-4 max-w-sm">
          <span className="font-title-md text-primary font-bold">Crea tu Sello</span>
          <p className="text-on-surface-variant font-body-md text-sm leading-relaxed">
            Especialistas en sellos automáticos. Calidad industrial, precisión y tiempos de entrega insuperables.
          </p>
          <div className="bg-error/10 border border-error/20 p-4 rounded-xl mt-2">
            <p className="text-error text-xs font-bold flex items-start gap-2">
              <span className="material-symbols-outlined text-[16px] shrink-0">gpp_maybe</span>
              Aviso de Seguridad Antifraude:
            </p>
            <p className="text-on-surface-variant text-[11px] mt-1 leading-tight">
              Solo te contactaremos desde nuestro WhatsApp oficial. <strong>No almacenamos, procesamos ni solicitamos datos de tus Tarjetas de Crédito.</strong> Todo pago es mediante pasarelas oficiales.
            </p>
          </div>
          <p className="text-on-surface-variant font-body-md text-sm mt-4">© 2024 Crea tu Sello. All rights reserved.</p>
        </div>
        
        <div className="flex flex-col gap-4">
          <h4 className="font-bold text-on-surface">Legal</h4>
          <div className="flex flex-col gap-3 text-on-surface-variant font-body-md text-sm">
            <Link className="hover:text-secondary transition-colors flex items-center gap-2" to="/terms">
              <span className="material-symbols-outlined text-[16px]">gavel</span> Términos y Condiciones
            </Link>
            <Link className="hover:text-secondary transition-colors flex items-center gap-2" to="/privacy">
              <span className="material-symbols-outlined text-[16px]">privacy_tip</span> Políticas de Privacidad
            </Link>
            <Link className="hover:text-secondary transition-colors flex items-center gap-2" to="/returns">
              <span className="material-symbols-outlined text-[16px]">published_with_changes</span> Políticas de Devolución
            </Link>
          </div>
        </div>
        
        <div className="flex flex-col gap-4">
          <h4 className="font-bold text-on-surface">Contacto Directo</h4>
          <div className="flex gap-4">
          <a href="https://wa.me/584142461548" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-[#25D366]/10 flex items-center justify-center cursor-pointer hover:bg-[#25D366]/20 transition-colors" title="WhatsApp">
            <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" className="w-5 h-5" />
          </a>
          <a href="https://www.instagram.com/creatusello.com.ve/" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-[#E1306C]/10 flex items-center justify-center cursor-pointer hover:bg-[#E1306C]/20 transition-colors" title="Instagram">
            <img src="https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg" alt="Instagram" className="w-5 h-5" />
          </a>
          <a href="mailto:contacto@creatusello.com" className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center cursor-pointer hover:bg-[#b6c4ff] transition-colors" title="Correo">
            <span className="material-symbols-outlined text-primary">mail</span>
          </a>
        </div>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  const { setUser, setAuthInitialized, setExchangeRates } = useStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          let rol = 'user';
          if (userDoc.exists()) {
            rol = userDoc.data().rol || 'user';
          }
          // Hardcode for the CEO
          if (firebaseUser.email === 'admin@jomstudio.com') {
            rol = 'admin';
          }
          setUser({ uid: firebaseUser.uid, email: firebaseUser.email, rol });
        } catch (err) {
          console.error("Error obteniendo rol:", err);
          let fallbackRol = firebaseUser.email === 'admin@jomstudio.com' ? 'admin' : 'user';
          setUser({ uid: firebaseUser.uid, email: firebaseUser.email, rol: fallbackRol });
        }
      } else {
        setUser(null);
      }
      setAuthInitialized(true);
    });

    const fetchRates = async () => {
      try {
        const rateDoc = await getDoc(doc(db, 'settings', 'rates'));
        if (rateDoc.exists()) {
          const data = rateDoc.data();
          if (data.VES) {
            setExchangeRates({ 
              EUR: 1, 
              USD: data.EUR / data.VES, 
              VES: data.VES 
            });
            return;
          }
        }
      } catch (e) {
        console.log("No se pudo obtener la tasa desde Firebase, usando respaldo DolarAPI", e);
      }

      try {
        const usdRes = await fetch('https://ve.dolarapi.com/v1/dolares/oficial');
        const usdData = await usdRes.json();
        const eurRes = await fetch('https://ve.dolarapi.com/v1/euros');
        const eurData = await eurRes.json();
        
        const eurRate = Array.isArray(eurData) ? eurData[0]?.promedio : eurData?.promedio;
        const usdRate = Array.isArray(usdData) ? usdData[0]?.promedio : usdData?.promedio;
        
        if (usdRate && eurRate) {
           setExchangeRates({ 
             EUR: 1, 
             USD: eurRate / usdRate, 
             VES: eurRate 
           });
        }
      } catch (err) {
        console.error("Error fetching rates, using fallback:", err);
      }
    };
    
    fetchRates();

    return () => unsubscribe();
  }, []);

  return (
    <Router basename="/creatusello">
      <Toaster position="top-right" />
      <div className="bg-background text-on-surface font-body-md min-h-screen flex flex-col">
        <Navigation />
        <CartDrawer />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/customizer" element={<ProductCustomizer />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/success" element={<OrderSuccessPage />} />
          <Route path="/login" element={<AuthLogin />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/mi-negocio-admin" element={<AdminLogin />} />
          <Route element={<AdminRoute />}>
            <Route path="/admin/inventory" element={<InventoryManager />} />
            <Route path="/admin/orders" element={<OrdersPanel />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Route>
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/returns" element={<ReturnsPage />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
