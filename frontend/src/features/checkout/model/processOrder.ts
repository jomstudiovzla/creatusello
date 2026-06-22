import { db } from '../../../lib/firebase';
import { doc, runTransaction, collection } from 'firebase/firestore';

export interface CheckoutItem {
  productId: string;
  quantity: number;
  [key: string]: any;
}

export interface OrderData {
  items: CheckoutItem[];
  total: number;
  customerName: string;
  customerEmail: string;
  [key: string]: any;
}

/**
 * Procesa la orden usando una transacción atómica para asegurar
 * que el inventario no quede en números negativos.
 */
export async function processAtomicOrder(orderData: OrderData): Promise<{ success: boolean, orderId?: string, error?: string }> {
  try {
    const orderRef = doc(collection(db, 'pedidos'));

    await runTransaction(db, async (transaction) => {
      // 1. Fase de Lectura: Leer todos los productos involucrados
      const productRefs = orderData.items.map(item => doc(db, 'products', item.productId));
      const productSnapshots = await Promise.all(productRefs.map(ref => transaction.get(ref)));

      // Verificar existencias
      for (let i = 0; i < productSnapshots.length; i++) {
        const snap = productSnapshots[i];
        if (!snap.exists()) {
          throw new Error(`El producto con ID ${orderData.items[i].productId} no existe.`);
        }
        const data = snap.data();
        const currentStock = data.stock || 0;
        const requestedQuantity = orderData.items[i].quantity;

        if (currentStock < requestedQuantity) {
          throw new Error(`Stock insuficiente para el producto: ${data.type || data.name}. Solicitado: ${requestedQuantity}, Disponible: ${currentStock}`);
        }
      }

      // 2. Fase de Escritura: Restar inventario y registrar la orden
      for (let i = 0; i < productSnapshots.length; i++) {
        const snap = productSnapshots[i];
        const data = snap.data();
        const currentStock = data ? (data.stock || 0) : 0;
        const requestedQuantity = orderData.items[i].quantity;
        
        transaction.update(snap.ref, { stock: currentStock - requestedQuantity });
      }

      // Escribir el nuevo documento de pedido
      transaction.set(orderRef, {
        ...orderData,
        status: 'pendiente',
        createdAt: new Date().toISOString()
      });
    });

    return { success: true, orderId: orderRef.id };
  } catch (error: any) {
    console.error("Error en la transacción atómica de checkout:", error);
    return { success: false, error: error.message };
  }
}
