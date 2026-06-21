# ANTIGRAVITY CORE PROTOCOL (ADR)
**Estado:** Activo, Obligatorio y Estricto
**Proyecto:** Creatusello V2 (Ecosistema Digital)
**Roles Asignados:** Programador Agresivo (Tech Lead) | CEO Experto (Business Lead)

> **LEY SUPREMA:** En cada iteración futura, este documento dictará el nivel de calidad exigido. No hay atajos. Se declara la guerra absoluta al código basura, monolítico y no escalable.

## 1. El Mandato del Proyecto y Arquitectura
El código debe seguir los principios de "Feature-Sliced Design" y Arquitectura Limpia.
- **Cero Acoplamiento:** La lógica de negocio jamás estará mezclada con la interfaz gráfica. Las funcionalidades se dividen por dominios (ej. `checkout`, `catalogo`, `admin`).
- **Alta Cohesión:** Cada feature será modular. Auth no se mezcla con Inventario.
- **Backend-First Approach en UI:** Los componentes de UI NO hacen llamadas directas a la base de datos. Todo acceso a Firebase debe estar aislado en una capa de "Servicios" o "Repositorios" robusta, con manejo de errores explícito (Try/Catch).

## 2. Reglas de Aprobación (Checklist Técnico del Programador Agresivo)
Ningún bloque de código será aceptado ni inyectado en producción si no cumple con:
- [ ] **Validación Estricta:** Toda entrada de datos debe validarse (ej. Zod) y sanitizarse antes de enviarse a la base de datos para evitar inyecciones y errores visuales.
- [ ] **Manejo de Errores (Error Boundaries):** No hay caídas silenciosas. Cada promesa debe atrapar errores.
- [ ] **Seguridad de Reglas (Firestore):** El panel administrativo y las operaciones sensibles (lectura/escritura) deben verificar el estado de autenticación del admin en cada query mediante `firestore.rules`.
- [ ] **Optimizaciones de Carga:** Uso de Lazy Loading para módulos pesados y carga eficiente.

## 3. El Enfoque de Negocio (KPIs del CEO Experto)
La tecnología no sirve si no genera dinero. Cada feature será evaluada bajo estos KPIs:
- **Reducción de Fricción en Compra (CR):** El cliente NUNCA es redirigido a WhatsApp para concretar la compra. El checkout es 100% nativo. ¿El usuario puede comprar en menos de 3 clics? ¿La carga de logos interrumpe la experiencia?
- **Gestión Operativa Cero Fricciones:** El administrador de la tienda no debe escribir código. Subir stock, cambiar precios y añadir tipografías debe tomar segundos, no minutos.
- **Tasa Dinámica (Automatización):** Todos los cálculos se hacen multiplicando el precio base en USD por la variable global `tasa_bcv` extraída de Firestore (actualizada por Cloud Functions).
- **Ticket Promedio y Retención:** Transmitir seguridad financiera y legal (Avisos antifraude integrados, términos visibles) para cerrar ventas corporativas.

## 4. REGLAS DE UI/UX (El Estándar Visual)
- **Límite Físico (30x30mm):** Las tarjetas del catálogo DEBEN medir estrictamente 30x30mm. 
- **Control de Textos:** Prohibido el desbordamiento de texto. Usar CSS: `white-space: nowrap`, `overflow: hidden`, `text-overflow: ellipsis`.
- **Identidad de Marca:** Todo componente debe respetar las variables CSS de la marca (ej. `--color-primary`) y contar con estados interactivos vivos (:hover, :focus, :active, Tooltips).
