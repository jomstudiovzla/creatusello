const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');
const downloadImageBase64 = async (url) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch ${url}`);
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer).toString('base64');
};

const PRODUCTS = [
  { sku: 'AUTO-01', name: 'Sello Automático Profesional', category: 'Sellos', dim: '38x14mm', price: '19.50', stock: 100, desc: 'Sello automático autoentintable ideal para uso continuo y profesional.', imgUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDGO80G8SQt65AR4wUkYwUltfDs8LoaK32bXFlaJfKyT_FybVmrmvToGmAOZequsS-1f11vX_hKvryQ22HERLz5fn85KAq6YIeRKPj0b2jKIYjManWEE0GVi7Stz0wvlzudRraK1Z8ckuZt2--OmY3XuP5AQLk5mbwV42vk4NukD7Lo0XCbllu24IAHjaOG708LCn0K09vnaHo0oHg5p29HGk5Jyew0Fddc45hsEch8mJ3AqiaOWkWs46GQ1RSLZFrvxrrfImp9jMg" },
  { sku: 'FECH-01', name: 'Sello Fechador Administrativo', category: 'Sellos', dim: '45x45mm', price: '28.00', stock: 50, desc: 'Sello con bandas de goma para fechas y texto personalizado superior.', imgUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuD9uzK6LWhBjUP--y4ZuRHJh8T7jJvVMzHrgIkZllVmBHZjhJfD2fzEa5arRBtvj1kzNdSnDJdm67pEDxRJQYk0maCpjODRSVoy6mjwrECSo2ki3E_LPMZJBaMcg8RkNVKMh49N9k3Ka4IbPLaRpygvHNLoFB7p6QO9eUHdWmPkGXMjKuNakmBw1lafVn61CnbA675EIjosRncT6CkKs5cQf74SUmFTFb167DF-fR5GyHLfTzCT0dCfr6zCKsxlYbcVywPV-Uas9rI" },
  { sku: 'TRAD-01', name: 'Sello Tradicional de Madera', category: 'Sellos', dim: '60x40mm', price: '12.00', stock: 10, desc: 'Sello clásico con montura de madera barnizada. Requiere almohadilla externa.', imgUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuC_B8aoEYQ_lMmCdugdqu_trQMnSWjcCfcnHLHGe1nkRvIk0R-gyzi0PQXawGKDBKywNl2mibxMcSzd8KLlcPFOJ5KapWEgI7tMvp6Zcm_XYrmhpvHCZinpIiRQ8hgpCgMiHHeYntEczPvBzP7Rpozff3eWMgfgD6h-h5hMxoMQmdMk2TnYk-Na6bZYifA-de_DQ8aFxV_gkIN_Ynqv24HleJM_t5_6EeCMChvwwFNyc7JpSZSMBZYY1mUoLriVXIx2ZZ5uA1QwfD8" },
  { sku: 'PORT-01', name: 'Sello Portable de Bolsillo', category: 'Sellos', dim: '30x30mm', price: '22.00', stock: 75, desc: 'Sello compacto y ligero para llevar a cualquier parte.', imgUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDGO80G8SQt65AR4wUkYwUltfDs8LoaK32bXFlaJfKyT_FybVmrmvToGmAOZequsS-1f11vX_hKvryQ22HERLz5fn85KAq6YIeRKPj0b2jKIYjManWEE0GVi7Stz0wvlzudRraK1Z8ckuZt2--OmY3XuP5AQLk5mbwV42vk4NukD7Lo0XCbllu24IAHjaOG708LCn0K09vnaHo0oHg5p29HGk5Jyew0Fddc45hsEch8mJ3AqiaOWkWs46GQ1RSLZFrvxrrfImp9jMg" },
  { sku: 'REP-ALM-01', name: 'Almohadilla de Tinta Negra', category: 'Repuestos', dim: 'N/A', price: '4.50', stock: 200, desc: 'Almohadilla de recambio con tinta negra para sellos automáticos estándar.', localImg: "/Users/macbook/.gemini/antigravity-ide/brain/49244f42-fd6a-4008-83e6-85d98593395b/almohadilla_tinta_negra_1782045917957.png", imgUrl: "/creatusello/repuestos/almohadilla_tinta_negra.png" },
  { sku: 'REP-ALM-02', name: 'Almohadilla Bicolor (Azul/Rojo)', category: 'Repuestos', dim: 'N/A', price: '5.50', stock: 150, desc: 'Almohadilla de doble color ideal para sellos fechadores.', localImg: "/Users/macbook/.gemini/antigravity-ide/brain/49244f42-fd6a-4008-83e6-85d98593395b/almohadilla_bicolor_1782045925702.png", imgUrl: "/creatusello/repuestos/almohadilla_bicolor.png" },
  { sku: 'REP-GOM-01', name: 'Goma Personalizada Grabada', category: 'Repuestos', dim: 'Variable', price: '9.00', stock: 500, desc: 'Plantilla de goma cortada a láser con texto o logo personalizado para reemplazo.', localImg: "/Users/macbook/.gemini/antigravity-ide/brain/49244f42-fd6a-4008-83e6-85d98593395b/goma_grabada_1782045936736.png", imgUrl: "/creatusello/repuestos/goma_grabada.png" },
  { sku: 'REP-TIN-01', name: 'Frasco de Tinta Líquida Negra 30ml', category: 'Repuestos', dim: '30ml', price: '6.00', stock: 80, desc: 'Tinta especial para recargar almohadillas de sellos manuales y automáticos.', localImg: "/Users/macbook/.gemini/antigravity-ide/brain/49244f42-fd6a-4008-83e6-85d98593395b/frasco_tinta_negra_1782045945565.png", imgUrl: "/creatusello/repuestos/frasco_tinta_negra.png" },
  { sku: 'REP-BAS-01', name: 'Base/Montura de Madera Sola', category: 'Repuestos', dim: '60x40mm', price: '5.00', stock: 30, desc: 'Solo la montura de madera con mango ergonómico sin goma.', localImg: "/Users/macbook/.gemini/antigravity-ide/brain/49244f42-fd6a-4008-83e6-85d98593395b/base_madera_1782045953932.png", imgUrl: "/creatusello/repuestos/base_madera.png" },
  { sku: 'LAN-CORP-01', name: 'Lanyard Corporativo Premium', category: 'Lanyards', dim: '90x2cm', price: '3.50', stock: 300, desc: 'Correa para el cuello con mosquetón metálico, ideal para portar tu sello.', localImg: "/Users/macbook/.gemini/antigravity-ide/brain/49244f42-fd6a-4008-83e6-85d98593395b/lanyard_corporativo_1782047025983.png", imgUrl: "/creatusello/repuestos/lanyard_corporativo.png" },
  { sku: 'ACC-DIJ-MED', name: 'Dije Médico (Estetoscopio)', category: 'Accesorios', dim: '2x2cm', price: '2.00', stock: 150, desc: 'Elegante dije plateado para personalizar tu sello, con temática médica.', localImg: "/Users/macbook/.gemini/antigravity-ide/brain/49244f42-fd6a-4008-83e6-85d98593395b/dije_medico_1782047054861.png", imgUrl: "/creatusello/repuestos/dije_medico.png" },
];

async function generate() {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Catálogo e Inventario');

  // Columns definition
  sheet.columns = [
    { header: 'Imagen', key: 'image', width: 20 },
    { header: 'SKU', key: 'sku', width: 15 },
    { header: 'Nombre del Producto', key: 'name', width: 35 },
    { header: 'Categoría', key: 'category', width: 15 },
    { header: 'Dimensiones', key: 'dim', width: 15 },
    { header: 'Precio (€)', key: 'price', width: 15 },
    { header: 'Stock', key: 'stock', width: 10 },
    { header: 'Descripción', key: 'desc', width: 50 },
    { header: 'URL de Imagen (Para CSV)', key: 'imgUrl', width: 40 },
  ];

  // Styling header
  sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
  sheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF1A365D' }
  };
  sheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };
  sheet.getRow(1).height = 30;

  for (let i = 0; i < PRODUCTS.length; i++) {
    const item = PRODUCTS[i];
    const rowNumber = i + 2;
    const row = sheet.getRow(rowNumber);
    row.height = 100; // Large height for images

    // Fill textual data
    row.getCell('sku').value = item.sku;
    row.getCell('name').value = item.name;
    row.getCell('category').value = item.category;
    row.getCell('dim').value = item.dim;
    row.getCell('price').value = parseFloat(item.price);
    row.getCell('stock').value = item.stock;
    row.getCell('desc').value = item.desc;
    row.getCell('imgUrl').value = item.imgUrl || '';
    
    row.alignment = { vertical: 'middle', wrapText: true };
    row.getCell('price').numFmt = '€#,##0.00';
    row.getCell('stock').alignment = { vertical: 'middle', horizontal: 'center' };
    
    // Download and embed image if exists
    if (item.imgUrl && item.imgUrl.startsWith('http')) {
      try {
        const base64Data = await downloadImageBase64(item.imgUrl);
        const imageId = workbook.addImage({
          base64: `data:image/jpeg;base64,${base64Data}`,
          extension: 'jpeg',
        });
        
        sheet.addImage(imageId, {
          tl: { col: 0, row: rowNumber - 1 },
          ext: { width: 120, height: 120 },
          editAs: 'oneCell'
        });
      } catch(e) {
        console.error('Error with image for', item.sku, e.message);
        row.getCell('image').value = 'Sin Imagen';
      }
    } else if (item.localImg) {
      try {
        const localBase64 = fs.readFileSync(item.localImg, 'base64');
        const imageId = workbook.addImage({
          base64: `data:image/png;base64,${localBase64}`,
          extension: 'png',
        });
        
        sheet.addImage(imageId, {
          tl: { col: 0, row: rowNumber - 1 },
          ext: { width: 120, height: 120 },
          editAs: 'oneCell'
        });
      } catch(e) {
        console.error('Error with local image for', item.sku, e.message);
        row.getCell('image').value = 'Sin Imagen';
      }
    } else {
      row.getCell('image').value = 'Repuesto';
      row.getCell('image').alignment = { vertical: 'middle', horizontal: 'center', italic: true };
    }
  }

  const outputPath = path.join(__dirname, '..', 'data', 'Catalogo_Inventario_CreaTuSello.xlsx');
  await workbook.xlsx.writeFile(outputPath);
  console.log(`Catálogo guardado con éxito en: ${outputPath}`);

  const csvPath = path.join(__dirname, '..', 'data', 'Catalogo_Inventario_CreaTuSello.csv');
  await workbook.csv.writeFile(csvPath);
  console.log(`Versión CSV guardada con éxito en: ${csvPath}`);
}

generate().catch(console.error);
