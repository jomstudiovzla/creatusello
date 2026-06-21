import { collection, addDoc, getDocs, doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import type { Order } from '../../entities/order/types';

// ==========================================
// ORDERS REPOSITORY
// ==========================================
export const ordersApi = {
  createOrder: async (orderData: Order) => {
    try {
      const orderRef = await addDoc(collection(db, 'orders'), {
        ...orderData,
        createdAt: new Date().toISOString()
      });
      return { success: true, orderId: orderRef.id };
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  },
  
  getOrders: async () => {
    const querySnapshot = await getDocs(collection(db, 'orders'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
};

// ==========================================
// CONFIG REPOSITORY (BCV)
// ==========================================
export const configApi = {
  subscribeToBcvRate: (callback: (rate: number) => void) => {
    const unsub = onSnapshot(doc(db, 'configuracion', 'tasa_bcv'), (doc) => {
      if (doc.exists()) {
        callback(doc.data().vesPerUsd);
      } else {
        // Fallback default or handle error
        callback(0);
      }
    });
    return unsub;
  }
};
