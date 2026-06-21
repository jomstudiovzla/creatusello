import { Link } from 'react-router-dom';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-surface-canvas pt-10 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        <Link to="/" className="text-secondary hover:text-vibrant-orange flex items-center gap-2 mb-8 transition-colors">
          &larr; Volver al inicio
        </Link>
        
        <div className="bg-white rounded-2xl shadow-sm border border-outline-variant p-8 md:p-12">
          <div className="flex items-center gap-4 mb-8 border-b border-outline-variant pb-6">
            <span className="material-symbols-outlined text-[40px] text-vibrant-orange">gavel</span>
            <h1 className="text-3xl font-title-large text-on-surface">Términos y Condiciones</h1>
          </div>

          <div className="space-y-8 text-on-surface-variant leading-relaxed">
            
            <section>
              <h2 className="text-xl font-bold text-on-surface flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-[20px] text-secondary">description</span>
                1. Condiciones Generales
              </h2>
              <p>
                Al acceder y realizar una compra en Crea Tu Sello, aceptas estar sujeto a los siguientes términos y condiciones. Nos reservamos el derecho de modificar estos términos en cualquier momento. Las compras realizadas están sujetas a disponibilidad de inventario y a la confirmación del pago.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-on-surface flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-[20px] text-secondary">warning</span>
                2. Política de Precios y Tasa BCV
              </h2>
              <p>
                Todos los precios de nuestros productos base están anclados al valor del dólar estadounidense (USD). Para compras en Bolívares (VES), <strong>el monto final será calculado utilizando estrictamente la Tasa Oficial del Banco Central de Venezuela (BCV)</strong> correspondiente al día del pago, garantizando total transparencia y apego a las normativas legales vigentes.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-on-surface flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-[20px] text-secondary">copyright</span>
                3. Propiedad Intelectual de Logos y Diseños
              </h2>
              <p>
                Crea Tu Sello actúa únicamente como prestador del servicio de impresión, grabado y manufactura de sellos. 
                <strong> El usuario es el único y exclusivo responsable legal de los derechos de autor, marcas registradas y propiedad intelectual de cualquier logotipo, imagen o diseño subido a nuestra plataforma.</strong>
              </p>
              <p className="mt-2">
                Crea Tu Sello no se hace responsable por el uso indebido de logotipos corporativos, institucionales, firmas médicas o del Estado por parte del cliente. Al subir un diseño, el cliente certifica que posee los derechos legales para su reproducción.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-on-surface flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-[20px] text-secondary">description</span>
                4. Aprobación de Artes y Manufactura
              </h2>
              <p>
                Para pedidos personalizados, nuestro equipo técnico podría enviar una vista previa del diseño final para la aprobación del cliente antes de iniciar la manufactura. Una vez que el cliente aprueba el diseño final (o si el diseño subido por el cliente fue proporcionado en formato directo), se procederá con la creación del sello. Crea Tu Sello no asume responsabilidad por errores ortográficos, de resolución o diseño presentes en los archivos originales enviados por el usuario.
              </p>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
