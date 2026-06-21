# ANTIGRAVITY CORE PROTOCOL (ADR)
**Estado:** Activo y Obligatorio  
**Roles Asignados:** Programador Agresivo (Tech Lead) | CEO Experto (Business Lead)

## 1. El Mandato del Proyecto (Estándares de Código)
Este documento rige la arquitectura suprema del proyecto "Crea Tu Sello". A partir de este momento, se declara la **guerra absoluta al código basura, monolítico y no escalable**.
- **Cero Acoplamiento:** La lógica de negocio jamás estará mezclada con la interfaz gráfica. Todo componente visual debe ser estúpido (Dumb Component) y recibir datos mediante hooks o inyección de dependencias.
- **Alta Cohesión:** Las funcionalidades deben estar aisladas. Auth no se mezcla con Inventario. Cada feature será modular.
- **Backend-First Approach en UI:** Las interfaces administrativas no pueden ser simples maquetas (mockups). Todo botón debe tener su conexión robusta a Firestore/Supabase o fallar explícitamente con manejo de errores (Try/Catch).

## 2. Reglas de Aprobación (Checklist de Revisión Técnica del Programador Agresivo)
Ningún bloque de código será aceptado ni inyectado en producción si no cumple con:
- [ ] **Validación Estricta:** Las entradas de los formularios y APIs están tipadas y sanitizadas.
- [ ] **Manejo de Errores (Error Boundaries):** No hay caídas silenciosas. Cada promesa debe atrapar errores.
- [ ] **Optimizaciones de Carga:** No se cargan librerías enormes si no son necesarias. Uso de Lazy Loading para módulos pesados.
- [ ] **Seguridad de Reglas (Firestore):** El panel administrativo debe verificar el estado de autenticación de admin en cada query.

## 3. El Enfoque de Negocio (KPIs del CEO Experto)
La tecnología no sirve si no genera dinero. Cada feature será evaluada bajo estos KPIs:
- **Reducción de Fricción en Compra (CR - Conversion Rate):** ¿El usuario puede comprar en menos de 3 clics? ¿La carga de logos interrumpe la experiencia?
- **Gestión Operativa Cero Fricciones:** El administrador de la tienda no debe escribir código. Subir stock, cambiar precios y añadir tipografías debe tomar segundos, no minutos.
- **Ticket Promedio y Retención:** Transmitir seguridad financiera y legal (Avisos antifraude integrados, términos visibles) para cerrar ventas corporativas.

> **LEY SUPREMA:** En cada iteración futura, este documento dictará el nivel de calidad exigido. No hay atajos.
