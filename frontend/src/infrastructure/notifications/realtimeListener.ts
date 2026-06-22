import { db } from '../../lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';

let unsubscribeOrders: (() => void) | null = null;

export function initRealtimeNotifications(onNewOrder: (order: any) => void) {
  // Evitar múltiples suscripciones
  if (unsubscribeOrders) return;

  const ordersRef = collection(db, 'pedidos');
  
  // Opcional: solo escuchar pedidos recientes para evitar disparar alertas de pedidos viejos
  // Depende de cómo guardes la fecha, aquí asumimos un string ISO o un Timestamp
  
  // Usamos onSnapshot para tiempo real
  unsubscribeOrders = onSnapshot(ordersRef, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      // Solo notificar cuando se AÑADE un nuevo pedido
      if (change.type === 'added') {
        const orderData = change.doc.data();
        
        // Prevención básica: solo notificar si fue creado recientemente (últimos 2 minutos)
        // Esto evita spam al recargar la página
        const now = new Date().getTime();
        const orderTime = orderData.createdAt ? new Date(orderData.createdAt).getTime() : 0;
        
        if (now - orderTime < 120000) {
          // 1. Disparar UI Toast callback
          onNewOrder({ id: change.doc.id, ...orderData });
          
          // 2. Disparar Webhook externo (API de WhatsApp / Email)
          triggerExternalWebhook(orderData);
        }
      }
    });
  }, (error) => {
    console.error("Error en realtimeListener de pedidos:", error);
  });
}

export function stopRealtimeNotifications() {
  if (unsubscribeOrders) {
    unsubscribeOrders();
    unsubscribeOrders = null;
  }
}

/**
 * Función puente preparada para webhook
 */
async function triggerExternalWebhook(orderData: any) {
  // EJEMPLO: 
  // const webhookUrl = 'https://n8n.tuservidor.com/webhook/nuevo-pedido';
  // fetch(webhookUrl, { method: 'POST', body: JSON.stringify(orderData) });
  console.log("[WEBHOOK MOCK] Enviando notificación a WhatsApp para la orden de:", orderData.customerName);
}
