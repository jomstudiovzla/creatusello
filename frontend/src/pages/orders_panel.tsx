import { useState } from 'react';

export default function OrdersPanel() {
  const [orders] = useState([
    {
      id: "Pedido_#A1B2C3",
      customer: "Empresa S.A.",
      type: "Automático Trodat 4911",
      fontUrl: "/pedidos_db/Pedido_#A1B2C3/custom_font.ttf",
      designUrl: "/preview_output/Pedido_#A1B2C3_preview.png"
    }
  ]);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-primary mb-6">Recepción de Comandas</h2>
      <div className="grid gap-6">
        {orders.map(order => (
          <div key={order.id} className="bg-surface-canvas p-6 rounded-xl border border-outline-variant shadow-sm">
            <div className="flex justify-between items-start mb-4 border-b pb-4">
              <div>
                <h3 className="text-xl font-bold text-primary">{order.id}</h3>
                <p className="text-text-secondary">{order.customer} - {order.type}</p>
              </div>
              <span className="bg-vibrant-orange/10 text-vibrant-orange px-3 py-1 rounded-full text-sm font-bold">Nuevo</span>
            </div>
            <div className="flex gap-4">
              <a href={order.fontUrl} download className="flex items-center gap-2 bg-surface-container hover:bg-surface-container-high px-4 py-2 rounded border border-outline-variant transition-colors">
                <span className="material-symbols-outlined">download</span>
                Descargar Tipografía del Cliente
              </a>
              <a href={order.designUrl} download className="flex items-center gap-2 bg-vibrant-teal text-white hover:opacity-90 px-4 py-2 rounded transition-colors">
                <span className="material-symbols-outlined">image</span>
                Descargar Diseño PNG
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
