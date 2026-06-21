import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import heroBanner from '../assets/hero_banner.png';
import heroCustomize from '../assets/hero_customize.png';

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === 0 ? 1 : 0));
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.reveal-section').forEach(section => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <main>
      <section className="relative h-[650px] overflow-hidden bg-white">
        <div className="h-full" id="hero-slider">
          <div className={`hero-slide absolute inset-0 flex items-center transition-opacity duration-1000 ${currentSlide === 0 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="max-w-[1280px] mx-auto px-10 grid grid-cols-1 md:grid-cols-2 items-center gap-12 w-full">
              <div className="z-10">
                <h1 className="font-display-lg text-5xl font-bold text-primary mb-6">Amplia variedad de opciones de sellos para tí, <span className="text-vibrant-teal">el profesional que eres.</span></h1>
                <p className="text-lg text-text-secondary mb-8 max-w-lg">Calidad industrial y precisión técnica para médicos, abogados, ingenieros y empresas que buscan dejar una marca impecable.</p>
                <div className="flex gap-4">
                  <Link to="/customizer" className="bg-vibrant-teal text-white px-8 py-4 rounded-lg font-bold text-xl shadow-lg shadow-vibrant-teal/30 hover:scale-105 transition-all">Explorar Catálogo</Link>
                  <button className="border-2 border-primary text-primary px-8 py-4 rounded-lg font-bold text-xl hover:bg-primary hover:text-white transition-all">Ver Ofertas</button>
                </div>
              </div>
              <div className="relative flex justify-center items-center group cursor-pointer">
                <div className="absolute w-[500px] h-[500px] bg-vibrant-teal/10 rounded-full blur-3xl group-hover:bg-vibrant-teal/20 transition-all duration-700"></div>
                <img alt="Display professional stamps" className="relative z-10 w-[600px] lg:w-[700px] object-cover rounded-xl animate-float group-hover:scale-110 group-hover:rotate-2 transition-transform duration-700 drop-shadow-2xl shadow-xl" src={heroBanner}/>
              </div>
            </div>
          </div>
          <div className={`hero-slide absolute inset-0 flex items-center transition-opacity duration-1000 ${currentSlide === 1 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="max-w-[1280px] mx-auto px-10 grid grid-cols-1 md:grid-cols-2 items-center gap-12 w-full">
              <div className="z-10">
                <h2 className="font-display-lg text-5xl font-bold text-primary mb-6">Elije, Construye y Solicita <span className="text-vibrant-orange">tu sello</span> desde casa</h2>
                <p className="text-lg text-text-secondary mb-8 max-w-lg">Nuestra plataforma intuitiva te permite personalizar cada detalle en tiempo real. Rápido, fácil y con envío a todo el país.</p>
                <Link to="/customizer" className="bg-vibrant-orange text-white px-8 py-4 rounded-lg font-bold text-xl shadow-lg shadow-vibrant-orange/30 hover:scale-105 transition-all inline-block">Comenzar Diseño</Link>
              </div>
              <div className="relative group cursor-pointer mt-8 md:mt-0">
                <div className="absolute inset-0 bg-vibrant-orange/10 rounded-xl -rotate-3 group-hover:-rotate-6 transition-transform duration-500"></div>
                <img alt="Online customization platform interface" className="relative z-10 w-full lg:w-[650px] h-[450px] lg:h-[550px] object-cover rounded-xl shadow-2xl border-8 border-white group-hover:scale-105 group-hover:shadow-vibrant-orange/30 transition-all duration-700" src={heroCustomize}/>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          <button className={`w-3 h-3 rounded-full transition-all slider-dot ${currentSlide === 0 ? 'active-dot bg-primary' : 'bg-primary/20 hover:bg-primary'}`} onClick={() => setCurrentSlide(0)}></button>
          <button className={`w-3 h-3 rounded-full transition-all slider-dot ${currentSlide === 1 ? 'active-dot bg-primary' : 'bg-primary/20 hover:bg-primary'}`} onClick={() => setCurrentSlide(1)}></button>
        </div>
      </section>

      <section className="reveal-section py-24 px-10 max-w-[1280px] mx-auto">
        <div className="text-center mb-16">
          <span className="text-vibrant-blue font-bold tracking-widest uppercase text-sm">Nuestra Selección</span>
          <h2 className="font-headline-lg text-4xl font-bold text-primary mt-2">Encuentra el sello perfecto</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="group bg-white p-8 rounded-xl border border-outline-variant hover:border-vibrant-teal transition-all hover:shadow-2xl hover:-translate-y-2 cursor-pointer">
            <div className="w-20 h-20 bg-vibrant-teal/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-vibrant-teal group-hover:text-white transition-all">
              <span className="material-symbols-outlined text-4xl text-vibrant-teal group-hover:text-white">move_item</span>
            </div>
            <h3 className="font-title-md text-xl font-bold text-primary mb-2">Portables</h3>
            <p className="text-body-md text-text-secondary">Compactos y elegantes para llevar en el bolsillo. Ideales para médicos y visitadores.</p>
            <div className="mt-6 flex items-center text-vibrant-teal font-bold group-hover:gap-2 transition-all">
              Ver modelos <span className="material-symbols-outlined ml-1">arrow_forward</span>
            </div>
          </div>
          <div className="group bg-white p-8 rounded-xl border border-outline-variant hover:border-vibrant-blue transition-all hover:shadow-2xl hover:-translate-y-2 cursor-pointer">
            <div className="w-20 h-20 bg-vibrant-blue/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-vibrant-blue group-hover:text-white transition-all">
              <span className="material-symbols-outlined text-4xl text-vibrant-blue group-hover:text-white">print</span>
            </div>
            <h3 className="font-title-md text-xl font-bold text-primary mb-2">Automáticos</h3>
            <p className="text-body-md text-text-secondary">El estándar de oficina. Durabilidad excepcional y recarga de tinta sencilla.</p>
            <div className="mt-6 flex items-center text-vibrant-blue font-bold group-hover:gap-2 transition-all">
              Ver modelos <span className="material-symbols-outlined ml-1">arrow_forward</span>
            </div>
          </div>
          <div className="group bg-white p-8 rounded-xl border border-outline-variant hover:border-vibrant-purple transition-all hover:shadow-2xl hover:-translate-y-2 cursor-pointer">
            <div className="w-20 h-20 bg-vibrant-purple/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-vibrant-purple group-hover:text-white transition-all">
              <span className="material-symbols-outlined text-4xl text-vibrant-purple group-hover:text-white">calendar_today</span>
            </div>
            <h3 className="font-title-md text-xl font-bold text-primary mb-2">Fechadores</h3>
            <p className="text-body-md text-text-secondary">Organización impecable con fechas ajustables para recepción de documentos.</p>
            <div className="mt-6 flex items-center text-vibrant-purple font-bold group-hover:gap-2 transition-all">
              Ver modelos <span className="material-symbols-outlined ml-1">arrow_forward</span>
            </div>
          </div>
          <div className="group bg-white p-8 rounded-xl border border-outline-variant hover:border-vibrant-orange transition-all hover:shadow-2xl hover:-translate-y-2 cursor-pointer">
            <div className="w-20 h-20 bg-vibrant-orange/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-vibrant-orange group-hover:text-white transition-all">
              <span className="material-symbols-outlined text-4xl text-vibrant-orange group-hover:text-white">ink_pen</span>
            </div>
            <h3 className="font-title-md text-xl font-bold text-primary mb-2">Tradicionales</h3>
            <p className="text-body-md text-text-secondary">Clásicos sellos de madera con almohadilla externa para un toque artesanal.</p>
            <div className="mt-6 flex items-center text-vibrant-orange font-bold group-hover:gap-2 transition-all">
              Ver modelos <span className="material-symbols-outlined ml-1">arrow_forward</span>
            </div>
          </div>
        </div>
      </section>

      <section className="reveal-section py-24 bg-surface-container-low border-y border-outline-variant/30">
        <div className="max-w-[1280px] mx-auto px-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-2xl">
              <span className="text-vibrant-purple font-bold tracking-widest uppercase text-sm">Proceso Simplificado</span>
              <h2 className="font-headline-lg text-4xl font-bold text-primary mt-2">Pasos para crear tu sello</h2>
              <p className="text-lg text-text-secondary mt-4">Diseñamos una experiencia fluida para que obtengas exactamente lo que necesitas sin complicaciones técnicas.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="relative group overflow-hidden rounded-2xl aspect-[3/4] shadow-xl hover:shadow-vibrant-teal/20 transition-all hover:scale-[1.02]">
              <div className="absolute inset-0 step-gradient-1 opacity-90 transition-transform duration-500 group-hover:scale-110"></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-8 text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-vibrant-teal font-bold text-2xl mb-6 shadow-inner">1</div>
                <span className="material-symbols-outlined text-6xl mb-6" style={{ fontVariationSettings: "'FILL' 1" }}>category</span>
                <h4 className="font-title-md text-xl font-bold mb-4">Selecciona tu base</h4>
                <p className="text-base opacity-90">Explora nuestro catálogo y elige el modelo que mejor se adapte a tu uso diario.</p>
              </div>
            </div>
            <div className="relative group overflow-hidden rounded-2xl aspect-[3/4] shadow-xl hover:shadow-vibrant-blue/20 transition-all hover:scale-[1.02]">
              <div className="absolute inset-0 step-gradient-2 opacity-90 transition-transform duration-500 group-hover:scale-110"></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-8 text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-vibrant-blue font-bold text-2xl mb-6 shadow-inner">2</div>
                <span className="material-symbols-outlined text-6xl mb-6" style={{ fontVariationSettings: "'FILL' 1" }}>edit_note</span>
                <h4 className="font-title-md text-xl font-bold mb-4">Diseña el arte</h4>
                <p className="text-base opacity-90">Usa nuestro editor para agregar texto, logos y ajustar tipografías a tu gusto.</p>
              </div>
            </div>
            <div className="relative group overflow-hidden rounded-2xl aspect-[3/4] shadow-xl hover:shadow-vibrant-purple/20 transition-all hover:scale-[1.02]">
              <div className="absolute inset-0 step-gradient-3 opacity-90 transition-transform duration-500 group-hover:scale-110"></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-8 text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-vibrant-purple font-bold text-2xl mb-6 shadow-inner">3</div>
                <span className="material-symbols-outlined text-6xl mb-6" style={{ fontVariationSettings: "'FILL' 1" }}>send</span>
                <h4 className="font-title-md text-xl font-bold mb-4">Datos de envío</h4>
                <p className="text-base opacity-90">Completa la información de destino para recibir tu sello donde prefieras.</p>
              </div>
            </div>
            <div className="relative group overflow-hidden rounded-2xl aspect-[3/4] shadow-xl hover:shadow-vibrant-orange/20 transition-all hover:scale-[1.02]">
              <div className="absolute inset-0 step-gradient-4 opacity-90 transition-transform duration-500 group-hover:scale-110"></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-8 text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-vibrant-orange font-bold text-2xl mb-6 shadow-inner">4</div>
                <span className="material-symbols-outlined text-6xl mb-6" style={{ fontVariationSettings: "'FILL' 1" }}>payments</span>
                <h4 className="font-title-md text-xl font-bold mb-4">Forma de pago</h4>
                <p className="text-base opacity-90">Paga de forma segura con tarjeta o transferencia. ¡Y listo!</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="reveal-section py-24 px-10 max-w-[1280px] mx-auto overflow-hidden">
        <div className="text-center mb-16">
          <span className="text-vibrant-teal font-bold tracking-widest uppercase text-sm">Testimonios</span>
          <h2 className="font-headline-lg text-4xl font-bold text-primary mt-2">Lo que dicen nuestros clientes</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="group bg-white p-8 rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-outline-variant relative hover:border-vibrant-teal transition-all hover:-translate-y-1">
            <div className="absolute -top-4 left-8 text-vibrant-teal text-6xl font-serif">“</div>
            <p className="text-base text-on-surface mb-8 relative z-10 italic">"Increíble la rapidez y la calidad. Soy médico y necesitaba un sello pequeño pero legible, el modelo portable es perfecto para mis recetas."</p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-vibrant-teal/10 flex items-center justify-center text-vibrant-teal font-bold">L</div>
              <div>
                <p className="font-bold text-primary">Dr. Luis Rodríguez</p>
                <p className="text-sm text-text-secondary">Cardiólogo</p>
              </div>
            </div>
          </div>
          <div className="group bg-white p-8 rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-outline-variant relative hover:border-vibrant-blue transition-all hover:-translate-y-1">
            <div className="absolute -top-4 left-8 text-vibrant-blue text-6xl font-serif">“</div>
            <p className="text-base text-on-surface mb-8 relative z-10 italic">"El editor online es muy intuitivo. Pude subir el logo de mi emprendimiento y el resultado final es idéntico a lo que diseñé. ¡Muy recomendados!"</p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-vibrant-blue/10 flex items-center justify-center text-vibrant-blue font-bold">J</div>
              <div>
                <p className="font-bold text-primary">Johanna Morales</p>
                <p className="text-sm text-text-secondary">Emprendedora Textil</p>
              </div>
            </div>
          </div>
          <div className="group bg-white p-8 rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-outline-variant relative hover:border-vibrant-purple transition-all hover:-translate-y-1">
            <div className="absolute -top-4 left-8 text-vibrant-purple text-6xl font-serif">“</div>
            <p className="text-base text-on-surface mb-8 relative z-10 italic">"Compré los fechadores para mi oficina y son de uso rudo. Han aguantado meses de trabajo intenso sin perder nitidez en la impresión."</p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-vibrant-purple/10 flex items-center justify-center text-vibrant-purple font-bold">M</div>
              <div>
                <p className="font-bold text-primary">María Gómez</p>
                <p className="text-sm text-text-secondary">Adm. de Empresas</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="reveal-section py-24 bg-primary text-white">
        <div className="max-w-[1280px] mx-auto px-10 grid grid-cols-1 lg:grid-cols-2 items-center gap-16">
          <div>
            <h2 className="font-display-lg text-5xl font-bold mb-6 text-white">¿Listo para dejar tu huella?</h2>
            <p className="text-lg opacity-80 mb-10 max-w-lg">Únete a los miles de profesionales que ya confían en nosotros para su papelería corporativa.</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/customizer" className="bg-vibrant-orange text-center text-white px-10 py-5 rounded-lg font-bold text-xl hover:scale-105 transition-transform shadow-2xl shadow-vibrant-orange/40">Empezar ahora</Link>
              <button className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-10 py-5 rounded-lg font-bold text-xl hover:bg-white/20 transition-all">Solicitar Cotización Mayorista</button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-vibrant-teal/10 p-6 rounded-xl backdrop-blur-sm border border-vibrant-teal/20 text-center group hover:bg-vibrant-teal transition-all cursor-default">
              <p className="text-4xl font-bold text-vibrant-teal mb-1 group-hover:text-white">15k+</p>
              <p className="text-xs opacity-60 uppercase tracking-tighter group-hover:text-white">Sellos Entregados</p>
            </div>
            <div className="bg-vibrant-blue/10 p-6 rounded-xl backdrop-blur-sm border border-vibrant-blue/20 text-center group hover:bg-vibrant-blue transition-all cursor-default">
              <p className="text-4xl font-bold text-vibrant-blue mb-1 group-hover:text-white">24h</p>
              <p className="text-xs opacity-60 uppercase tracking-tighter group-hover:text-white">Tiempo de producción</p>
            </div>
            <div className="bg-vibrant-purple/10 p-6 rounded-xl backdrop-blur-sm border border-vibrant-purple/20 text-center group hover:bg-vibrant-purple transition-all cursor-default">
              <p className="text-4xl font-bold text-vibrant-purple mb-1 group-hover:text-white">99%</p>
              <p className="text-xs opacity-60 uppercase tracking-tighter group-hover:text-white">Clientes satisfechos</p>
            </div>
            <div className="bg-vibrant-orange/10 p-6 rounded-xl backdrop-blur-sm border border-vibrant-orange/20 text-center group hover:bg-vibrant-orange transition-all cursor-default">
              <p className="text-4xl font-bold text-vibrant-orange mb-1 group-hover:text-white">FREE</p>
              <p className="text-xs opacity-60 uppercase tracking-tighter group-hover:text-white">Diseño básico online</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
