import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';

export default function ProfilePage() {
  const { user } = useStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    cedula: '',
    phone: '',
    photoURL: ''
  });
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchProfileAndOrders = async () => {
      try {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData({
            name: data.name || (user as any).displayName || '',
            cedula: data.cedula || '',
            phone: data.phone || '',
            photoURL: data.photoURL || (user as any).photoURL || ''
          });
        } else {
          setFormData({
            name: (user as any).displayName || '',
            cedula: '',
            phone: '',
            photoURL: (user as any).photoURL || ''
          });
        }
      } catch (err) {
        console.error('Error fetching profile', err);
      } finally {
        setLoading(false);
      }

      try {
        // Buscar pedidos por el email del usuario (ya que en checkout se guarda customerEmail o customerInfo.email)
        if (user.email) {
          const q1 = query(collection(db, 'pedidos'), where('customerEmail', '==', user.email));
          const q2 = query(collection(db, 'pedidos'), where('customerInfo.email', '==', user.email));
          
          const [snap1, snap2] = await Promise.all([getDocs(q1), getDocs(q2)]);
          const allOrders = new Map();
          
          snap1.docs.forEach(d => allOrders.set(d.id, { id: d.id, ...d.data() }));
          snap2.docs.forEach(d => allOrders.set(d.id, { id: d.id, ...d.data() }));
          
          const sortedOrders = Array.from(allOrders.values()).sort((a: any, b: any) => {
            return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
          });
          
          setOrders(sortedOrders);
        }
      } catch (err) {
        console.error('Error fetching orders history', err);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchProfileAndOrders();
  }, [user, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      await setDoc(doc(db, 'users', user.uid), formData, { merge: true });
      alert('Perfil guardado exitosamente');
    } catch (err) {
      console.error('Error saving profile', err);
      alert('Error al guardar el perfil');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="pt-32 text-center text-primary">Cargando perfil...</div>;

  return (
    <main className="pt-32 pb-20 px-4 md:px-10 max-w-[800px] mx-auto flex-grow w-full">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-surface-container">
        <div className="flex items-center gap-6 mb-8">
          {formData.photoURL ? (
            <img src={formData.photoURL} alt="Perfil" className="w-20 h-20 rounded-full object-cover border border-outline" />
          ) : (
            <div className="w-20 h-20 rounded-full bg-surface-container-low flex items-center justify-center border border-outline">
              <span className="material-symbols-outlined text-4xl text-outline">person</span>
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold text-primary">Mi Perfil</h1>
            <p className="text-text-secondary">{user?.email}</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-primary">Nombre Completo</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-3 border border-outline rounded-lg bg-white" placeholder="Ej. Juan Pérez" />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-bold text-primary">Cédula / ID</label>
              <input type="text" name="cedula" value={formData.cedula} onChange={handleChange} className="w-full p-3 border border-outline rounded-lg bg-white" placeholder="Ej. V-12345678" />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-bold text-primary">Teléfono (WhatsApp)</label>
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full p-3 border border-outline rounded-lg bg-white" placeholder="Ej. +58 414 1234567" />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-bold text-primary">URL de Foto (Opcional)</label>
              <input type="text" name="photoURL" value={formData.photoURL} onChange={handleChange} className="w-full p-3 border border-outline rounded-lg bg-white" placeholder="https://..." />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button type="submit" disabled={saving} className="bg-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-secondary transition-colors">
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>

      {/* HISTORIAL DE PEDIDOS */}
      <div className="mt-10 bg-white p-8 rounded-2xl shadow-sm border border-surface-container">
        <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined">receipt_long</span>
          Mi Historial de Pedidos
        </h2>

        {loadingOrders ? (
          <div className="text-center text-text-secondary py-8">Cargando historial...</div>
        ) : orders.length === 0 ? (
          <div className="text-center text-text-secondary py-8 bg-surface-container-low rounded-lg border border-outline-variant">
            <span className="material-symbols-outlined text-4xl mb-2 text-outline">shopping_bag</span>
            <p>No tienes pedidos registrados todavía.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="border border-outline-variant rounded-xl p-4 md:p-6 hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
                  <div>
                    <span className="text-xs font-bold text-text-secondary uppercase tracking-wider block mb-1">Orden #{order.id.slice(0,8)}</span>
                    <span className="text-sm text-text-secondary">{new Date(order.createdAt).toLocaleDateString('es-VE', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-lg text-primary">{order.currency === 'USD' ? '$' : '€'}{order.total?.toFixed(2) || order.totalVes?.toFixed(2) || '0.00'}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      order.status === 'Facturado' ? 'bg-success-green/10 text-success-green' :
                      order.status === 'Cancelado' ? 'bg-error/10 text-error' :
                      order.status === 'Procesando' ? 'bg-vibrant-blue/10 text-vibrant-blue' :
                      'bg-vibrant-orange/10 text-vibrant-orange'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
                
                <div className="bg-surface-container-low rounded-lg p-4">
                  <h4 className="text-sm font-bold text-primary mb-2">Artículos:</h4>
                  <ul className="space-y-2">
                    {order.items?.map((item: any, i: number) => (
                      <li key={i} className="flex justify-between text-sm">
                        <span>{item.quantity}x {item.productName || item.model?.type}</span>
                        <span className="text-text-secondary font-medium">Texto: "{item.customText || item.text}"</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
