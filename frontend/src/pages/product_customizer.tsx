import { useState, useRef, useEffect, type ChangeEvent } from 'react';
import { useStore } from '../store/useStore';
import { db } from '../lib/firebase';
import { collection, onSnapshot, addDoc } from 'firebase/firestore';
import { resolveImageUrl, preloadImages } from '../utils/imageUtils';

export default function ProductCustomizer() {
  const [text, setText] = useState("");
  const [fontFamily, setFontFamily] = useState("Montserrat");
  
  const [products, setProducts] = useState<any[]>([]);
  const [typographies, setTypographies] = useState<any[]>([]);
  const [model, setModel] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [logoData, setLogoData] = useState<string | null>(null);
  const [fontFile, setFontFile] = useState<File | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const { user, addToCart, currency, exchangeRates, openCart } = useStore();

  useEffect(() => {
    const unsubProducts = onSnapshot(collection(db, 'products'), (snapshot) => {
      const data = snapshot.docs.map(doc => {
        const item = { id: doc.id, ...doc.data() } as any;
        item.imgUrl = resolveImageUrl(item.imgUrl);
        return item;
      });
      setProducts(data);
      preloadImages(data.map(p => p.imgUrl));
      if (data.length > 0 && !model) {
        const defaultStamps = data.filter((m: any) => !m.category || m.category.toLowerCase() === 'sellos');
        if (defaultStamps.length > 0) {
          setModel(defaultStamps[0]);
        }
      }
    });

    const unsubFonts = onSnapshot(collection(db, 'typographies'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        .filter((f: any) => !f.userId || (user && f.userId === user.uid));
      setTypographies(data);
      data.forEach(async (font: any) => {
        try {
          const fontFace = new FontFace(font.fontFamily, `url(${font.fileUrl})`);
          await fontFace.load();
          document.fonts.add(fontFace);
        } catch (e) {
          console.error('Error loading dynamic font:', e);
        }
      });
      setIsLoading(false);
    });

    return () => {
      unsubProducts();
      unsubFonts();
    };
  }, [user]);

  const formatPrice = (baseEurPrice: number) => {
    const rate = exchangeRates[currency] || 1;
    const converted = baseEurPrice * rate;
    if (currency === 'VES') return `Bs. ${converted.toFixed(2)}`;
    if (currency === 'USD') return `$${converted.toFixed(2)}`;
    return `${converted.toFixed(2)}€`;
  };

  const handleFontUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      const fontName = 'CustomUserFont_' + Date.now();
      
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64Url = event.target?.result as string;
        try {
          const fontFace = new FontFace(fontName, `url(${base64Url})`);
          await fontFace.load();
          document.fonts.add(fontFace);
          setFontFamily(fontName);
          setFontFile(file);
          
          if (user) {
            await addDoc(collection(db, 'typographies'), {
              name: file.name.split('.')[0],
              fileUrl: base64Url,
              fontFamily: fontName,
              userId: user.uid
            });
          } else {
             // For guests, add it locally so it shows in the list
             setTypographies(prev => [...prev, { fontFamily: fontName, name: fontName, fileUrl: base64Url }]);
          }
        } catch (innerErr) {
          console.error("Error cargando o guardando fuente:", innerErr);
        }
      };
      reader.readAsDataURL(file);

    } catch (err) {
      console.error("Error loading font:", err);
      alert("Error al cargar la tipografía. Por favor intenta con otro archivo.");
    }
  };

  const handleLogoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogoData(event.target?.result as string);
        setLogoFile(file);
      };
      reader.readAsDataURL(file);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center bg-surface-canvas min-h-[calc(100vh-80px)]">
        <span className="material-symbols-outlined text-4xl text-primary animate-spin">refresh</span>
        <p className="mt-4 font-bold text-primary">Cargando catálogo dinámico...</p>
      </div>
    );
  }

  if (!model) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center bg-surface-canvas min-h-[calc(100vh-80px)]">
        <span className="material-symbols-outlined text-6xl text-outline mb-4">inventory_2</span>
        <h2 className="text-2xl font-bold text-on-surface">No hay sellos disponibles</h2>
        <p className="mt-2 text-on-surface-variant">El administrador aún no ha publicado modelos de sellos personalizables.</p>
      </div>
    );
  }

  return (
    <main className="flex-grow flex flex-col md:flex-row max-w-[1920px] mx-auto w-full h-[calc(100vh-80px)] overflow-hidden">
      {/* Left Panel: Compact Controls */}
      <aside className="w-full md:w-[320px] bg-[#ffffff] border-r border-outline-variant p-6 flex flex-col gap-6 overflow-y-auto shrink-0">
        <section>
          <h1 className="font-headline-lg text-2xl font-bold text-text-primary mb-1">Configurador</h1>
          <p className="text-text-secondary text-xs">Personaliza tu sello profesional.</p>
        </section>

        {/* Text Input */}
        <div className="space-y-2">
          <label className="block font-title-md text-sm font-bold text-primary" htmlFor="stamp-text">Escribe tu texto</label>
          <textarea 
            className="w-full p-3 border border-outline rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none h-20 text-sm bg-white text-on-surface" 
            id="stamp-text" 
            placeholder="Tu texto aquí..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          ></textarea>
        </div>

        {/* Font Selector */}
        <div className="space-y-2">
          <label className="block font-title-md text-sm font-bold text-primary">Tipografía</label>
          <div className="grid grid-cols-2 gap-2">
            {["Montserrat", "Roboto Flex", "Playfair Display", "monospace", ...typographies.map(t => t.fontFamily)].map(font => (
              <button 
                key={font}
                className={`p-2 border rounded-lg text-xs text-left hover:bg-surface-container bg-white transition-all ${fontFamily === font ? 'border-primary ring-1 ring-primary' : 'border-outline-variant'}`}
                style={{ fontFamily: font }}
                onClick={() => setFontFamily(font)}
              >
                {font.split('_')[0]}
              </button>
            ))}
          </div>
          
          <div className="mt-2 space-y-1">
            <div 
              className="border border-dashed border-primary/50 rounded-lg p-2 text-center cursor-pointer bg-primary/5 hover:bg-primary/10 transition-colors flex items-center justify-center gap-1" 
              onClick={() => fileInputRef.current?.click()}
            >
              <span className="material-symbols-outlined text-sm text-primary">upload_file</span>
              <span className="text-xs text-primary font-bold">Subir tipografía</span>
              <input ref={fileInputRef} onChange={handleFontUpload} accept=".ttf,.otf" className="hidden" type="file"/>
            </div>
          </div>
        </div>

        {/* Stamp Type */}
        <div className="space-y-2">
          <label className="block font-title-md text-sm font-bold text-primary">Tipo de Sello</label>
          <div className="grid grid-cols-1 gap-2">
            {products.filter((m: any) => !m.category || m.category.toLowerCase() === 'sellos').map((m: any) => (
              <button 
                key={m.id}
                className={`flex items-center justify-between p-3 border rounded-lg transition-colors ${model.type === m.type ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-outline-variant bg-white hover:bg-surface-container-low'}`}
                onClick={() => setModel(m)}
              >
                <div className="flex items-center gap-2">
                  <span className={`material-symbols-outlined text-[18px] ${model.type === m.type ? 'text-primary' : 'text-on-surface-variant'}`}>
                    {m.type === 'Automático' ? 'print' : m.type === 'Fechador' ? 'calendar_today' : m.type === 'Tradicional' ? 'ink_pen' : 'move_item'}
                  </span>
                  <span className="font-bold text-sm text-on-surface">{m.type}</span>
                </div>
                <span className="text-technical-gray text-xs">{m.dim}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Logo Upload */}
        <div className="space-y-2">
          <label className="block font-title-md text-sm font-bold text-primary">Logotipo (PNG)</label>
          <div 
            className="border border-dashed border-outline-variant rounded-lg p-4 text-center cursor-pointer hover:bg-surface-container-low transition-colors group flex flex-col items-center"
            onClick={() => logoInputRef.current?.click()}
          >
            <span className="material-symbols-outlined text-2xl text-outline mb-1 group-hover:text-primary">cloud_upload</span>
            <p className="text-xs text-text-secondary">Clic para subir PNG</p>
            <input ref={logoInputRef} onChange={handleLogoUpload} accept="image/png" className="hidden" type="file"/>
          </div>
        </div>
      </aside>

      {/* Right Side: Live Preview & Action Panel */}
      <section className="flex-grow bg-[#f7f9fb] canvas-bg flex flex-col xl:flex-row items-center justify-center p-6 gap-8 overflow-y-auto relative">
        <div className="absolute top-6 left-6 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full border border-primary/20 flex items-center gap-2 shadow-sm z-10">
          <div className="w-2 h-2 bg-success-green rounded-full live-rendering-pulse"></div>
          <span className="text-[10px] text-primary uppercase font-bold tracking-widest">Live Rendering</span>
        </div>

        {/* Worktable (Canvas Area) - Made larger */}
        <div className="flex-grow w-full max-w-3xl flex flex-col items-center justify-center gap-8 min-h-[400px]">
          {/* Physical Stamp Image */}
          <div className="relative group cursor-zoom-in transition-transform duration-500 hover:scale-105">
            <img 
              className="w-[200px] lg:w-[250px] max-h-[300px] drop-shadow-2xl transition-opacity duration-300 rounded-lg object-contain" 
              alt={`Sello ${model.type}`}
              src={model.imgUrl}
            />
          </div>

          {/* Imprint Canvas */}
          <div className="bg-white p-10 rounded-xl shadow-inner border border-outline-variant/30 flex items-center justify-center min-w-[350px] min-h-[180px] relative overflow-hidden">
            <div className="border-2 border-dashed border-outline-variant/50 w-full h-full p-6 flex flex-col items-center justify-center gap-3">
              
              {/* Dynamic Content */}
              {logoData ? (
                <img src={logoData} className="max-h-32 max-w-full stamp-texture opacity-80 mb-2" style={{ filter: 'grayscale(1) contrast(200%)' }} />
              ) : (
                <div className="w-20 h-20 opacity-30 flex items-center justify-center border border-dashed border-outline-variant rounded mb-2">
                  <span className="material-symbols-outlined text-outline text-3xl">image</span>
                </div>
              )}
              
              <div 
                className="text-center font-bold text-3xl text-primary stamp-texture break-words max-w-sm transition-all stamp-text-truncate w-full px-4" 
                style={{ fontFamily: fontFamily }}
                title={text.trim() === "" ? "TU TEXTO AQUÍ" : text}
              >
                {text.trim() === "" ? "TU TEXTO AQUÍ" : text}
              </div>

              {/* Technical Overlay */}
              <div className="absolute bottom-3 right-3 bg-technical-gray/10 text-technical-gray px-2 py-1 rounded text-xs font-mono">
                {model.dim.replace('x', 'mm x ')}
              </div>
            </div>
          </div>
        </div>

        {/* Action Panel: "Modelo Seleccionado" and Add to Cart */}
        <div className="w-full xl:w-[320px] shrink-0 bg-white shadow-xl rounded-2xl p-6 border border-outline-variant flex flex-col gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <div className="bg-vibrant-teal/10 p-3 rounded-xl shrink-0">
              <span className="material-symbols-outlined text-vibrant-teal text-2xl">check_circle</span>
            </div>
            <div>
              <p className="text-xs text-text-secondary uppercase font-bold tracking-tight mb-1">Modelo Seleccionado</p>
              <h3 className="font-title-md text-xl font-bold text-primary">{model.type} Professional</h3>
              <p className="text-xs text-success-green flex items-center gap-1 font-bold mt-1">
                En Stock - Envío 24h
              </p>
            </div>
          </div>
          
          <div className="border-t border-outline-variant pt-4">
            <div className="flex justify-between items-end mb-4">
              <span className="text-sm text-text-secondary">Precio</span>
              <div className="text-right">
                <p className="text-xs text-text-secondary line-through">{formatPrice(model.price * 1.2)}</p>
                <p className="text-3xl font-bold text-primary">{formatPrice(model.price)}</p>
              </div>
            </div>

            <button 
              onClick={() => {
                addToCart({
                  id: Date.now().toString(),
                  model,
                  text,
                  fontFamily,
                  fontFile,
                  logoFile,
                  logoDataUrl: logoData,
                  quantity: 1
                });
                openCart();
              }}
              className="w-full bg-vibrant-blue text-white py-4 rounded-xl font-bold text-lg hover:bg-primary active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg shadow-vibrant-blue/30"
            >
              <span className="material-symbols-outlined">add_shopping_cart</span>
              Añadir al Carrito
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
