
import { Link } from 'react-router-dom';

export default function InventoryManager() {
  return (
    <main className="pt-24 min-h-screen bg-background">
      <style>{`
        .sidebar-active {
            background: linear-gradient(135deg, #2563EB 0%, #7C3AED 100%);
            color: white;
        }
        .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: #f1f1f1;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 10px;
        }
        .card-hover-effect {
            transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease;
        }
        .card-hover-effect:hover {
            transform: translateY(-4px);
            box-shadow: 0px 12px 24px rgba(0,0,0,0.1);
        }
        .upload-gradient:hover {
            background: linear-gradient(135deg, rgba(37, 99, 235, 0.05) 0%, rgba(124, 58, 237, 0.05) 100%);
        }
      `}</style>
      <div className="max-w-[1280px] mx-auto px-10 py-8 flex flex-col lg:flex-row gap-6">
        {/* Sidebar Navigation */}
        <aside className="w-full lg:w-[360px] shrink-0">
          <div className="bg-white rounded-xl p-6 shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-surface-container">
            <h2 className="font-title-md text-xl font-bold text-primary mb-6">Administración</h2>
            <ul className="space-y-2">
              <li>
                <Link to="/inventory" className="flex items-center gap-3 px-4 py-3 rounded-lg sidebar-active transition-all shadow-lg shadow-vibrant-blue/20">
                  <span className="material-symbols-outlined" data-icon="inventory_2" style={{ fontVariationSettings: "'FILL' 1" }}>inventory_2</span>
                  <span className="font-title-md text-lg font-bold">Inventario & Tipografías</span>
                </Link>
              </li>
              <li>
                <Link to="/orders" className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface-container-low transition-all">
                  <span className="material-symbols-outlined" data-icon="receipt_long">receipt_long</span>
                  <span className="font-title-md text-lg font-bold">Pedidos</span>
                </Link>
              </li>
            </ul>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 space-y-8">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="font-headline-lg text-3xl font-bold text-text-primary">Gestión de Inventario</h1>
              <p className="text-text-secondary text-base">Administra el stock, dimensiones y recursos tipográficos de tus productos.</p>
            </div>
            <button className="flex items-center gap-2 bg-vibrant-orange text-white px-6 py-3 rounded-lg font-bold text-lg hover:scale-105 active:scale-95 transition-all shadow-lg shadow-vibrant-orange/30">
              <span className="material-symbols-outlined" data-icon="add">add</span>
              Nuevo Producto
            </button>
          </div>

          {/* Gestión de Tipografías Section */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Font Upload Card */}
            <div className="md:col-span-2 bg-white border border-surface-container rounded-xl p-8 shadow-[0px_4px_20px_rgba(0,0,0,0.04)] relative overflow-hidden card-hover-effect">
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <span className="material-symbols-outlined text-[120px] text-vibrant-purple" data-icon="text_fields">text_fields</span>
              </div>
              <h3 className="font-title-md text-xl font-bold text-primary mb-4">Gestión de Tipografías</h3>
              <p className="text-on-surface-variant text-base mb-6 max-w-lg">Sube archivos .ttf o .otf para integrarlos automáticamente en el configurador de sellos.</p>
              <div className="border-2 border-dashed border-outline-variant rounded-xl p-10 flex flex-col items-center justify-center bg-surface-container-low upload-gradient hover:border-vibrant-blue transition-all cursor-pointer group">
                <span className="material-symbols-outlined text-4xl text-outline group-hover:text-vibrant-blue mb-4 transition-transform group-hover:-translate-y-1" data-icon="cloud_upload">cloud_upload</span>
                <p className="text-on-surface text-base font-semibold group-hover:text-vibrant-blue">Haz clic para subir o arrastra los archivos</p>
                <p className="text-outline text-xs mt-2 uppercase tracking-wider">TTF, OTF (Max. 10MB)</p>
                <input accept=".ttf,.otf" className="hidden" type="file" />
              </div>
            </div>

            {/* Active Fonts List */}
            <div className="bg-white border border-surface-container rounded-xl p-6 shadow-[0px_4px_20px_rgba(0,0,0,0.04)] flex flex-col card-hover-effect">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-title-md text-xl font-bold text-primary">Fuentes Activas</h4>
                <span className="bg-vibrant-purple text-white text-xs px-2 py-1 rounded-full font-bold">12 Total</span>
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg border border-outline-variant bg-surface-bright hover:bg-white transition-colors">
                  <span className="text-base font-semibold" style={{ fontFamily: 'Montserrat' }}>Montserrat Bold</span>
                  <span className="material-symbols-outlined text-error cursor-pointer text-sm hover:scale-125 transition-transform" data-icon="delete">delete</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border border-outline-variant bg-surface-bright hover:bg-white transition-colors">
                  <span className="text-base" style={{ fontFamily: 'serif' }}>Playfair Display</span>
                  <span className="material-symbols-outlined text-error cursor-pointer text-sm hover:scale-125 transition-transform" data-icon="delete">delete</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border border-outline-variant bg-surface-bright hover:bg-white transition-colors">
                  <span className="text-base font-semibold">Roboto Flex</span>
                  <span className="material-symbols-outlined text-error cursor-pointer text-sm hover:scale-125 transition-transform" data-icon="delete">delete</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border border-outline-variant bg-surface-bright hover:bg-white transition-colors">
                  <span className="text-base italic" style={{ fontFamily: 'sans-serif' }}>Inter Italic</span>
                  <span className="material-symbols-outlined text-error cursor-pointer text-sm hover:scale-125 transition-transform" data-icon="delete">delete</span>
                </div>
              </div>
            </div>
          </section>

          {/* Inventory Table Section */}
          <section className="bg-white border border-surface-container rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] overflow-hidden card-hover-effect">
            <div className="px-8 py-6 border-b border-surface-container flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h3 className="font-title-md text-xl font-bold text-primary">Niveles de Stock y Dimensiones</h3>
              <div className="flex gap-2">
                <button className="px-4 py-2 text-primary border border-primary rounded-lg font-bold text-lg flex items-center gap-2 hover:bg-primary-fixed transition-colors">
                  <span className="material-symbols-outlined" data-icon="download">download</span>
                  Exportar
                </button>
                <button className="px-4 py-2 text-on-surface-variant border border-outline-variant rounded-lg font-bold text-lg flex items-center gap-2 hover:bg-surface-container-low transition-colors">
                  <span className="material-symbols-outlined" data-icon="filter_list">filter_list</span>
                  Filtrar
                </button>
              </div>
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
                  {/* Row 1 */}
                  <tr className="hover:bg-vibrant-blue/5 transition-colors group cursor-default">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded bg-surface-container-high shrink-0 overflow-hidden">
                          <img alt="Sello Automático" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDGO80G8SQt65AR4wUkYwUltfDs8LoaK32bXFlaJfKyT_FybVmrmvToGmAOZequsS-1f11vX_hKvryQ22HERLz5fn85KAq6YIeRKPj0b2jKIYjManWEE0GVi7Stz0wvlzudRraK1Z8ckuZt2--OmY3XuP5AQLk5mbwV42vk4NukD7Lo0XCbllu24IAHjaOG708LCn0K09vnaHo0oHg5p29HGk5Jyew0Fddc45hsEch8mJ3AqiaOWkWs46GQ1RSLZFrvxrrfImp9jMg" />
                        </div>
                        <div>
                          <div className="font-title-md text-lg font-bold text-on-surface">Sello Automático Pro-40</div>
                          <div className="text-xs text-outline">SKU: SAP-00451-B</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6 text-center">
                      <span className="bg-surface-container-highest px-3 py-1 rounded text-xs text-on-surface-variant">40mm x 40mm</span>
                    </td>
                    <td className="px-6 py-6 text-center">
                      <div className="flex flex-col items-center">
                        <span className="text-base font-bold text-on-surface">142</span>
                        <div className="w-24 h-1.5 bg-surface-container-high rounded-full mt-2 overflow-hidden">
                          <div className="h-full bg-vibrant-teal w-3/4"></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <span className="inline-flex items-center gap-1.5 text-vibrant-teal bg-vibrant-teal/10 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                        <span className="w-2 h-2 rounded-full bg-vibrant-teal animate-pulse"></span>
                        Óptimo
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button className="p-2 hover:text-vibrant-blue transition-colors">
                        <span className="material-symbols-outlined" data-icon="edit">edit</span>
                      </button>
                      <button className="p-2 hover:text-primary transition-colors">
                        <span className="material-symbols-outlined" data-icon="more_vert">more_vert</span>
                      </button>
                    </td>
                  </tr>
                  {/* Row 2 */}
                  <tr className="hover:bg-vibrant-orange/5 transition-colors group cursor-default">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded bg-surface-container-high shrink-0 overflow-hidden">
                          <img alt="Sello Madera" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC_B8aoEYQ_lMmCdugdqu_trQMnSWjcCfcnHLHGe1nkRvIk0R-gyzi0PQXawGKDBKywNl2mibxMcSzd8KLlcPFOJ5KapWEgI7tMvp6Zcm_XYrmhpvHCZinpIiRQ8hgpCgMiHHeYntEczPvBzP7Rpozff3eWMgfgD6h-h5hMxoMQmdMk2TnYk-Na6bZYifA-de_DQ8aFxV_gkIN_Ynqv24HleJM_t5_6EeCMChvwwFNyc7JpSZSMBZYY1mUoLriVXIx2ZZ5uA1QwfD8" />
                        </div>
                        <div>
                          <div className="font-title-md text-lg font-bold text-on-surface">Sello Madera Tradicional L</div>
                          <div className="text-xs text-outline">SKU: SMT-00912-W</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6 text-center">
                      <span className="bg-surface-container-highest px-3 py-1 rounded text-xs text-on-surface-variant">60mm x 30mm</span>
                    </td>
                    <td className="px-6 py-6 text-center">
                      <div className="flex flex-col items-center">
                        <span className="text-base font-bold text-on-surface">12</span>
                        <div className="w-24 h-1.5 bg-surface-container-high rounded-full mt-2 overflow-hidden">
                          <div className="h-full bg-vibrant-orange w-1/5"></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <span className="inline-flex items-center gap-1.5 text-vibrant-orange bg-vibrant-orange/10 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                        <span className="w-2 h-2 rounded-full bg-vibrant-orange"></span>
                        Bajo Stock
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button className="p-2 hover:text-vibrant-orange transition-colors">
                        <span className="material-symbols-outlined" data-icon="edit">edit</span>
                      </button>
                      <button className="p-2 hover:text-primary transition-colors">
                        <span className="material-symbols-outlined" data-icon="more_vert">more_vert</span>
                      </button>
                    </td>
                  </tr>
                  {/* Row 3 */}
                  <tr className="hover:bg-vibrant-purple/5 transition-colors group cursor-default">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded bg-surface-container-high shrink-0 overflow-hidden">
                          <img alt="Fechador Industrial" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD9uzK6LWhBjUP--y4ZuRHJh8T7jJvVMzHrgIkZllVmBHZjhJfD2fzEa5arRBtvj1kzNdSnDJdm67pEDxRJQYk0maCpjODRSVoy6mjwrECSo2ki3E_LPMZJBaMcg8RkNVKMh49N9k3Ka4IbPLaRpygvHNLoFB7p6QO9eUHdWmPkGXMjKuNakmBw1lafVn61CnbA675EIjosRncT6CkKs5cQf74SUmFTFb167DF-fR5GyHLfTzCT0dCfr6zCKsxlYbcVywPV-Uas9rI" />
                        </div>
                        <div>
                          <div className="font-title-md text-lg font-bold text-on-surface">Fechador Industrial Heavy Duty</div>
                          <div className="text-xs text-outline">SKU: SFH-11022-M</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6 text-center">
                      <span className="bg-surface-container-highest px-3 py-1 rounded text-xs text-on-surface-variant">50mm x 30mm</span>
                    </td>
                    <td className="px-6 py-6 text-center">
                      <div className="flex flex-col items-center">
                        <span className="text-base font-bold text-on-surface">85</span>
                        <div className="w-24 h-1.5 bg-surface-container-high rounded-full mt-2 overflow-hidden">
                          <div className="h-full bg-vibrant-purple w-1/2"></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <span className="inline-flex items-center gap-1.5 text-vibrant-purple bg-vibrant-purple/10 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                        <span className="w-2 h-2 rounded-full bg-vibrant-purple"></span>
                        Moderado
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button className="p-2 hover:text-vibrant-purple transition-colors">
                        <span className="material-symbols-outlined" data-icon="edit">edit</span>
                      </button>
                      <button className="p-2 hover:text-primary transition-colors">
                        <span className="material-symbols-outlined" data-icon="more_vert">more_vert</span>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            <div className="px-8 py-4 bg-surface-container-lowest border-t border-surface-container flex items-center justify-between">
              <span className="text-on-surface-variant text-xs">Mostrando 1-10 de 45 productos</span>
              <div className="flex gap-2">
                <button className="p-2 rounded border border-outline-variant hover:bg-surface-container-low disabled:opacity-50" disabled>
                  <span className="material-symbols-outlined" data-icon="chevron_left">chevron_left</span>
                </button>
                <button className="p-2 rounded border border-outline-variant hover:bg-surface-container-low">
                  <span className="material-symbols-outlined" data-icon="chevron_right">chevron_right</span>
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
