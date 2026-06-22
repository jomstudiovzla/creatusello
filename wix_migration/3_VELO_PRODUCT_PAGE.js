import { cart } from 'wix-stores';

// Esta función se ejecuta cuando la página de Wix carga por completo
$w.onReady(function () {
    
    // 1. Escuchar cuando el cliente escribe texto en el input
    $w("#inputTexto").onInput(() => {
        actualizarLienzo();
    });

    // 2. Escuchar cuando el cliente cambia la tipografía en el Dropdown
    $w("#dropdownTipografia").onChange(() => {
        actualizarLienzo();
    });

    // Función que se comunica con tu Iframe (htmlLienzo)
    function actualizarLienzo() {
        const texto = $w("#inputTexto").value || "Tu texto aquí...";
        const fuente = $w("#dropdownTipografia").value || "Montserrat";
        
        // Enviar mensaje al Iframe. El ID "#htmlLienzo" debe coincidir con el elemento HTML en Wix
        $w("#htmlLienzo").postMessage({
            text: texto,
            font: fuente,
            color: "#002855"
        });
    }

    // 3. Lógica del Botón de Agregar al Carrito
    $w("#btnAgregarCarrito").onClick(() => {
        const customText = $w("#inputTexto").value;
        const selectedFont = $w("#dropdownTipografia").value;
        
        // Wix tiene una función nativa para obtener el producto actual en la página
        $w('#productPage1').getProduct().then((product) => {
            if (!customText) {
                // Muestra un mensaje de error si el cliente no escribió nada
                // Asegúrate de agregar un texto rojo oculto con ID #textoError
                $w("#textoError").text = "Por favor, escribe el texto para tu sello.";
                $w("#textoError").show();
                return;
            }

            // Ocultar error si todo está bien
            $w("#textoError").hide();

            // Preparar los campos personalizados para la orden (Esto lo verá el administrador luego)
            const customOptions = {
                customTextFields: [
                    { title: "Texto Grabado", value: customText },
                    { title: "Tipografía Seleccionada", value: selectedFont }
                ]
            };

            // Ejecutar agregado al carrito nativo de Wix Stores
            cart.addProducts([{
                productId: product._id,
                quantity: 1,
                options: customOptions
            }]).then(() => {
                console.log("¡Producto personalizado agregado exitosamente!");
            }).catch((error) => {
                console.error("Error en el carrito de Wix:", error);
            });
        });
    });
});
