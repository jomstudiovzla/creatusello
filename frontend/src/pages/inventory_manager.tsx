import { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../lib/firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, getDocs, writeBatch } from 'firebase/firestore';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import ExcelJS from 'exceljs';
import { resolveImageUrl } from '../utils/imageUtils';

export const DEFAULT_PRODUCTS = [
  { type: 'Automático', name: 'Sello Automático Profesional', category: 'Sellos', dim: '38x14mm', price: 19.50, imgUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDGO80G8SQt65AR4wUkYwUltfDs8LoaK32bXFlaJfKyT_FybVmrmvToGmAOZequsS-1f11vX_hKvryQ22HERLz5fn85KAq6YIeRKPj0b2jKIYjManWEE0GVi7Stz0wvlzudRraK1Z8ckuZt2--OmY3XuP5AQLk5mbwV42vk4NukD7Lo0XCbllu24IAHjaOG708LCn0K09vnaHo0oHg5p29HGk5Jyew0Fddc45hsEch8mJ3AqiaOWkWs46GQ1RSLZFrvxrrfImp9jMg", stock: 100, status: 'Óptimo', sku: 'AUTO-01', desc: 'Sello automático autoentintable ideal para uso continuo.' },
  { type: 'Fechador', name: 'Sello Fechador Administrativo', category: 'Sellos', dim: '45x45mm', price: 28.00, imgUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuD9uzK6LWhBjUP--y4ZuRHJh8T7jJvVMzHrgIkZllVmBHZjhJfD2fzEa5arRBtvj1kzNdSnDJdm67pEDxRJQYk0maCpjODRSVoy6mjwrECSo2ki3E_LPMZJBaMcg8RkNVKMh49N9k3Ka4IbPLaRpygvHNLoFB7p6QO9eUHdWmPkGXMjKuNakmBw1lafVn61CnbA675EIjosRncT6CkKs5cQf74SUmFTFb167DF-fR5GyHLfTzCT0dCfr6zCKsxlYbcVywPV-Uas9rI", stock: 50, status: 'Óptimo', sku: 'FECH-01', desc: 'Sello con fechas rotativas para documentación.' },
  { type: 'Tradicional', name: 'Sello Tradicional de Madera', category: 'Sellos', dim: '60x40mm', price: 12.00, imgUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuC_B8aoEYQ_lMmCdugdqu_trQMnSWjcCfcnHLHGe1nkRvIk0R-gyzi0PQXawGKDBKywNl2mibxMcSzd8KLlcPFOJ5KapWEgI7tMvp6Zcm_XYrmhpvHCZinpIiRQ8hgpCgMiHHeYntEczPvBzP7Rpozff3eWMgfgD6h-h5hMxoMQmdMk2TnYk-Na6bZYifA-de_DQ8aFxV_gkIN_Ynqv24HleJM_t5_6EeCMChvwwFNyc7JpSZSMBZYY1mUoLriVXIx2ZZ5uA1QwfD8", stock: 10, status: 'Bajo Stock', sku: 'TRAD-01', desc: 'Sello clásico de madera, requiere almohadilla externa.' },
  { type: 'Portable', name: 'Sello Portable de Bolsillo', category: 'Sellos', dim: '30x30mm', price: 22.00, imgUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDGO80G8SQt65AR4wUkYwUltfDs8LoaK32bXFlaJfKyT_FybVmrmvToGmAOZequsS-1f11vX_hKvryQ22HERLz5fn85KAq6YIeRKPj0b2jKIYjManWEE0GVi7Stz0wvlzudRraK1Z8ckuZt2--OmY3XuP5AQLk5mbwV42vk4NukD7Lo0XCbllu24IAHjaOG708LCn0K09vnaHo0oHg5p29HGk5Jyew0Fddc45hsEch8mJ3AqiaOWkWs46GQ1RSLZFrvxrrfImp9jMg", stock: 75, status: 'Óptimo', sku: 'PORT-01', desc: 'Diseño compacto y plegable, llévalo a todas partes.' },
  { type: 'Almohadilla Negra', name: 'Almohadilla de Tinta Negra', category: 'Repuestos', dim: 'N/A', price: 4.50, imgUrl: "/creatusello/repuestos/almohadilla_tinta_negra.png", stock: 200, status: 'Óptimo', sku: 'REP-ALM-01', desc: 'Almohadilla de recambio con tinta negra para sellos automáticos estándar.' },
  { type: 'Almohadilla Bicolor', name: 'Almohadilla Bicolor (Azul/Rojo)', category: 'Repuestos', dim: 'N/A', price: 5.50, imgUrl: "/creatusello/repuestos/almohadilla_bicolor.png", stock: 150, status: 'Óptimo', sku: 'REP-ALM-02', desc: 'Almohadilla de doble color ideal para sellos fechadores.' },
  { type: 'Goma Grabada', name: 'Goma Personalizada Grabada', category: 'Repuestos', dim: 'Variable', price: 9.00, imgUrl: "/creatusello/repuestos/goma_grabada.png", stock: 500, status: 'Óptimo', sku: 'REP-GOM-01', desc: 'Plantilla de goma cortada a láser con texto o logo personalizado para reemplazo.' },
  { type: 'Tinta Negra', name: 'Frasco de Tinta Líquida Negra 30ml', category: 'Repuestos', dim: '30ml', price: 6.00, imgUrl: "/creatusello/repuestos/frasco_tinta_negra.png", stock: 80, status: 'Óptimo', sku: 'REP-TIN-01', desc: 'Tinta especial para recargar almohadillas de sellos manuales y automáticos.' },
  { type: 'Base Madera', name: 'Base/Montura de Madera Sola', category: 'Repuestos', dim: '60x40mm', price: 5.00, imgUrl: "/creatusello/repuestos/base_madera.png", stock: 30, status: 'Óptimo', sku: 'REP-BAS-01', desc: 'Solo la montura de madera con mango ergonómico sin goma.' },
  { type: 'Lanyard', name: 'Lanyard Corporativo Premium', category: 'Lanyards', dim: '90x2cm', price: 3.50, imgUrl: "/creatusello/repuestos/lanyard_corporativo.png", stock: 300, status: 'Óptimo', sku: 'LAN-CORP-01', desc: 'Correa para el cuello con mosquetón metálico, ideal para portar tu sello.' },
  { type: 'Dije Médico', name: 'Dije Médico (Estetoscopio)', category: 'Accesorios', dim: '2x2cm', price: 2.00, imgUrl: "/creatusello/repuestos/dije_medico.png", stock: 150, status: 'Óptimo', sku: 'ACC-DIJ-MED', desc: 'Elegante dije plateado para personalizar tu sello, con temática médica.' }
];

interface Product {
  id: string;
  type: string;
  dim: string;
  price: number;
  imgUrl: string;
  stock: number;
  status: string;
  sku: string;
}

interface Typography {
  id: string;
  name: string;
  fileUrl: string;
  fontFamily: string;
}

export default function InventoryManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [typographies, setTypographies] = useState<Typography[]>([]);
  const [isUploadingFont, setIsUploadingFont] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  
  // Modals
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    type: '', dim: '', price: 0, stock: 0, status: 'Óptimo', sku: '', imgUrl: ''
  });

  useEffect(() => {
    const unsubProducts = onSnapshot(collection(db, 'products'), (snapshot) => {
      const data = snapshot.docs.map(doc => {
        const item = { id: doc.id, ...doc.data() } as Product;
        item.imgUrl = resolveImageUrl(item.imgUrl);
        return item;
      });
      setProducts(data);
    });
    const unsubTypographies = onSnapshot(collection(db, 'typographies'), (snapshot) => {
      setTypographies(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Typography)));
    });
    return () => {
      unsubProducts();
      unsubTypographies();
    };
  }, []);

  const handleFontUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploadingFont(true);
      const fontName = file.name.split('.')[0];
      
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const base64Url = event.target?.result as string;
          await addDoc(collection(db, 'typographies'), {
            name: fontName,
            fileUrl: base64Url,
            fontFamily: `CustomFont_${Date.now()}`
          });
          alert("Tipografía subida exitosamente.");
        } catch (err) {
          console.error(err);
          alert("Error guardando tipografía en la base de datos.");
        } finally {
          setIsUploadingFont(false);
          e.target.value = '';
        }
      };
      reader.onerror = () => {
        alert("Error al leer el archivo de la tipografía.");
        setIsUploadingFont(false);
        e.target.value = '';
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
      alert("Error inesperado al procesar la tipografía.");
      setIsUploadingFont(false);
      e.target.value = '';
    }
  };

  const handleDeleteFont = async (typography: Typography) => {
    if (!confirm(`¿Eliminar la tipografía ${typography.name}?`)) return;
    try {
      await deleteDoc(doc(db, 'typographies', typography.id));
      // Intentar borrar de storage si es posible, aunque requeriría parsear la url o guardar el path.
    } catch (err) {
      console.error(err);
      alert("Error eliminando la tipografía");
    }
  };

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Strict frontend validation
    if (!file.type.startsWith('image/')) {
      alert("Solo se permiten archivos de imagen (PNG, JPG, etc).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      alert("El archivo es demasiado grande. El límite es 5MB.");
      return;
    }

    setIsUploadingImage(true);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.85); // 85% quality compression
          setFormData(prev => ({ ...prev, imgUrl: dataUrl }));
        } else {
          alert("Error procesando imagen.");
        }
        setIsUploadingImage(false);
      };
      img.src = event.target?.result as string;
    };
    reader.onerror = () => {
      alert("Error al leer la imagen.");
      setIsUploadingImage(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProduct = async (e: FormEvent) => {
    e.preventDefault();
    setIsImporting(true);
    try {
      let finalImgUrl = formData.imgUrl;

      // Auto-download external URLs and convert to Base64
      if (finalImgUrl && finalImgUrl.startsWith('http') && !finalImgUrl.startsWith('data:')) {
        try {
          const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(finalImgUrl)}`;
          const response = await fetch(proxyUrl);
          if (response.ok) {
            const blob = await response.blob();
            const reader = new FileReader();
            finalImgUrl = await new Promise((resolve) => {
              reader.onloadend = () => resolve(reader.result as string);
              reader.readAsDataURL(blob);
            });
          }
        } catch (downloadErr) {
          console.warn("No se pudo descargar la imagen externa, se mantendrá la URL original.", downloadErr);
        }
      }

      const productToSave = { ...formData, imgUrl: finalImgUrl };
      
      if (editingProduct) {
        await updateDoc(doc(db, 'products', editingProduct.id), productToSave);
      } else {
        await addDoc(collection(db, 'products'), productToSave);
      }
      setIsProductModalOpen(false);
      setEditingProduct(null);
      setFormData({ type: '', dim: '', price: 0, stock: 0, status: 'Óptimo', sku: '', imgUrl: '' });
      alert(editingProduct ? 'Producto actualizado con éxito' : 'Producto agregado con éxito');
    } catch (err) {
      console.error('Error al guardar el producto:', err);
      alert('Error al guardar el producto');
    } finally {
      setIsImporting(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("¿Seguro que deseas eliminar este producto?")) return;
    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (err) {
      console.error(err);
      alert("Error eliminando producto");
    }
  };

  const openNewProductModal = () => {
    setEditingProduct(null);
    setFormData({ type: '', dim: '', price: 0, stock: 0, status: 'Óptimo', sku: '', imgUrl: '' });
    setIsProductModalOpen(true);
  };

  const openEditProductModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      type: product.type, dim: product.dim, price: product.price,
      stock: product.stock, status: product.status, sku: product.sku, imgUrl: product.imgUrl
    });
    setIsProductModalOpen(true);
  };

  const processImportedData = async (jsonData: any[]) => {
    // Primero borrar el catálogo actual
    const snapshot = await getDocs(collection(db, 'products'));
    const batch = writeBatch(db);
    snapshot.docs.forEach(d => {
      batch.delete(d.ref);
    });
    await batch.commit();

    let importedCount = 0;
    for (const row of jsonData) {
      const sku = row.SKU || row.sku;
      const nombre = row['Nombre del Producto'] || row.Nombre || row.name || row.type || row.Producto;
      
      if (!sku || !nombre) continue;
      
      let rawUrl = row['URL de Imagen (Para CSV)'] || row.Imagen || row.imgUrl || '';
      
      // Auto-download external URLs and convert to Base64 during CSV/Excel import
      if (rawUrl && rawUrl.startsWith('http') && !rawUrl.startsWith('data:')) {
        try {
          const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(rawUrl)}`;
          const response = await fetch(proxyUrl);
          if (response.ok) {
            const blob = await response.blob();
            const reader = new FileReader();
            rawUrl = await new Promise((resolve) => {
              reader.onloadend = () => resolve(reader.result as string);
              reader.readAsDataURL(blob);
            });
          }
        } catch(err) {
          console.warn("Falló la descarga de imagen para la fila, se conservará la URL original", row, err);
        }
      }

      const newProduct = {
        sku: sku,
        type: nombre,
        category: row.Categoría || row.Categoria || row.category || '',
        dim: row.Dimensiones || row.dim || '',
        price: parseFloat(row['Precio (€)'] || row.Precio_EUR || row.price) || 0,
        stock: parseInt(row.Stock || row.stock) || 0,
        status: row.Estado || 'Óptimo',
        imgUrl: rawUrl, 
        desc: row.Descripción || row.Descripcion || row.desc || ''
      };
      await addDoc(collection(db, 'products'), newProduct);
      importedCount++;
    }
    return importedCount;
  };

  const handleImportFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsImporting(true);
    
    try {
      const isExcel = file.name.endsWith('.xlsx') || file.name.endsWith('.xls');
      
      if (isExcel) {
        const buffer = await file.arrayBuffer();
        
        // 1. Read textual data using XLSX (reliable JSON mapping)
        const workbookXLSX = XLSX.read(buffer, { type: 'array' });
        const firstSheetName = workbookXLSX.SheetNames[0];
        const worksheetXLSX = workbookXLSX.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json<any>(worksheetXLSX, { defval: '' });
        
        // 2. Extract embedded images using ExcelJS
        try {
          const workbookExcelJS = new ExcelJS.Workbook();
          await workbookExcelJS.xlsx.load(buffer);
          const worksheetExcelJS = workbookExcelJS.worksheets[0];
          const images = worksheetExcelJS.getImages();
          
          for (const image of images) {
            // tl.row is 0-indexed. Row 0 is header. Data starts at tl.row >= 1.
            const jsonIndex = (image.range.tl.nativeRow !== undefined ? image.range.tl.nativeRow : image.range.tl.row) - 1;
            
            if (jsonIndex >= 0 && jsonIndex < jsonData.length) {
              const imgMedia = workbookExcelJS.getImage(Number(image.imageId));
              if (imgMedia && imgMedia.buffer) {
                // Convert to Base64
                const blob = new Blob([imgMedia.buffer], { type: `image/${imgMedia.extension}` });
                const reader = new FileReader();
                const url = await new Promise<string>((resolve) => {
                  reader.onloadend = () => resolve(reader.result as string);
                  reader.readAsDataURL(blob);
                });
                
                // Assign URL to jsonData
                jsonData[jsonIndex].imgUrl = url;
              }
            }
          }
        } catch (imgErr) {
          console.warn("Could not extract embedded images, continuing with text data.", imgErr);
        }
        
        const importedCount = await processImportedData(jsonData);
        alert(`¡Importación exitosa! Se han añadido ${importedCount} productos desde Excel.`);
      } else {
        // Assume CSV
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          complete: async (results) => {
            try {
              const importedCount = await processImportedData(results.data);
              alert(`¡Importación exitosa! Se han añadido ${importedCount} productos desde CSV.`);
            } catch (err) {
              console.error("Error procesando datos CSV:", err);
              alert("Ocurrió un error al procesar el CSV.");
            }
          },
          error: (err) => {
            console.error(err);
            alert("Error al leer el archivo CSV.");
          }
        });
      }
    } catch (err) {
      console.error("Error importando archivo:", err);
      alert("Ocurrió un error al importar el archivo.");
    } finally {
      setIsImporting(false);
      e.target.value = '';
    }
  };

  const handleMigrateCatalog = async () => {
    if (!confirm("¿Deseas restaurar el catálogo base? Esto añadirá los 4 productos originales.")) return;
    try {
      // Primero borrar el catálogo actual para evitar duplicados
      const snapshot = await getDocs(collection(db, 'products'));
      const batch = writeBatch(db);
      snapshot.docs.forEach(d => {
        batch.delete(d.ref);
      });
      await batch.commit();

      for (const m of DEFAULT_PRODUCTS) {
        await addDoc(collection(db, 'products'), m);
      }
      alert("Catálogo restaurado.");
    } catch (err) {
      console.error(err);
      alert("Error restaurando catálogo.");
    }
  };

  return (
    <main className="pt-24 min-h-screen bg-background">
      <style>{`
        .sidebar-active { background: linear-gradient(135deg, #2563EB 0%, #7C3AED 100%); color: white; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
      `}</style>

      {/* Modals */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-outline-variant flex justify-between items-center bg-surface-container-lowest shrink-0">
              <h2 className="text-xl font-bold text-on-surface">{editingProduct ? 'Editar Producto' : 'Nuevo Producto'}</h2>
              <button onClick={() => setIsProductModalOpen(false)} className="text-on-surface-variant hover:text-error transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto custom-scrollbar">
              <form id="productForm" onSubmit={handleSaveProduct} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-on-surface mb-1">Nombre / Tipo</label>
                    <input required value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full border border-outline-variant rounded-lg p-2.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none" placeholder="Ej: Sello Automático" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-on-surface mb-1">SKU</label>
                    <input required value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} className="w-full border border-outline-variant rounded-lg p-2.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none" placeholder="Ej: SAP-004" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-on-surface mb-1">Dimensiones</label>
                    <input required value={formData.dim} onChange={e => setFormData({...formData, dim: e.target.value})} className="w-full border border-outline-variant rounded-lg p-2.5 focus:border-primary outline-none" placeholder="Ej: 40x40mm" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-on-surface mb-1">Precio (EUR base)</label>
                    <input type="number" step="0.01" required value={formData.price} onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})} className="w-full border border-outline-variant rounded-lg p-2.5 focus:border-primary outline-none" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-on-surface mb-1">Stock</label>
                    <input type="number" required value={formData.stock} onChange={e => setFormData({...formData, stock: parseInt(e.target.value)})} className="w-full border border-outline-variant rounded-lg p-2.5 focus:border-primary outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-on-surface mb-1">Estado</label>
                    <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full border border-outline-variant rounded-lg p-2.5 focus:border-primary outline-none bg-white">
                      <option value="Óptimo">Óptimo</option>
                      <option value="Moderado">Moderado</option>
                      <option value="Bajo Stock">Bajo Stock</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-on-surface mb-1">Imagen del Producto</label>
                  <div className="flex gap-4 items-center">
                    {formData.imgUrl && <img src={formData.imgUrl} className="w-16 h-16 rounded-lg object-cover border" alt="Preview" />}
                    <label className="flex-1 border-2 border-dashed border-outline-variant rounded-lg p-4 text-center cursor-pointer hover:bg-surface-container-low transition-colors">
                      {isUploadingImage ? <span className="animate-pulse">Subiendo...</span> : <span className="text-sm font-semibold text-primary">Subir Imagen</span>}
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isUploadingImage} />
                    </label>
                  </div>
                </div>
              </form>
            </div>

            <div className="p-6 border-t border-outline-variant bg-surface-container-lowest shrink-0 flex justify-end gap-3">
              <button type="button" onClick={() => setIsProductModalOpen(false)} className="px-5 py-2.5 rounded-lg font-bold text-on-surface-variant hover:bg-surface-container-low transition-colors">Cancelar</button>
              <button form="productForm" type="submit" className="px-5 py-2.5 bg-primary text-white rounded-lg font-bold hover:opacity-90 transition-opacity" disabled={!formData.imgUrl || isUploadingImage}>
                Guardar Producto
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-[1280px] mx-auto px-10 py-8 flex flex-col lg:flex-row gap-6">
        <aside className="w-full lg:w-[360px] shrink-0">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-surface-container">
            <h2 className="font-title-md text-xl font-bold text-primary mb-6">Administración</h2>
            <ul className="space-y-2">
              <li>
                <Link to="/admin/inventory" className="flex items-center gap-3 px-4 py-3 rounded-lg sidebar-active transition-all shadow-lg shadow-vibrant-blue/20">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>inventory_2</span>
                  <span className="font-title-md text-lg font-bold">Inventario & Tipografías</span>
                </Link>
              </li>
              <li>
                <Link to="/admin/orders" className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface-container-low transition-all">
                  <span className="material-symbols-outlined">receipt_long</span>
                  <span className="font-title-md text-lg font-bold">Pedidos</span>
                </Link>
              </li>
            </ul>
          </div>
        </aside>

        <div className="flex-1 space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="font-headline-lg text-3xl font-bold text-text-primary">Gestión de Inventario</h1>
              <p className="text-text-secondary text-base">Administra el stock, dimensiones y recursos tipográficos de tus productos.</p>
            </div>
            <div className="flex gap-3">
              <label className={`flex items-center gap-2 px-4 py-3 rounded-lg font-bold text-sm border border-outline-variant transition-all cursor-pointer ${isImporting ? 'bg-surface-container-highest text-text-secondary cursor-not-allowed' : 'bg-surface-container-low text-primary hover:bg-surface-container-highest'}`}>
                <span className="material-symbols-outlined text-[18px]">{isImporting ? 'hourglass_empty' : 'upload_file'}</span> 
                {isImporting ? 'Importando...' : 'Importar Archivo'}
                <input 
                  type="file" 
                  accept=".csv, .xlsx, .xls" 
                  className="hidden" 
                  onChange={handleImportFile} 
                  disabled={isImporting} 
                />
              </label>
              <button onClick={handleMigrateCatalog} className="flex items-center gap-2 bg-surface-container-low text-primary px-4 py-3 rounded-lg font-bold text-sm border border-outline-variant hover:bg-surface-container-highest transition-all">
                <span className="material-symbols-outlined text-[18px]">restore</span> Restaurar Catálogo
              </button>
              <button onClick={openNewProductModal} className="flex items-center gap-2 bg-vibrant-orange text-white px-6 py-3 rounded-lg font-bold text-lg hover:scale-105 active:scale-95 transition-all shadow-lg shadow-vibrant-orange/30">
                <span className="material-symbols-outlined">add</span> Nuevo Producto
              </button>
            </div>
          </div>

          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-white border border-surface-container rounded-xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <span className="material-symbols-outlined text-[120px] text-vibrant-purple">text_fields</span>
              </div>
              <h3 className="font-title-md text-xl font-bold text-primary mb-4">Gestión de Tipografías</h3>
              <p className="text-on-surface-variant text-base mb-6 max-w-lg">Sube archivos .ttf o .otf para integrarlos automáticamente en el configurador de sellos.</p>
              
              <label className="border-2 border-dashed border-outline-variant rounded-xl p-10 flex flex-col items-center justify-center bg-surface-container-low hover:border-vibrant-blue transition-all cursor-pointer group">
                {isUploadingFont ? (
                  <div className="animate-pulse flex flex-col items-center">
                    <span className="material-symbols-outlined text-4xl text-vibrant-blue mb-4">sync</span>
                    <p className="text-vibrant-blue font-semibold">Subiendo tipografía...</p>
                  </div>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-4xl text-outline group-hover:text-vibrant-blue mb-4 transition-transform group-hover:-translate-y-1">cloud_upload</span>
                    <p className="text-on-surface text-base font-semibold group-hover:text-vibrant-blue">Haz clic para subir archivos</p>
                    <p className="text-outline text-xs mt-2 uppercase tracking-wider">TTF, OTF (Max. 10MB)</p>
                  </>
                )}
                <input accept=".ttf,.otf" className="hidden" type="file" onChange={handleFontUpload} disabled={isUploadingFont} />
              </label>
            </div>

            <div className="bg-white border border-surface-container rounded-xl p-6 flex flex-col max-h-[300px]">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-title-md text-xl font-bold text-primary">Fuentes Activas</h4>
                <span className="bg-vibrant-purple text-white text-xs px-2 py-1 rounded-full font-bold">{typographies.length} Total</span>
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3">
                {typographies.length === 0 ? (
                  <p className="text-sm text-outline italic text-center mt-10">Ninguna tipografía subida aún.</p>
                ) : typographies.map(font => (
                  <div key={font.id} className="flex items-center justify-between p-3 rounded-lg border border-outline-variant bg-surface-bright hover:bg-surface-container-lowest transition-colors">
                    <span className="text-sm font-semibold truncate max-w-[150px]">{font.name}</span>
                    <button onClick={() => handleDeleteFont(font)} className="text-error hover:scale-125 transition-transform">
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="bg-white border border-surface-container rounded-xl overflow-hidden">
            <div className="px-8 py-6 border-b border-surface-container flex justify-between items-center">
              <h3 className="font-title-md text-xl font-bold text-primary">Niveles de Stock y Dimensiones</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-surface-container-low text-left">
                    <th className="px-8 py-4 text-xs uppercase tracking-widest text-outline">Producto</th>
                    <th className="px-6 py-4 text-xs uppercase tracking-widest text-outline text-center">Dimensiones</th>
                    <th className="px-6 py-4 text-xs uppercase tracking-widest text-outline text-center">Stock</th>
                    <th className="px-6 py-4 text-xs uppercase tracking-widest text-outline">Estado</th>
                    <th className="px-8 py-4 text-xs uppercase tracking-widest text-outline text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container">
                  {products.length === 0 ? (
                    <tr><td colSpan={5} className="py-10 text-center text-outline">No hay productos registrados.</td></tr>
                  ) : products.map(product => (
                    <tr key={product.id} className="hover:bg-surface-container-lowest transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <img alt={product.type} className="w-12 h-12 rounded object-cover border" src={product.imgUrl} />
                          <div>
                            <div className="font-title-md text-lg font-bold text-on-surface">{product.type}</div>
                            <div className="text-xs text-outline">SKU: {product.sku}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6 text-center">
                        <span className="bg-surface-container-highest px-3 py-1 rounded text-xs text-on-surface-variant">{product.dim}</span>
                      </td>
                      <td className="px-6 py-6 text-center">
                        <span className="text-base font-bold text-on-surface">{product.stock}</span>
                      </td>
                      <td className="px-6 py-6">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase ${
                          product.status === 'Óptimo' ? 'text-vibrant-teal bg-vibrant-teal/10' : 
                          product.status === 'Moderado' ? 'text-vibrant-purple bg-vibrant-purple/10' : 
                          'text-vibrant-orange bg-vibrant-orange/10'
                        }`}>
                          {product.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button onClick={() => openEditProductModal(product)} className="p-2 text-on-surface-variant hover:text-vibrant-blue transition-colors">
                          <span className="material-symbols-outlined">edit</span>
                        </button>
                        <button onClick={() => handleDeleteProduct(product.id)} className="p-2 text-on-surface-variant hover:text-error transition-colors">
                          <span className="material-symbols-outlined">delete</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
