import { useEffect, useState } from 'react';
import { db } from '../../../lib/firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, getDoc } from 'firebase/firestore';

export default function OrdersTab() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'pedidos'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setOrders(ordersData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string, currentOrder: any) => {
    try {
      const orderRef = doc(db, 'pedidos', orderId);
      
      // Restaurar inventario si se cancela el pedido
      if (newStatus === 'Cancelado' && currentOrder.status !== 'Cancelado') {
        if (currentOrder.items && currentOrder.items.length > 0) {
          for (const item of currentOrder.items) {
            const productRef = doc(db, 'products', item.productId);
            const snap = await getDoc(productRef);
            if (snap.exists()) {
              const currentStock = snap.data().stock || 0;
              await updateDoc(productRef, { stock: currentStock + (item.quantity || 1) });
            }
          }
        }
      }
      
      await updateDoc(orderRef, { status: newStatus });
    } catch (error) {
      console.error("Error updating status: ", error);
      alert("No se pudo actualizar el estado.");
    }
  };

  if (loading) {
    return <div className="p-8 flex justify-center"><span className="material-symbols-outlined animate-spin text-4xl text-primary">refresh</span></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-primary">Pedidos en Espera</h2>
        <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-bold text-sm">
          {orders.length} pedidos
        </span>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-xl border border-outline-variant shadow-sm">
          <span className="material-symbols-outlined text-6xl text-outline mb-4">inbox</span>
          <p className="text-text-secondary">No hay pedidos recientes.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {orders.map(order => (
            <div key={order.id} className="bg-white rounded-xl shadow-sm border border-outline-variant overflow-hidden">
              <div className="bg-surface-container-low p-4 border-b border-outline-variant flex justify-between items-center flex-wrap gap-4">
                <div>
                  <span className="text-xs text-text-secondary uppercase tracking-widest font-bold">Orden #{order.id.slice(0, 8)}</span>
                  <p className="font-bold text-primary">{order.customerInfo?.name || order.customerName || order.userEmail || 'Cliente Anónimo'}</p>
                  <p className="text-sm text-text-secondary">{order.customerInfo?.email} | {order.customerInfo?.phone}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-xs text-text-secondary block">Total Estimado</span>
                    <span className="font-bold text-vibrant-teal text-lg">
                      {order.currency === 'USD' ? '$' : '€'}{order.subtotalBase?.toFixed(2) || order.total?.toFixed(2) || '0.00'}
                    </span>
                  </div>
                  <select 
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value, order)}
                    className={`font-bold text-sm p-2 rounded-lg border-2 ${
                      order.status === 'Facturado' ? 'bg-success-green/10 text-success-green border-success-green/30' :
                      order.status === 'Procesando' ? 'bg-vibrant-blue/10 text-vibrant-blue border-vibrant-blue/30' :
                      order.status === 'Cancelado' ? 'bg-error/10 text-error border-error/30' :
                      'bg-vibrant-orange/10 text-vibrant-orange border-vibrant-orange/30'
                    }`}
                  >
                    <option value="PENDING">PENDING (En revisión)</option>
                    <option value="Procesando">Procesando</option>
                    <option value="Facturado">Facturado</option>
                    <option value="Cancelado">Cancelado</option>
                  </select>
                </div>
              </div>
              
              <div className="p-6">
                <h4 className="text-sm font-bold text-on-surface-variant mb-4 uppercase tracking-wider">Artículos ({order.items?.length || 0})</h4>
                <div className="space-y-4">
                  {order.items?.map((item: any, idx: number) => (
                    <div key={idx} className="flex flex-col md:flex-row gap-4 justify-between border border-outline-variant rounded-lg p-4 bg-surface-canvas">
                      <div>
                        <p className="font-bold text-primary">{item.productName || item.model?.type || 'Personalizado'} x{item.quantity || 1}</p>
                        <p className="text-sm text-text-secondary mt-1">Texto: <span className="italic">"{item.customText || item.text || 'Sin texto'}"</span></p>
                        <p className="text-sm text-text-secondary mt-1">Tipografía: <span className="font-bold">{item.fontFamily || 'Predeterminada'}</span></p>
                        {order.notes && <p className="text-sm text-text-secondary mt-2"><b>Notas del cliente:</b> {order.notes}</p>}
                        
                        <p className="text-xs text-text-secondary mt-2">
                          <b>Entrega:</b> {order.deliveryMethod === 'DELIVERY' ? `Delivery a ${order.deliveryDetails?.city || ''}` : `Retiro en ${order.pickupDetails?.branch || 'Tienda'}`}
                        </p>
                      </div>
                      <div className="flex flex-col md:flex-row gap-2 items-start mt-4">
                        {item.logoUrl || item.logoFileUrl ? (
                          <a 
                            href={item.logoUrl || item.logoFileUrl} 
                            download={`logo_orden_${order.id.slice(0,8)}.png`}
                            target="_blank" 
                            rel="noreferrer"
                            className="bg-vibrant-teal text-white px-4 py-2 rounded font-bold text-sm flex items-center gap-2 hover:bg-vibrant-teal/90 transition-colors shadow-sm"
                          >
                            <span className="material-symbols-outlined text-sm">download</span>
                            Descargar Logo
                          </a>
                        ) : (
                          <span className="bg-surface-container text-text-secondary px-4 py-2 rounded font-bold text-sm flex items-center gap-2 border border-outline-variant">
                            <span className="material-symbols-outlined text-sm">hide_image</span>
                            Sin Logo
                          </span>
                        )}

                        {item.fontUrl ? (
                          <a 
                            href={item.fontUrl} 
                            download={`fuente_${item.fontFamily}.ttf`}
                            target="_blank" 
                            rel="noreferrer"
                            className="bg-primary text-white px-4 py-2 rounded font-bold text-sm flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-sm"
                          >
                            <span className="material-symbols-outlined text-sm">download</span>
                            Descargar Tipografía
                          </a>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
