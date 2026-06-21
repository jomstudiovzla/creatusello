import { Link } from 'react-router-dom';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-surface-canvas pt-10 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        <Link to="/" className="text-secondary hover:text-vibrant-orange flex items-center gap-2 mb-8 transition-colors">
          &larr; Volver al inicio
        </Link>
        
        <div className="bg-white rounded-2xl shadow-sm border border-outline-variant p-8 md:p-12">
          <div className="flex items-center gap-4 mb-8 border-b border-outline-variant pb-6">
            <span className="material-symbols-outlined text-[40px] text-vibrant-orange">privacy_tip</span>
            <h1 className="text-3xl font-title-large text-on-surface">Políticas de Privacidad</h1>
          </div>

          <div className="space-y-8 text-on-surface-variant leading-relaxed">
            
            <section>
              <h2 className="text-xl font-bold text-on-surface flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-[20px] text-secondary">database</span>
                1. Recopilación de Datos Personales
              </h2>
              <p>
                En Crea Tu Sello valoramos y respetamos tu privacidad. Solo recopilamos los datos estrictamente necesarios para procesar tus pedidos y envíos, tales como: nombre completo, número de teléfono (WhatsApp), correo electrónico, y dirección de envío.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-on-surface flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-[20px] text-secondary">visibility_off</span>
                2. Uso de la Información
              </h2>
              <p>
                Los datos proporcionados serán utilizados única y exclusivamente para:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Procesar, facturar y enviar tu orden de sellos.</li>
                <li>Contactarte vía correo o WhatsApp en caso de requerir confirmación de diseños o informar estatus del pedido.</li>
                <li>Enviar notificaciones esporádicas de estado de servicio.</li>
              </ul>
              <p className="mt-2 font-semibold">
                Bajo ninguna circunstancia venderemos, alquilaremos o compartiremos tu información personal con terceros o agencias de publicidad.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-on-surface flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-[20px] text-secondary">lock</span>
                3. Seguridad Financiera y Tarjetas de Crédito
              </h2>
              <p>
                <strong>No almacenamos, procesamos ni tenemos acceso a datos de tarjetas de crédito o débito.</strong> 
                Todas las transacciones y validaciones de pago se realizan a través de reportes manuales o pasarelas externas encriptadas. Nunca te pediremos contraseñas bancarias, pines o códigos de seguridad a través de ningún medio.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-on-surface flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-[20px] text-secondary">verified_user</span>
                4. Confidencialidad de Diseños
              </h2>
              <p>
                Los logotipos, firmas médicas, sellos de empresas y archivos cargados a nuestro sistema se tratarán con la más estricta confidencialidad. Una vez completado el trabajo, los archivos fuente se mantendrán archivados únicamente para facilitar posibles futuras reimpresiones por parte del mismo cliente.
              </p>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
