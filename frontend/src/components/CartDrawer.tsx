import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';

const CartDrawer: React.FC = () => {
  const { cart, isCartOpen, closeCart, removeFromCart, updateQuantity, clearCart, currency, exchangeRates } = useStore();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = cart.reduce((acc, item) => acc + (item.model.price * item.quantity), 0);
  
  const getDisplayPrice = (eurPrice: number) => {
    switch (currency) {
      case 'USD': return `$${(eurPrice * exchangeRates.USD).toFixed(2)}`;
      case 'VES': return `Bs. ${(eurPrice * exchangeRates.VES).toFixed(2)}`;
      default: return `€${eurPrice.toFixed(2)}`;
    }
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setIsProcessing(true);
    
    try {
      const processedItems = await Promise.all(cart.map(async (item) => {
        return {
          id: item.id,
          modelName: item.model.name || item.model.type,
          quantity: item.quantity,
          price: item.model.price,
          unitPriceDisplay: getDisplayPrice(item.model.price),
          subtotalDisplay: getDisplayPrice(item.model.price * item.quantity),
          text: item.text,
          fontFamily: item.fontFamily
        };
      }));

      const totalDisplay = getDisplayPrice(subtotal);

      let message = `*¡Nuevo Pedido desde Crea Tu Sello!*\n\n`;
      message += `*🛒 Resumen del Pedido:*\n\n`;

      processedItems.forEach((item, index) => {
        message += `*${index + 1}. ${item.modelName}*\n`;
        message += `   - Cantidad: ${item.quantity}\n`;
        message += `   - Precio Unitario: ${item.unitPriceDisplay}\n`;
        message += `   - Subtotal: ${item.subtotalDisplay}\n`;
        if (item.text) message += `   - Texto: "${item.text}"\n`;
        if (item.fontFamily) message += `   - Tipografía: ${item.fontFamily}\n`;
        message += `\n`;
      });

      message += `*💰 TOTAL ESTIMADO: ${totalDisplay}*\n`;
      message += `\n_A la espera de confirmación y detalles de envío._`;

      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/584242699863?text=${encodedMessage}`;
      
      clearCart();
      closeCart();
      window.open(whatsappUrl, '_blank');
      navigate('/');
    } catch (error) {
      console.error("Error processing checkout:", error);
      alert("Hubo un error al procesar tu pedido. Por favor intenta de nuevo.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isCartOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity backdrop-blur-sm"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white shadow-2xl z-50 transform transition-transform duration-300 flex flex-col ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-surface-container">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-2xl">shopping_cart</span>
            <h2 className="font-title-lg text-xl font-bold text-on-surface">Tu Carrito</h2>
            {cart.length > 0 && (
              <span className="bg-primary text-white text-xs font-bold px-2 py-1 rounded-full ml-2">
                {cart.length}
              </span>
            )}
          </div>
          <button 
            onClick={closeCart}
            className="p-2 hover:bg-surface-canvas rounded-full transition-colors text-text-secondary hover:text-error"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-surface-canvas">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-5xl text-outline">production_quantity_limits</span>
              </div>
              <div>
                <p className="font-title-md text-lg text-on-surface">Tu carrito está vacío</p>
                <p className="text-text-secondary mt-1">¡Explora nuestro catálogo y personaliza tu sello ideal!</p>
              </div>
              <button 
                onClick={() => { closeCart(); navigate('/catalog'); }}
                className="btn btn-primary mt-4"
              >
                Ver Catálogo
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-surface-container flex gap-4 relative group">
                  
                  {/* Image */}
                  <div className="w-20 h-20 bg-surface-canvas rounded-lg flex items-center justify-center flex-shrink-0">
                    <img 
                      src={item.logoDataUrl || item.model.imgUrl} 
                      alt={item.model.name || item.model.type} 
                      className="w-full h-full object-contain mix-blend-multiply p-2"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-on-surface line-clamp-2 pr-6">{item.model.name || item.model.type}</h3>
                      <p className="text-primary font-bold text-sm mt-1">{getDisplayPrice(item.model.price)}</p>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center bg-surface-canvas rounded-lg overflow-hidden border border-surface-container">
                        <button 
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="w-8 h-8 flex items-center justify-center hover:bg-white transition-colors text-text-secondary"
                        >
                          <span className="material-symbols-outlined text-sm">remove</span>
                        </button>
                        <span className="w-8 text-center font-bold text-sm text-on-surface">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-white transition-colors text-text-secondary"
                        >
                          <span className="material-symbols-outlined text-sm">add</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Delete Button */}
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="absolute top-3 right-3 text-outline hover:text-error transition-colors p-1"
                    title="Eliminar producto"
                  >
                    <span className="material-symbols-outlined text-lg">delete</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="p-6 bg-white border-t border-surface-container shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <div className="flex justify-between items-center mb-6">
              <span className="font-bold text-text-secondary">Total a pagar:</span>
              <span className="font-title-lg text-2xl font-bold text-primary">{getDisplayPrice(subtotal)}</span>
            </div>
            
            <button
              onClick={handleCheckout}
              disabled={isProcessing}
              className="w-full btn btn-primary flex items-center justify-center gap-2 py-4 text-lg"
            >
              {isProcessing ? (
                <span className="material-symbols-outlined animate-spin">sync</span>
              ) : (
                <>
                  <span className="material-symbols-outlined">shopping_bag</span>
                  Completar Pedido
                </>
              )}
            </button>
            <p className="text-center text-xs text-text-secondary mt-3">
              Serás redirigido a WhatsApp para coordinar el pago y envío.
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
