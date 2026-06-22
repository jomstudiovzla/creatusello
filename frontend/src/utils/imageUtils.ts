export function resolveImageUrl(url: string | undefined): string {
  if (!url) return '';
  if (url.startsWith('http') || url.startsWith('data:')) return url;
  
  const basePath = import.meta.env.BASE_URL || '/'; // usually '/creatusello/' or '/'
  
  // Limpiamos la URL para concatenar bien
  let cleanUrl = url.startsWith('/') ? url.slice(1) : url;
  
  // Si la url en BD ya tiene 'creatusello/', se lo quitamos para usar la base real de Vite
  if (cleanUrl.startsWith('creatusello/')) {
    cleanUrl = cleanUrl.replace('creatusello/', '');
  }

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
