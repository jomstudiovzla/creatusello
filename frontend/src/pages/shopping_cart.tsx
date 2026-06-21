import { useState } from 'react';
import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';
import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

export default function ShoppingCart() {
  const { cart, user, removeFromCart, updateQuantity, clearCart, currency, exchangeRates } = useStore();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const formatPrice = (baseEurPrice: number) => {
    const rate = exchangeRates[currency] || 1;
    const converted = baseEurPrice * rate;
    if (currency === 'VES') return `Bs. ${converted.toFixed(2)}`;
    if (currency === 'USD') return `$${converted.toFixed(2)}`;
    return `€${converted.toFixed(2)}`;
  };

  const subtotal = cart.reduce((acc, item) => acc + (item.model.price * item.quantity), 0);
  const taxes = subtotal * 0.21;
  const total = subtotal + taxes;

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleCheckout = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (cart.length === 0) return;

    setIsProcessing(true);
    try {
      // Usamos Base64 directamente en Firestore para evitar bloqueos de CORS en Firebase Storage
      const processedItems = await Promise.all(cart.map(async (item) => {
        let fontFileUrl = null;
        let logoFileUrl = item.logoDataUrl || null;

        if (item.fontFile) {
          try {
            fontFileUrl = await fileToBase64(item.fontFile);
          } catch(e) { console.error('Error reading font file', e); }
        }

        if (item.logoFile && !logoFileUrl) {
          try {
            logoFileUrl = await fileToBase64(item.logoFile);
          } catch(e) { console.error('Error reading logo file', e); }
        }

        return {
          model: item.model,
          text: item.text,
          fontFamily: item.fontFamily,
          quantity: item.quantity,
          fontFileUrl,
          logoFileUrl,
          price: item.model.price
        };
      }));

      const orderRef = await addDoc(collection(db, 'orders'), {
        userId: user.uid,
        userEmail: user.email,
        items: processedItems,
        subtotal,
        taxes,
        total,
        status: 'En revisión',
        createdAt: new Date()
      });

      console.log('Order created with ID: ', orderRef.id);
      alert('¡Tu pedido ha sido procesado con éxito!');
      clearCart();
      navigate('/'); // Go back to home or a success page

    } catch (error) {
      console.error('Error during checkout: ', error);
      alert('Hubo un error al procesar tu pedido. Por favor, intenta de nuevo.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main className="pt-32 pb-20 px-4 md:px-10 max-w-[1280px] mx-auto">
      <style>{`
        .stamp-shadow { box-shadow: 0px 10px 30px rgba(0,0,0,0.08); }
        .canvas-dot-grid { background-image: radial-gradient(#CBD5E1 1px, transparent 1px); background-size: 20px 20px; }
        .cart-item { opacity: 0; animation: slideIn 0.5s ease-out forwards; }
        @keyframes slideIn { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
      `}</style>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Detailed Shopping Cart List */}
        <div className="flex-grow space-y-6">
          <div className="flex items-center justify-between border-b border-outline-variant pb-4">
            <h1 className="font-headline-lg text-3xl font-bold text-primary">Tu Carrito</h1>
            <span className="text-base text-text-secondary">{cart.length} Artículos</span>
          </div>

          {cart.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-surface-container">
              <span className="material-symbols-outlined text-6xl text-outline mb-4">production_quantity_limits</span>
              <h2 className="text-xl font-bold text-primary">Tu carrito está vacío</h2>
              <p className="text-text-secondary mt-2 mb-6">Parece que aún no has diseñado ningún sello.</p>
              <button onClick={() => navigate('/customizer')} className="bg-vibrant-teal text-white px-6 py-3 rounded-lg font-bold">Ir al Configurador</button>
            </div>
          ) : (
            cart.map((item, index) => (
              <div key={item.id} className="cart-item bg-white rounded-xl p-6 shadow-sm border border-surface-container flex flex-col md:flex-row gap-6 transition-all hover:shadow-md" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="w-full md:w-48 h-48 bg-surface-container-low rounded-lg flex items-center justify-center relative canvas-dot-grid overflow-hidden">
                  <div className="stamp-shadow bg-white p-4 rounded border border-outline-variant flex flex-col items-center justify-center w-32 h-32 transform -rotate-3">
                    {item.logoDataUrl ? (
                       <img src={item.logoDataUrl} alt="logo preview" className="max-h-12 object-contain opacity-80" />
                    ) : (
                       <span className="font-bold text-primary text-xs uppercase tracking-widest border-b border-primary mb-1 text-center truncate w-full" style={{fontFamily: item.fontFamily}}>
                         {item.text || "Tu Diseño"}
                       </span>
                    )}
                  </div>
                  <span className="absolute bottom-2 right-2 bg-technical-gray/80 text-white px-2 py-0.5 rounded text-xs font-bold">{item.model.dim}</span>
                </div>
                <div className="flex-grow flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="font-title-md text-xl font-bold text-primary">Sello {item.model.type}</h3>
                      <button onClick={() => removeFromCart(item.id)} className="text-error hover:bg-error/10 p-2 rounded-full transition-all group">
                        <span className="material-symbols-outlined group-hover:scale-110">delete</span>
                      </button>
                    </div>
                    <p className="text-base text-on-surface-variant mt-1">Fuente: {item.fontFamily}</p>
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-xs text-text-secondary block uppercase tracking-wider">Texto Personalizado</span>
                        <span className="text-base italic text-on-surface truncate block w-full">{item.text || 'Sin texto'}</span>
                      </div>
                      <div>
                        <span className="text-xs text-text-secondary block uppercase tracking-wider">Archivos</span>
                        <div className="flex gap-2">
                          {item.fontFile && <span className="material-symbols-outlined text-vibrant-teal text-sm" title="Fuente Custom">font_download</span>}
                          {item.logoFile && <span className="material-symbols-outlined text-vibrant-teal text-sm" title="Logo Custom">image</span>}
                          {!item.fontFile && !item.logoFile && <span className="text-sm">Ninguno</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-end mt-6">
                    <div className="flex items-center border border-outline-variant rounded-lg overflow-hidden">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-3 py-1 hover:bg-vibrant-teal/10 hover:text-vibrant-teal transition-colors font-bold text-lg">-</button>
                      <span className="px-4 py-1 font-bold border-x border-outline-variant">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-3 py-1 hover:bg-vibrant-teal/10 hover:text-vibrant-teal transition-colors font-bold text-lg">+</button>
                    </div>
                    <div className="text-right">
                      <span className="font-headline-lg text-3xl font-bold text-vibrant-teal">{formatPrice(item.model.price * item.quantity)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}

        </div>

        {/* Summary Section */}
        <aside className="w-full lg:w-[360px] shrink-0">
          <div className="bg-white rounded-xl p-8 shadow-xl border-t-4 border-vibrant-purple sticky top-24">
            <h2 className="font-headline-lg text-3xl font-bold text-vibrant-purple mb-6">Resumen</h2>
            <div className="space-y-4 border-b border-outline-variant pb-6">
              <div className="flex justify-between text-base text-on-surface-variant">
                <span>Subtotal</span>
                <span className="font-semibold text-on-surface">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-base text-on-surface-variant">
                <span>Envío estimado</span>
                <span className="text-vibrant-teal font-bold uppercase tracking-wide">Gratis</span>
              </div>
              <div className="flex justify-between text-base text-on-surface-variant">
                <span>Impuestos (21% IVA)</span>
                <span>{formatPrice(taxes)}</span>
              </div>
            </div>
            <div className="py-6">
              <div className="flex justify-between items-end mb-8">
                <span className="font-title-md text-xl font-bold text-primary">Total</span>
                <div className="text-right">
                  <span className="block font-headline-lg text-3xl font-bold text-vibrant-purple drop-shadow-sm">{formatPrice(total)}</span>
                </div>
              </div>
              <div className="space-y-4">
                <button 
                  onClick={handleCheckout}
                  disabled={cart.length === 0 || isProcessing}
                  className="w-full bg-gradient-to-r from-vibrant-purple via-vibrant-blue to-vibrant-teal text-white py-4 rounded-xl font-bold text-xl shadow-lg hover:shadow-2xl hover:translate-y-[-4px] active:translate-y-[0px] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:pointer-events-none"
                >
                  {isProcessing ? 'Procesando...' : (
                    <>Finalizar Compra <span className="material-symbols-outlined">chevron_right</span></>
                  )}
                </button>
                <p className="text-center text-xs text-text-secondary flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-[14px]">lock</span>
                  Pago seguro garantizado
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
