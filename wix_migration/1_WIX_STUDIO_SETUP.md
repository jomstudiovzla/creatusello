# Guía de Migración a Wix Studio

Wix Studio utiliza una arquitectura diferente a React. En lugar de archivos `.tsx`, Wix usa componentes visuales y código en **Velo (JavaScript)**.

Aquí encontrarás todo el código necesario para recrear "Crea Tu Sello" dentro de Wix, sin alterar tu código original de React.

## 1. Importación del Inventario
1. Entra a tu Wix Studio.
2. En el menú izquierdo, busca **CMS (Sistema de Gestión de Contenidos)**.
3. Crea una nueva colección llamada `Productos`.
4. Haz clic en **Importar CSV**.
5. Selecciona el archivo que ya tienes en tu computadora: `data/Catalogo_Inventario_CreaTuSello.csv`.
6. Asegúrate de mapear las columnas correctamente (Nombre -> Name, Precio -> Price, etc.).

## 2. Creación del Configurador Visual de Sellos
Para recrear la vista donde el texto aparece dentro del sello:
1. En tu página de Wix (como la que me mostraste de Blush & Lush), elimina las imágenes de relleno.
2. Ve a **Agregar Elementos** (el botón +) -> **Incrustar y Redes Sociales** -> **Incrustar código (HTML)**.
3. Arrastra el recuadro gris al lugar donde quieres que se vea el sello.
4. Haz clic en "Ingresar Código" y pega exactamente el contenido del archivo `2_HTML_COMPONENT_CODE.html` que está en esta misma carpeta.
5. Cambia el ID de este elemento en las propiedades de Wix (abajo a la derecha) a `htmlLienzo`.

## 3. Conexión de Botones e Inputs (Velo Code)
1. Agrega un **Input de Texto** (Caja de entrada) y cámbiale el ID a `inputTexto`.
2. Agrega un **Menú Desplegable** (Dropdown) y cámbiale el ID a `dropdownTipografia`.
3. Agrega un **Botón** ("Agregar al Carrito") y cámbiale el ID a `btnAgregarCarrito`.
4. Activa el "Modo Desarrollador" (Code Mode) en la barra superior de Wix Studio.
5. Se abrirá una consola de código en la parte inferior. Pega ahí el contenido del archivo `3_VELO_PRODUCT_PAGE.js`.

¡Eso es todo! Con esto habrás portado la lógica principal de personalización al entorno cerrado de Wix Studio.
