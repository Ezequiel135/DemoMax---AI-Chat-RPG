
export function parseNovelContent(text: string): string {
  if (!text) return '';
  // Basic markdown image parser: ![Alt](Url) -> <img src="Url" ...>
  // Also converts newlines to <br>
  let html = text
    .replace(/\n/g, '<br>')
    .replace(/!\[(.*?)\]\((.*?)\)/g, (match, alt, url) => {
      return `<div class="my-4 rounded-xl overflow-hidden shadow-lg border border-white/10"><img src="${url}" alt="${alt}" class="w-full object-cover"></div>`;
    });
  
  return html;
}
