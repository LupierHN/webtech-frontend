export function escapeHtml(unsafe: string): string {
  return unsafe.replace(/[&<>"'`=\/]/g, (s: string): string => {
    return {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
      '/': '&#x2F;',
      '`': '&#x60;',
      '=': '&#x3D;'
    }[s] || '';
  });
}

export function unescapeHtml(safe: string): string {
  return safe.replace(/&(amp|lt|gt|quot|#39|#x2F|#x60|#x3D);/g, (s: string): string => {
    return {
      '&amp;': '&',
      '&lt;': '<',
      '&gt;': '>',
      '&quot;': '"',
      '&#39;': "'",
      '&#x2F;': '/',
      '&#x60;': '`',
      '&#x3D;': '='
    }[s] || '';
  });
}

