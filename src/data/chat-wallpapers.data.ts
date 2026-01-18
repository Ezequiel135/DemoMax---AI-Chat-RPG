
export interface ChatWallpaper {
  id: string;
  name: string;
  value: string; // CSS value (color, gradient, or url)
  isImage: boolean;
  thumbnail?: string; // Optional specific thumbnail
}

export const CHAT_WALLPAPERS: ChatWallpaper[] = [
  { 
    id: 'default', 
    name: 'Padrão', 
    value: '', 
    isImage: false 
  },
  { 
    id: 'aurora', 
    name: 'Aurora', 
    value: 'linear-gradient(to bottom, #2c3e50, #4ca1af)', 
    isImage: false 
  },
  { 
    id: 'midnight', 
    name: 'Midnight', 
    value: 'linear-gradient(to top, #232526, #414345)', 
    isImage: false 
  },
  { 
    id: 'sunset', 
    name: 'Sunset', 
    value: 'linear-gradient(to top, #0f2027, #203a43, #2c5364)', 
    isImage: false 
  },
  { 
    id: 'sakura', 
    name: 'Sakura', 
    value: 'linear-gradient(to top, #fbc2eb, #a6c1ee)', 
    isImage: false 
  },
  { 
    id: 'forest', 
    name: 'Misty Forest', 
    value: 'linear-gradient(to top, #134e5e, #71b280)', 
    isImage: false 
  },
  {
    id: 'img_classroom',
    name: 'Sala de Aula',
    value: 'url("https://img.freepik.com/free-vector/anime-high-school-classroom_1308-53106.jpg")',
    isImage: true
  },
  {
    id: 'img_bedroom',
    name: 'Quarto',
    value: 'url("https://img.freepik.com/free-vector/bedroom-with-balcony-night-anime-style_107791-18237.jpg")',
    isImage: true
  },
  {
    id: 'img_cafe',
    name: 'Cafeteria',
    value: 'url("https://img.freepik.com/free-vector/empty-cafe-interior-with-table-chair-plant-lamp_107791-16327.jpg")',
    isImage: true
  }
];
