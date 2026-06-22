import React, { useEffect, useState } from 'react';
import { db } from '../../../lib/firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';

export const InventoryManagerWidget: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);
    const snap = await getDocs(collection(db, 'products'));
    const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleUpdateStock = async (id: string, currentStock: number) => {
    const qtyStr = prompt("¿Cuántas unidades nuevas llegaron? (Suma al stock actual)", "0");
    if (!qtyStr) return;
    const additional = parseInt(qtyStr, 10);
    if (isNaN(additional) || additional <= 0) return;

    try {
      await updateDoc(doc(db, 'products', id), {
        stock: currentStock + additional
      });
      alert("Stock actualizado exitosamente");
      fetchProducts();
    } catch (e) {
      console.error(e);
      alert("Error actualizando stock");
    }
  };

  if (loading) return <div>Cargando inventario seguro...</div>;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-outline-variant">
      <h2 className="text-xl font-bold text-on-surface mb-4">Gestión Rápida de Inventario (FSD Widget)</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-lowest border-b border-outline-variant">
              <th className="p-3 text-sm font-bold">SKU</th>
              <th className="p-3 text-sm font-bold">Producto</th>
              <th className="p-3 text-sm font-bold">Stock Actual</th>
              <th className="p-3 text-sm font-bold">Acción</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} className="border-b border-outline-variant/50 hover:bg-surface-container-lowest/50">
                <td className="p-3 text-sm text-on-surface-variant">{p.sku}</td>
                <td className="p-3 text-sm font-medium">{p.type || p.name}</td>
                <td className="p-3 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${p.stock > 10 ? 'bg-green-100 text-green-800' : p.stock > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                    {p.stock} uds.
                  </span>
                </td>
                <td className="p-3">
                  <button 
                    onClick={() => handleUpdateStock(p.id, p.stock || 0)}
                    className="text-primary hover:text-primary-container font-bold text-sm"
                  >
                    + Sumar Stock
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
