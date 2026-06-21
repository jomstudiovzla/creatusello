import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import OrdersTab from './components/orders_tab';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('orders');
  const isAdminLoggedIn = useStore(state => state.isAdminLoggedIn);
  const setAdminStatus = useStore(state => state.setAdminStatus);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdminLoggedIn) {
      navigate('/mi-negocio-admin');
    }
  }, [isAdminLoggedIn, navigate]);

  if (!isAdminLoggedIn) return null;

  return (
    <main className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-surface-canvas border-r border-outline-variant flex flex-col pt-20 h-screen sticky top-0">
        <div className="px-6 pb-6 border-b border-outline-variant">
          <h1 className="font-display-lg text-xl font-bold text-primary">Panel Admin</h1>
          <p className="text-xs text-success-green flex items-center gap-1 mt-1 font-bold">
            <span className="w-2 h-2 bg-success-green rounded-full"></span> Conectado (Firebase)
          </p>
        </div>
        
        <nav className="flex-grow py-6 flex flex-col gap-2 px-4">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'dashboard' ? 'bg-primary/10 text-primary' : 'text-text-secondary hover:bg-surface-container'}`}
          >
            <span className="material-symbols-outlined">dashboard</span> Resumen
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'orders' ? 'bg-primary/10 text-primary' : 'text-text-secondary hover:bg-surface-container'}`}
          >
            <span className="material-symbols-outlined">receipt_long</span> Pedidos en Espera
          </button>
          <button 
            onClick={() => {
              setActiveTab('inventory');
              navigate('/admin/inventory');
            }}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'inventory' ? 'bg-primary/10 text-primary' : 'text-text-secondary hover:bg-surface-container'}`}
          >
            <span className="material-symbols-outlined">inventory_2</span> Inventario
          </button>
          <button 
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold text-text-secondary opacity-50 cursor-not-allowed"
          >
            <span className="material-symbols-outlined">flash_on</span> Ofertas Relámpago
          </button>
          <button 
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold text-text-secondary opacity-50 cursor-not-allowed"
          >
            <span className="material-symbols-outlined">group</span> CRM Clientes
          </button>
        </nav>

        <div className="p-4 border-t border-outline-variant">
          <button 
            onClick={() => setAdminStatus(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold text-error hover:bg-error/10 transition-all w-full"
          >
            <span className="material-symbols-outlined">logout</span> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <section className="flex-grow p-10 pt-24 overflow-y-auto h-screen">
        {activeTab === 'orders' && <OrdersTab />}
        {activeTab === 'dashboard' && (
           <div className="bg-white p-12 text-center rounded-xl border border-outline-variant shadow-sm">
              <span className="material-symbols-outlined text-6xl text-outline mb-4">monitoring</span>
              <p className="text-text-secondary">Pestaña en construcción</p>
            </div>
        )}
      </section>
    </main>
  );
}
