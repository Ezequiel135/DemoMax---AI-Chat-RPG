
import { VisualNovel } from '../models/vn.model';

const APP_ICON_URL = 'https://i.ibb.co/hxSz0SJr/Background-Eraser-20251224-125356967.png';
const MASTER_ID = 'admin_ezequiel';
const MASTER_NAME = 'わっせ';

export const MOCK_VNS: VisualNovel[] = [
  {
    id: 'vn_ddlc_style',
    creatorId: MASTER_ID,
    title: 'Poetry & Glitches',
    author: MASTER_NAME,
    description: 'Um clube de literatura comum com garotas fofas. O que poderia dar errado? ATENÇÃO: Contém temas de terror psicológico e quebra da quarta parede.',
    coverUrl: APP_ICON_URL, 
    tags: ['Horror Psicológico', 'Romance?', 'Meta-Ficção'],
    createdAt: Date.now(),
    playCount: 0,
    likes: 0,
    startSceneId: 'scene_class_1',
    credits: {
      enabled: true,
      endingTitle: 'JUST MONIKA',
      scrollingText: 'Você deletou o arquivo errado.\n\nAgora somos apenas nós dois.\n\nPara sempre.',
      backgroundImageUrl: APP_ICON_URL
    },
    scenes: [
      {
        id: 'scene_class_1',
        name: 'Sala de Aula',
        backgroundUrl: 'https://img.freepik.com/free-vector/anime-high-school-classroom_1308-53106.jpg', // Mantivemos BG original para contexto, mas char é Icon
        speakerName: 'Sayori',
        characterUrl: APP_ICON_URL,
        dialogue: 'Ei! Você prometeu que entraria para o clube hoje! Não me diga que esqueceu?',
        transition: 'fade',
        characterEffect: 'hop',
        choices: [
          { text: 'Eu nunca esqueço.', nextSceneId: 'scene_club_happy' },
          { text: 'Talvez eu não vá.', nextSceneId: 'scene_glitch_1' }
        ]
      },
      {
        id: 'scene_glitch_1',
        name: 'Corrupção',
        backgroundUrl: 'https://media1.tenor.com/m/m1m2m3m4/glitch-error.gif', 
        speakerName: 'S̴a̴y̴o̴r̴i̴',
        characterUrl: APP_ICON_URL,
        dialogue: 'P̷o̷r̷ ̷q̷u̷e̷ ̷v̷o̷c̷ê̷ ̷n̷ã̷o̷ ̷m̷e̷ ̷a̷m̷a̷?̷ Eu s-só q-quero que v-você...',
        transition: 'none',
        characterEffect: 'shake',
        choices: [
          { text: 'REINICIAR JOGO', nextSceneId: 'scene_class_1' }
        ]
      },
      {
        id: 'scene_club_happy',
        name: 'O Clube',
        backgroundUrl: 'https://img.freepik.com/free-vector/anime-school-hallway-background_1308-53107.jpg',
        speakerName: 'Monika',
        characterUrl: APP_ICON_URL,
        dialogue: 'Bem-vindo ao clube! Estamos tão felizes em ter um novo membro. Por favor, escreva um poema para amanhã.',
        choices: [] 
      }
    ]
  },
  {
    id: 'vn_romance_school',
    creatorId: MASTER_ID,
    title: 'Sakura Promise',
    author: MASTER_NAME,
    description: 'A temporada das cerejeiras chegou. Você vai declarar seu amor para sua amiga de infância ou para a presidente do conselho estudantil?',
    coverUrl: APP_ICON_URL,
    tags: ['Romance', 'Vida Escolar', 'Drama'],
    createdAt: Date.now() - 100000,
    playCount: 0,
    likes: 0,
    startSceneId: 'start',
    credits: {
      enabled: true,
      endingTitle: 'FIM',
      scrollingText: 'O amor floresce no tempo certo.\n\nObrigado por jogar Sakura Promise.',
      backgroundImageUrl: APP_ICON_URL
    },
    scenes: [
      {
        id: 'start',
        name: 'Entrada da Escola',
        backgroundUrl: 'https://img.freepik.com/free-vector/school-building-scenery_1308-53109.jpg',
        characterUrl: APP_ICON_URL,
        speakerName: 'Pensamento',
        dialogue: 'Mais um ano começa. As pétalas caem lentamente...',
        choices: [
           { text: 'Ir para o terraço', nextSceneId: 'terrace' },
           { text: 'Ir para a biblioteca', nextSceneId: 'library' }
        ]
      },
      {
        id: 'terrace',
        name: 'Terraço',
        backgroundUrl: 'https://img.freepik.com/free-vector/anime-school-rooftop-background_1308-53110.jpg',
        characterUrl: APP_ICON_URL,
        speakerName: 'Hina (Amiga)',
        dialogue: 'Sabia que te encontraria aqui! Você sempre foge da cerimônia de abertura.',
        characterEffect: 'slide-up',
        choices: []
      },
      {
        id: 'library',
        name: 'Biblioteca',
        backgroundUrl: 'https://img.freepik.com/free-vector/library-interior-background_1308-53111.jpg',
        characterUrl: APP_ICON_URL,
        speakerName: 'Presidente',
        dialogue: 'Silêncio. A biblioteca não é lugar para se esconder, aluno.',
        choices: []
      }
    ]
  },
  {
    id: 'vn_cyberpunk',
    creatorId: MASTER_ID,
    title: 'Neon Rain: Protocolo Zero',
    author: MASTER_NAME,
    description: 'Em 2077, memórias podem ser compradas. Você é um detetive tentando solucionar o assassinato de um androide que sonhava.',
    coverUrl: APP_ICON_URL,
    tags: ['Sci-Fi', 'Mistério', 'Cyberpunk'],
    createdAt: Date.now() - 500000,
    playCount: 0,
    likes: 0,
    startSceneId: 'scene_rain',
    credits: {
      enabled: true,
      endingTitle: 'SISTEMA DESLIGADO',
      scrollingText: 'A chuva esconde todas as lágrimas.\n\nRoteiro por AI.\nArte por Imagen.',
      backgroundImageUrl: APP_ICON_URL
    },
    scenes: [
      {
        id: 'scene_rain',
        name: 'Beco Escuro',
        backgroundUrl: 'https://img.freepik.com/free-photo/cyberpunk-city-street-night-with-neon-lights_23-2150712399.jpg',
        characterUrl: APP_ICON_URL,
        speakerName: 'Detetive',
        dialogue: 'A chuva ácida corrói meu casaco. O corpo do androide está ali, brilhando em azul cromo.',
        characterEffect: 'none',
        choices: [
           { text: 'Examinar o chip de memória', nextSceneId: 'memory_dive' },
           { text: 'Falar com a testemunha', nextSceneId: 'witness' }
        ]
      },
      {
        id: 'memory_dive',
        name: 'Mergulho Neural',
        backgroundUrl: 'https://img.freepik.com/free-vector/abstract-technology-particle-background_23-2148429738.jpg',
        characterUrl: APP_ICON_URL,
        speakerName: 'Sistema',
        dialogue: 'ACESSO NEGADO. Criptografia de nível militar detectada.',
        choices: []
      },
      {
        id: 'witness',
        name: 'A Testemunha',
        backgroundUrl: 'https://img.freepik.com/free-photo/cyberpunk-city-street-night-with-neon-lights_23-2150712399.jpg',
        characterUrl: APP_ICON_URL,
        speakerName: 'Garota Misteriosa',
        dialogue: 'Ele sabia demais. Eles vão vir atrás de você também.',
        choices: []
      }
    ]
  },
  {
    id: 'vn_isekai',
    creatorId: MASTER_ID,
    title: 'Re:Kingdom - O Herói da Padaria',
    author: MASTER_NAME,
    description: 'Fui atropelado por um caminhão e reencarnei... como o padeiro do Rei Demônio?! Uma comédia romântica de fantasia.',
    coverUrl: APP_ICON_URL,
    tags: ['Fantasia', 'Comédia', 'Isekai'],
    createdAt: Date.now() - 200000,
    playCount: 0,
    likes: 0,
    startSceneId: 'bakery',
    credits: { 
      enabled: true, 
      endingTitle: 'FIM', 
      scrollingText: 'Fim do Capítulo 1',
      backgroundImageUrl: APP_ICON_URL
    },
    scenes: [
      {
        id: 'bakery',
        name: 'Padaria Infernal',
        backgroundUrl: 'https://img.freepik.com/free-photo/medieval-kitchen-interior_23-2150712682.jpg',
        characterUrl: APP_ICON_URL,
        speakerName: 'General Demônio',
        dialogue: 'Humano! O Lorde Demônio exige... um croissant de chocolate!',
        choices: [
           { text: 'Servir o pão', nextSceneId: 'serve' },
           { text: 'Jogar farinha nele', nextSceneId: 'fight' }
        ]
      },
      {
        id: 'serve',
        name: 'Sucesso',
        backgroundUrl: 'https://img.freepik.com/free-photo/medieval-kitchen-interior_23-2150712682.jpg',
        characterUrl: APP_ICON_URL,
        speakerName: 'General Demônio',
        dialogue: 'Delicioso! Você será poupado da destruição hoje.',
        choices: []
      },
      {
        id: 'fight',
        name: 'Erro Crítico',
        backgroundUrl: 'https://img.freepik.com/free-photo/fire-flame-background_1122-1234.jpg',
        characterUrl: APP_ICON_URL,
        speakerName: 'Narrador',
        dialogue: 'Você morreu. Nunca jogue farinha em um demônio de fogo.',
        choices: []
      }
    ]
  }
];
