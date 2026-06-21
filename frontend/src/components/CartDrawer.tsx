import React from 'react';
import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';

const CartDrawer: React.FC = () => {
  const { cart, isCartOpen, closeCart, removeFromCart, updateQuantity, currency, exchangeRates } = useStore();
  const navigate = useNavigate();

  const subtotal = cart.reduce((acc, item) => acc + (item.model.price * item.quantity), 0);
  
  const getDisplayPrice = (eurPrice: number) => {
    switch (currency) {
      case 'USD': return `$${(eurPrice * exchangeRates.USD).toFixed(2)}`;
      case 'VES': return `Bs. ${(eurPrice * exchangeRates.VES).toFixed(2)}`;
      default: return `€${eurPrice.toFixed(2)}`;
    }
  };

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  if (!isCartOpen) return null;

  return (
    <>
      {/* Backdrop con Blur y oscurecimiento profundo */}
      <div 
        className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-md transition-opacity duration-300"
        onClick={closeCart}
      />

      {/* Drawer interactivo con Cubic Bezier y sombra masiva */}
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-[450px] bg-white shadow-[0_0_50px_rgba(0,0,0,0.3)] z-[70] transform transition-transform flex flex-col`}
        style={{
          transitionDuration: '400ms',
          transitionTimingFunction: 'cubic-bezier(0.25, 1, 0.5, 1)',
          transform: isCartOpen ? 'translateX(0)' : 'translateX(100%)'
        }}
      >
        
        {/* Header Premium */}
        <div className="flex items-center justify-between p-6 border-b border-surface-container bg-surface-canvas">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-2xl">shopping_cart</span>
            </div>
            <h2 className="font-title-lg text-2xl font-bold text-on-surface">Tu Carrito</h2>
            {cart.length > 0 && (
              <span className="bg-primary text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm">
                {cart.length}
              </span>
            )}
          </div>
          <button 
            onClick={closeCart}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-error/10 text-text-secondary hover:text-error transition-colors duration-200"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-surface-bright">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-6 opacity-80">
              <div className="w-32 h-32 bg-surface-container rounded-full flex items-center justify-center shadow-inner">
                <span className="material-symbols-outlined text-6xl text-outline-variant">production_quantity_limits</span>
              </div>
              <div>
                <p className="font-title-lg text-xl text-on-surface font-bold">Tu carrito está vacío</p>
                <p className="text-text-secondary mt-2 max-w-[250px] mx-auto">¡Explora nuestro catálogo y personaliza tu sello ideal con la mejor calidad!</p>
              </div>
              <button 
                onClick={() => { closeCart(); navigate('/customizer'); }}
                className="mt-4 px-8 py-3 bg-primary text-white rounded-full font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
              >
                Ver Catálogo
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div 
                  key={item.id} 
                  className="bg-white p-4 rounded-2xl shadow-sm hover:shadow-md hover:border-primary/30 border border-transparent transition-all duration-300 flex gap-4 relative group"
                >
                  {/* Image */}
                  <div className="w-24 h-24 bg-surface-canvas rounded-xl flex items-center justify-center flex-shrink-0 border border-surface-container overflow-hidden">
                    <img 
                      src={item.logoDataUrl || item.model.imgUrl} 
                      alt={item.model.name || item.model.type} 
                      className="w-full h-full object-contain mix-blend-multiply p-2 transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between py-1 pr-6">
                    <div>
                      <h3 className="font-bold text-sm text-on-surface line-clamp-2 leading-tight">{item.model.name || item.model.type}</h3>
                      <p className="text-primary font-bold text-base mt-1">{getDisplayPrice(item.model.price)}</p>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center bg-surface-canvas rounded-lg overflow-hidden border border-surface-container shadow-sm">
                        <button 
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="w-8 h-8 flex items-center justify-center hover:bg-primary hover:text-white transition-colors text-text-secondary"
                        >
                          <span className="material-symbols-outlined text-[16px]">remove</span>
                        </button>
                        <span className="w-10 text-center font-bold text-sm text-on-surface">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-primary hover:text-white transition-colors text-text-secondary"
                        >
                          <span className="material-symbols-outlined text-[16px]">add</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Delete Button */}
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center bg-surface-canvas text-text-secondary hover:bg-error hover:text-white transition-all shadow-sm opacity-0 group-hover:opacity-100"
                    title="Eliminar producto"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="p-6 bg-white border-t border-surface-container shadow-[0_-10px_30px_rgba(0,0,0,0.05)] z-10 relative">
            <div className="flex justify-between items-center mb-6">
              <span className="font-bold text-text-secondary text-lg">Total a pagar:</span>
              <span className="font-title-lg text-3xl font-bold text-primary">{getDisplayPrice(subtotal)}</span>
            </div>
            
            <button
              onClick={handleCheckout}
              className="w-full bg-primary text-white flex items-center justify-center gap-3 py-4 rounded-xl font-bold text-lg shadow-[0_8px_20px_rgba(var(--color-primary),0.3)] hover:shadow-[0_12px_25px_rgba(var(--color-primary),0.4)] hover:-translate-y-1 active:translate-y-0 active:scale-95 transition-all duration-200"
            >
              <span className="material-symbols-outlined">shopping_bag</span>
              Completar Pedido Seguro
            </button>
            <div className="flex items-center justify-center gap-1 mt-4 text-xs text-text-secondary">
              <span className="material-symbols-outlined text-[14px] text-primary">lock</span> 
              Tus datos están protegidos y cifrados end-to-end
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
