export default function ContactPage() {
  return (
    <main className="pt-32 pb-20 px-4 md:px-10 max-w-[1280px] mx-auto">
      {/* Hero Section */}
      <section className="mb-16 text-center max-w-3xl mx-auto">
        <h1 className="font-display-lg text-5xl text-text-primary mb-4">Hablemos de tu <span className="text-brand-teal text-vibrant-teal font-bold">Marca</span></h1>
        <p className="text-lg text-text-secondary">Estamos aquí para ayudarte a crear la impresión perfecta. Nuestro equipo técnico en Venezuela está listo para asesorarte en tu próximo proyecto de personalización.</p>
      </section>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Contact Form & Info */}
        <div className="lg:col-span-7 space-y-8">
          {/* Contact Card */}
          <div className="bg-white p-8 rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-outline-variant/30 hover:-translate-y-2 hover:shadow-2xl transition-all">
            <h2 className="font-headline-lg text-3xl font-bold text-primary mb-8 flex items-center gap-2">
              Envíanos un mensaje
              <span className="w-12 h-1 bg-vibrant-orange rounded-full"></span>
            </h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 group">
                  <label className="text-xs text-outline uppercase tracking-wider group-focus-within:text-vibrant-blue transition-colors">Nombre Completo</label>
                  <input className="w-full bg-surface-container-low border-outline-variant rounded-lg p-3 text-base focus:border-vibrant-blue focus:ring-0 transition-all focus:shadow-[0_0_0_4px_rgba(0,35,111,0.1)]" placeholder="Ej. Juan Pérez" type="text" />
                </div>
                <div className="space-y-2 group">
                  <label className="text-xs text-outline uppercase tracking-wider group-focus-within:text-vibrant-blue transition-colors">Correo Electrónico</label>
                  <input className="w-full bg-surface-container-low border-outline-variant rounded-lg p-3 text-base focus:border-vibrant-blue focus:ring-0 transition-all focus:shadow-[0_0_0_4px_rgba(0,35,111,0.1)]" placeholder="juan@ejemplo.com" type="email" />
                </div>
              </div>
              <div className="space-y-2 group">
                <label className="text-xs text-outline uppercase tracking-wider group-focus-within:text-vibrant-blue transition-colors">Asunto</label>
                <select className="w-full bg-surface-container-low border-outline-variant rounded-lg p-3 text-base focus:border-vibrant-blue focus:ring-0 transition-all focus:shadow-[0_0_0_4px_rgba(0,35,111,0.1)]">
                  <option>Consulta de Catálogo</option>
                  <option>Pedido Personalizado</option>
                  <option>Soporte Técnico</option>
                  <option>Ventas al Mayor</option>
                </select>
              </div>
              <div className="space-y-2 group">
                <label className="text-xs text-outline uppercase tracking-wider group-focus-within:text-vibrant-blue transition-colors">Mensaje</label>
                <textarea className="w-full bg-surface-container-low border-outline-variant rounded-lg p-3 text-base focus:border-vibrant-blue focus:ring-0 transition-all focus:shadow-[0_0_0_4px_rgba(0,35,111,0.1)]" placeholder="¿Cómo podemos ayudarte hoy?" rows={4}></textarea>
              </div>
              
              <div className="flex flex-col md:flex-row gap-4 pt-4 border-t border-outline-variant/30">
                <a href="mailto:presupuestos@creatusello.com" className="flex-1 bg-[#EA4335] text-white px-6 py-4 rounded-xl font-bold text-lg hover:bg-[#EA4335]/90 hover:shadow-xl hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-2 group shadow-lg shadow-[#EA4335]/20">
                  <span className="material-symbols-outlined">mail</span>
                  Enviar por Correo
                </a>
                <a href="https://wa.me/584142461548" target="_blank" rel="noreferrer" className="flex-1 bg-[#25D366] text-white px-6 py-4 rounded-xl font-bold text-lg hover:bg-[#25D366]/90 hover:shadow-xl hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-2 group shadow-lg shadow-[#25D366]/20">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" className="w-6 h-6 brightness-0 invert" />
                  Enviar por WhatsApp
                </a>
              </div>
            </form>
          </div>

          {/* Instant Support Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* WhatsApp */}
            <div className="bg-[#25D366]/5 p-8 rounded-2xl border-2 border-[#25D366]/20 flex flex-col items-center text-center gap-4 hover:-translate-y-2 hover:shadow-2xl hover:border-[#25D366] transition-all relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#25D366]/10 rounded-full blur-xl group-hover:bg-[#25D366]/20 transition-all"></div>
              <div className="w-20 h-20 bg-[#25D366] rounded-full flex items-center justify-center text-white shadow-lg shadow-[#25D366]/40 relative z-10">
                <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" className="w-10 h-10 brightness-0 invert" />
              </div>
              <div className="relative z-10">
                <h3 className="font-title-md text-xl font-bold text-on-surface">Asistencia por WhatsApp</h3>
                <p className="text-sm text-text-secondary mt-1 mb-4">Respuestas inmediatas en horario laboral.</p>
              </div>
              <a className="bg-[#25D366] text-white w-full py-4 rounded-xl font-bold hover:bg-[#25D366]/90 transition-all shadow-lg shadow-[#25D366]/30 active:scale-95 text-base relative z-10 flex items-center justify-center gap-2" href="https://wa.me/584142461548" target="_blank" rel="noreferrer">
                Contactar WhatsApp
              </a>
            </div>

            {/* Email */}
            <div className="bg-[#EA4335]/5 p-8 rounded-2xl border-2 border-[#EA4335]/20 flex flex-col items-center text-center gap-4 hover:-translate-y-2 hover:shadow-2xl hover:border-[#EA4335] transition-all relative overflow-hidden group">
              <div className="absolute -left-4 -bottom-4 w-24 h-24 bg-[#EA4335]/10 rounded-full blur-xl group-hover:bg-[#EA4335]/20 transition-all"></div>
              <div className="w-20 h-20 bg-[#EA4335] rounded-full flex items-center justify-center text-white shadow-lg shadow-[#EA4335]/40 relative z-10">
                <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>mail</span>
              </div>
              <div className="relative z-10">
                <h3 className="font-title-md text-xl font-bold text-on-surface">Presupuestos y Ventas</h3>
                <p className="text-sm text-text-secondary mt-1 mb-4">Cotizaciones y solicitudes detalladas.</p>
              </div>
              <a className="bg-[#EA4335] text-white w-full py-4 rounded-xl font-bold hover:bg-[#EA4335]/90 transition-all shadow-lg shadow-[#EA4335]/30 active:scale-95 text-base relative z-10 flex items-center justify-center gap-2" href="mailto:presupuestos@creatusello.com">
                Enviar Correo
              </a>
            </div>
          </div>
        </div>

        {/* Side Info & Map */}
        <div className="lg:col-span-5 space-y-8">
          {/* Location Info */}
          <div className="bg-white p-8 rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-outline-variant/30 space-y-8 hover:-translate-y-2 hover:shadow-2xl transition-all">
            <h2 className="font-headline-lg text-3xl font-bold text-primary">Nuestra Sede</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <span className="material-symbols-outlined text-vibrant-teal p-2 bg-vibrant-teal/10 rounded-lg h-fit">location_on</span>
                <div>
                  <h4 className="font-title-md text-lg font-bold text-on-surface mb-1">Dirección Física</h4>
                  <p className="text-base text-text-secondary leading-relaxed">
                    Centro Comercial Caurimare, Piso 1, Local 37,<br/>
                    Urb. Caurimare, Parrq. El Cafetal.<br/>
                    Caracas, Venezuela.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="material-symbols-outlined text-primary p-2 bg-primary/10 rounded-lg h-fit">call</span>
                <div>
                  <h4 className="font-title-md text-lg font-bold text-on-surface mb-1">Teléfonos</h4>
                  <p className="text-base text-text-secondary">
                    +58 212 985.3070<br/>
                    +58 212 985.0650
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="material-symbols-outlined text-vibrant-purple p-2 bg-vibrant-purple/10 rounded-lg h-fit">schedule</span>
                <div>
                  <h4 className="font-title-md text-lg font-bold text-on-surface mb-1">Horario de Atención</h4>
                  <p className="text-base text-text-secondary">
                    Lunes a Viernes: 8:00 AM - 5:00 PM<br/>
                    Sábados: 9:00 AM - 1:00 PM
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="material-symbols-outlined text-vibrant-orange p-2 bg-vibrant-orange/10 rounded-lg h-fit">mail</span>
                <div>
                  <h4 className="font-title-md text-lg font-bold text-on-surface mb-1">Correos Electrónicos</h4>
                  <p className="text-base text-text-secondary mb-1">
                    <span className="font-bold">Presupuestos:</span> <br/>
                    <a href="mailto:presupuestos@creatusello.com" className="text-vibrant-teal hover:underline">presupuestos@creatusello.com</a>
                  </p>
                  <p className="text-base text-text-secondary">
                    <span className="font-bold">Contacto General:</span> <br/>
                    <a href="mailto:contacto@creatusello.com" className="text-vibrant-teal hover:underline">contacto@creatusello.com</a>
                  </p>
                </div>
              </div>
            </div>

            <a href="https://share.google/Z33QIbKLwcJrpwsUA" target="_blank" rel="noreferrer" className="relative w-full h-64 rounded-lg overflow-hidden border border-outline-variant group cursor-pointer shadow-inner mt-8 block">
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDJaGV5sjtMyypF6V_E66HysKyFpGDLfcxx55LF807OlrGwBCEvPdJoPet0w-foPToXkFaxvEeKVYPZNJxSTZVnCe12ipr8oYpw3YdZXjoTVNFp2SPy2mxU4QowkDzxsIqfM0MazLeDwWiUcjQSzo1tMS2uB8c52K61B12drLMxEb9qU3yTeRwIWxv-HJA2V8FNc_QzIHRbB9UJvmrOIimOtvoyyT8_WGXkEdD5v0TBwRKgCibUgTKWt04483QA4elO8FlC05ltGa0')" }}></div>
              <div className="absolute inset-0 bg-primary/20 group-hover:bg-transparent transition-colors duration-300"></div>
              <div className="relative z-10 flex flex-col items-center justify-center h-full">
                <span className="material-symbols-outlined text-vibrant-orange text-5xl mb-2 drop-shadow-md" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
                <span className="bg-white/95 px-4 py-2 rounded-full text-xs font-bold shadow-lg border border-outline-variant/50 group-hover:bg-vibrant-teal group-hover:text-white transition-colors">Ver en Google Maps</span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
