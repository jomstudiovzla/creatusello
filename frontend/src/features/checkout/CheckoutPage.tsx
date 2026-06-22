import React, { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { useNavigate } from 'react-router-dom';
import { db } from '../../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { ordersApi } from '../../shared/api/firebaseRepository';
import { customerInfoSchema, deliveryDetailsSchema, pickupDetailsSchema } from '../../entities/order/schemas';
import { z } from 'zod';
import { processAtomicOrder } from '../../features/checkout/model/processOrder';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const { cart, exchangeRates, clearCart, currency, user } = useStore();
  const navigate = useNavigate();
  
  const [method, setMethod] = useState<'DELIVERY' | 'PICKUP'>('DELIVERY');
  const [customer, setCustomer] = useState({ name: '', cedula: '', phone: '', email: user?.email || '' });
  const [delivery, setDelivery] = useState({ address: '', reference: '', city: '', date: '', time: '' });
  const [pickup, setPickup] = useState({ branch: 'Sede Principal (Caracas)', date: '', time: '' });
  const [notes, setNotes] = useState('');
  
  useEffect(() => {
    if (user?.uid) {
      getDoc(doc(db, 'users', user.uid)).then(snap => {
        if (snap.exists()) {
          const data = snap.data();
          setCustomer(prev => ({
            ...prev,
            name: data.name || prev.name,
            cedula: data.cedula || prev.cedula,
            phone: data.phone || prev.phone,
            email: user.email || prev.email,
          }));
        }
      }).catch(err => console.error("Error auto-filling profile:", err));
    }
  }, [user]);

  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotalBase = cart.reduce((acc, item) => acc + (item.model.price * item.quantity), 0);
  const vesPerUsd = exchangeRates['VES'] && exchangeRates['USD'] ? exchangeRates['VES'] / exchangeRates['USD'] : 0;
  const totalVes = subtotalBase * vesPerUsd;

  const getDisplayPrice = (eurPrice: number) => {
    switch (currency) {
      case 'USD': return `$${(eurPrice * exchangeRates.USD).toFixed(2)}`;
      case 'VES': return `Bs. ${(eurPrice * exchangeRates.VES).toFixed(2)}`;
      default: return `€${eurPrice.toFixed(2)}`;
    }
  };

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-80px)]">
        <h2 className="text-2xl font-bold">Tu carrito está vacío</h2>
        <button onClick={() => navigate('/customizer')} className="mt-4 bg-primary text-white px-6 py-2 rounded-full">
          Volver al catálogo
        </button>
      </div>
    );
  }

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    
    try {
      customerInfoSchema.parse(customer);
      if (method === 'DELIVERY') deliveryDetailsSchema.parse(delivery);
      if (method === 'PICKUP') pickupDetailsSchema.parse(pickup);
      
      setIsSubmitting(true);
      
      const orderData = {
        customerInfo: customer,
        deliveryMethod: method,
        deliveryDetails: method === 'DELIVERY' ? delivery : null,
        pickupDetails: method === 'PICKUP' ? pickup : null,
        items: cart.map(item => ({
          productId: item.model.id,
          productName: item.model.name || item.model.type,
          quantity: item.quantity,
          unitPrice: item.model.price,
          subtotal: item.model.price * item.quantity,
          customText: item.text,
          logoUrl: item.logoDataUrl || item.model.imgUrl
        })),
        subtotalBase,
        totalVes,
        bcvRateAtPurchase: vesPerUsd,
        status: 'PENDING' as const,
        notes,
        // Added for FSD compatibility:
        total: totalVes,
        customerName: customer.name,
        customerEmail: customer.email,
      };
      
      const result = await processAtomicOrder(orderData as any);
      
      if (!result.success) {
        throw new Error(result.error || "Error en transacción atómica");
      }
      
      toast.success("¡Pedido confirmado con éxito! Redirigiendo...", { duration: 4000 });
      clearCart();
      navigate('/success');
      
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        const zodErr = err as any;
        const msgs = zodErr.errors.map((e: z.ZodIssue) => e.message);
        setErrors(msgs);
        toast.error("Por favor, corrige los errores en el formulario.");
      } else {
        const msg = err.message || "Hubo un error al procesar tu pedido. Intenta nuevamente.";
        setErrors([msg]);
        toast.error(msg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 min-h-[calc(100vh-80px)]">
      <h1 className="text-3xl font-bold text-primary mb-8 border-b pb-4">Finalizar Compra</h1>
      
      {errors.length > 0 && (
        <div className="bg-error/10 text-error p-4 rounded-xl mb-6 border border-error/20">
          <ul className="list-disc pl-5">
            {errors.map((e, i) => <li key={i} className="font-semibold">{e}</li>)}
          </ul>
        </div>
      )}

      <form onSubmit={handleCheckout} id="checkout-form" className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-8">
          {/* Customer Info */}
          <section className="bg-white p-6 rounded-xl border border-surface-container shadow-sm">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">person</span> Datos del Cliente
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-1">Nombre Completo</label>
                <input value={customer.name} onChange={e => setCustomer({...customer, name: e.target.value})} className="w-full p-3 border rounded-lg" placeholder="Ej. Juan Pérez" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Cédula o RIF</label>
                <input value={customer.cedula} onChange={e => setCustomer({...customer, cedula: e.target.value})} className="w-full p-3 border rounded-lg" placeholder="Ej. V-12345678" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Teléfono</label>
                <input value={customer.phone} onChange={e => setCustomer({...customer, phone: e.target.value})} className="w-full p-3 border rounded-lg" placeholder="Ej. 0414 123 4567" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Correo Electrónico</label>
                <input type="email" value={customer.email} onChange={e => setCustomer({...customer, email: e.target.value})} className="w-full p-3 border rounded-lg" placeholder="ejemplo@correo.com" />
              </div>
            </div>
          </section>

          {/* Delivery Method */}
          <section className="bg-white p-6 rounded-xl border border-surface-container shadow-sm">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">local_shipping</span> Método de Entrega
            </h2>
            <div className="flex gap-4 mb-6">
              <label className={`flex-1 p-4 border rounded-xl cursor-pointer transition-all ${method === 'DELIVERY' ? 'border-primary bg-primary/5 ring-2 ring-primary/20' : 'hover:bg-surface-bright'}`}>
                <input type="radio" name="method" checked={method === 'DELIVERY'} onChange={() => setMethod('DELIVERY')} className="hidden" />
                <div className="text-center font-bold">Delivery</div>
              </label>
              <label className={`flex-1 p-4 border rounded-xl cursor-pointer transition-all ${method === 'PICKUP' ? 'border-primary bg-primary/5 ring-2 ring-primary/20' : 'hover:bg-surface-bright'}`}>
                <input type="radio" name="method" checked={method === 'PICKUP'} onChange={() => setMethod('PICKUP')} className="hidden" />
                <div className="text-center font-bold">Retiro en Tienda</div>
              </label>
            </div>

            {method === 'DELIVERY' ? (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                <div>
                  <label className="block text-sm font-bold mb-1">Ciudad</label>
                  <input value={delivery.city} onChange={e => setDelivery({...delivery, city: e.target.value})} className="w-full p-3 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Dirección Exacta</label>
                  <textarea value={delivery.address} onChange={e => setDelivery({...delivery, address: e.target.value})} className="w-full p-3 border rounded-lg resize-none" rows={2} />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Punto de Referencia</label>
                  <input value={delivery.reference} onChange={e => setDelivery({...delivery, reference: e.target.value})} className="w-full p-3 border rounded-lg" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold mb-1">Fecha</label>
                    <input type="date" value={delivery.date} onChange={e => setDelivery({...delivery, date: e.target.value})} className="w-full p-3 border rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-1">Hora aprox.</label>
                    <input type="time" value={delivery.time} onChange={e => setDelivery({...delivery, time: e.target.value})} className="w-full p-3 border rounded-lg" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                <div>
                  <label className="block text-sm font-bold mb-1">Sucursal</label>
                  <select value={pickup.branch} onChange={e => setPickup({...pickup, branch: e.target.value})} className="w-full p-3 border rounded-lg">
                    <option>Sede Principal (Caracas)</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold mb-1">Fecha de Retiro</label>
                    <input type="date" value={pickup.date} onChange={e => setPickup({...pickup, date: e.target.value})} className="w-full p-3 border rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-1">Hora aprox.</label>
                    <input type="time" value={pickup.time} onChange={e => setPickup({...pickup, time: e.target.value})} className="w-full p-3 border rounded-lg" />
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Notes */}
          <section className="bg-white p-6 rounded-xl border border-surface-container shadow-sm">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">notes</span> Notas Adicionales
            </h2>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} className="w-full p-3 border rounded-lg resize-none" rows={3} placeholder="Instrucciones especiales para el diseño o entrega..." />
          </section>
        </div>

        {/* Order Summary Sidebar */}
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant h-fit sticky top-28 shadow-xl">
          <h2 className="text-2xl font-bold text-primary mb-6">Resumen del Pedido</h2>
          
          <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center gap-4 border-b pb-4">
                <div className="w-16 h-16 bg-white rounded-lg p-1 border">
                  <img src={item.logoDataUrl || item.model.imgUrl} className="w-full h-full object-contain" alt="" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm line-clamp-1">{item.model.name || item.model.type}</p>
                  <p className="text-xs text-text-secondary">Cant: {item.quantity}</p>
                </div>
                <p className="font-bold">{getDisplayPrice(item.model.price * item.quantity)}</p>
              </div>
            ))}
          </div>

          <div className="space-y-3 pt-4 border-t border-outline-variant text-sm">
            <div className="flex justify-between text-on-surface-variant">
              <span>Subtotal</span>
              <span>{getDisplayPrice(subtotalBase)}</span>
            </div>
            <div className="flex justify-between text-on-surface-variant">
              <span>Tasa BCV Aplicada</span>
              <span>Bs. {vesPerUsd.toFixed(2)} / USD</span>
            </div>
            <div className="flex justify-between text-2xl font-bold text-primary pt-2 border-t mt-2">
              <span>Total Estimado</span>
              <span>{getDisplayPrice(subtotalBase)}</span>
            </div>
          </div>

          <button 
            type="submit" 
            form="checkout-form"
            disabled={isSubmitting}
            className="w-full mt-8 bg-vibrant-orange text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 active:translate-y-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? 'Procesando...' : 'Confirmar Pedido'}
            {!isSubmitting && <span className="material-symbols-outlined">check_circle</span>}
          </button>
          
          <p className="text-xs text-center text-on-surface-variant mt-4 flex items-center justify-center gap-1">
            <span className="material-symbols-outlined text-[14px]">lock</span> Pago seguro y cifrado end-to-end
          </p>
        </div>
      </form>
    </div>
  );
}
