import { Link } from 'react-router-dom';

export default function OrderSuccessPage() {
  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6 bg-surface-canvas">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-outline-variant text-center flex flex-col items-center">
        <div className="w-20 h-20 bg-[#25D366]/10 text-[#25D366] rounded-full flex items-center justify-center mb-6">
          <span className="material-symbols-outlined text-4xl">check_circle</span>
        </div>
        <h1 className="text-3xl font-bold text-on-surface mb-2 font-title-lg">¡Pedido Exitoso!</h1>
        <p className="text-on-surface-variant mb-8 leading-relaxed">
          Hemos recibido tu solicitud correctamente. Nuestro equipo revisará los detalles y te contactará a través de WhatsApp para confirmar el pago y el envío.
        </p>
        <Link 
          to="/" 
          className="w-full py-4 bg-primary text-white rounded-xl font-bold text-lg hover:shadow-lg hover:-translate-y-1 transition-all active:translate-y-0"
        >
          Volver al Inicio
        </Link>
      </div>
    </div>
  );
}
