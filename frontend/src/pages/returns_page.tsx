import { Link } from 'react-router-dom';

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-surface-canvas pt-10 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        <Link to="/" className="text-secondary hover:text-vibrant-orange flex items-center gap-2 mb-8 transition-colors">
          &larr; Volver al inicio
        </Link>
        
        <div className="bg-white rounded-2xl shadow-sm border border-outline-variant p-8 md:p-12">
          <div className="flex items-center gap-4 mb-8 border-b border-outline-variant pb-6">
            <span className="material-symbols-outlined text-[40px] text-vibrant-orange">published_with_changes</span>
            <h1 className="text-3xl font-title-large text-on-surface">Políticas de Devolución y Garantías</h1>
          </div>

          <div className="space-y-8 text-on-surface-variant leading-relaxed">
            
            <section>
              <h2 className="text-xl font-bold text-on-surface flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-[20px] text-secondary">check_circle</span>
                1. Garantía por Defectos de Fábrica
              </h2>
              <p>
                Nuestros sellos (Trodat, Colop, Shiny, Traxx) pasan por un estricto control de calidad. Si el mecanismo físico del sello, la carcasa o la almohadilla de tinta interna presentan un defecto de fábrica al momento de recibirlo, procederemos con el reemplazo inmediato de la pieza dañada sin costo adicional, siempre que el reclamo se realice en un lapso no mayor a <strong>3 días continuos</strong> tras la recepción del producto.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-on-surface flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-[20px] text-secondary">cancel</span>
                2. Excepciones de Devolución (Productos Personalizados)
              </h2>
              <div className="bg-red-50 border border-red-100 p-4 rounded-xl text-red-900 mt-2">
                <p className="font-semibold flex items-start gap-2">
                  <span className="material-symbols-outlined text-[20px] shrink-0 mt-0.5">warning</span>
                  Al ser productos 100% personalizados y elaborados a medida para cada cliente, NO realizamos devoluciones de dinero ni cambios de producto si el error proviene de la información suministrada por el usuario.
                </p>
              </div>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li><strong>Errores Ortográficos:</strong> Si el cliente proporcionó un texto con errores de tipeo u ortografía, no aplica garantía.</li>
                <li><strong>Logos de Baja Calidad:</strong> Si el diseño o logo subido es de mala resolución o ilegible, la goma reflejará esa misma calidad. El cliente asume la responsabilidad del archivo adjunto.</li>
                <li><strong>Aprobación Previa:</strong> Si se envió un "preview" o maqueta digital y el cliente la aprobó, cualquier reclamo posterior sobre el diseño queda sin efecto.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-on-surface flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-[20px] text-secondary">sync_problem</span>
                3. Proceso de Reclamo
              </h2>
              <p>
                Para reportar una anomalía de fábrica:
              </p>
              <ol className="list-decimal pl-6 mt-2 space-y-1">
                <li>Contáctanos exclusivamente a través de nuestro número oficial de WhatsApp.</li>
                <li>Envíanos fotos y/o un video claro mostrando la falla mecánica o el defecto del sello.</li>
                <li>Nuestro equipo técnico evaluará el caso en menos de 24 horas hábiles y te indicará los pasos para el reemplazo.</li>
              </ol>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
