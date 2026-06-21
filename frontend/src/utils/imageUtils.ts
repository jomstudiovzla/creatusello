export function resolveImageUrl(url: string | undefined): string {
  if (!url) return '';
  if (url.startsWith('http') || url.startsWith('data:')) return url;
  
  const basePath = import.meta.env.BASE_URL; // usually '/creatusello/'
  
  // Si la url ya empieza con '/creatusello' (por si ya está corregida en la base de datos)
  if (url.startsWith('/creatusello')) return url;

  // Limpiamos la URL para concatenar bien
  const cleanUrl = url.startsWith('/') ? url.slice(1) : url;
  const cleanBase = basePath.endsWith('/') ? basePath : basePath + '/';
  
  return `${cleanBase}${cleanUrl}`;
}

export function preloadImages(urls: string[]) {
  const validUrls = urls.filter(url => !!url);
  validUrls.forEach(url => {
    const img = new Image();
    img.src = url;
  });
}
