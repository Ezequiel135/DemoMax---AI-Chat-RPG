
import { VisualNovel } from '../models/vn.model';

const BASE_IMG = 'https://picsum.photos/seed';

export const MOCK_VNS: VisualNovel[] = [
  {
    id: 'vn_ddlc_style',
    creatorId: 'system_horror',
    title: 'Poetry & Glitches',
    author: 'Dan Salvato (Inspired)',
    description: 'Um clube de literatura comum com garotas fofas. O que poderia dar errado? ATENÇÃO: Contém temas de terror psicológico e quebra da quarta parede.',
    coverUrl: 'https://i.pinimg.com/736x/8d/6e/8f/8d6e8f6b0b6b0b6b0b6b0b6b0b6b0b6b.jpg', // Placeholder vibe anime school
    tags: ['Horror Psicológico', 'Romance?', 'Meta-Ficção'],
    createdAt: Date.now(),
    playCount: 666000,
    likes: 12000,
    startSceneId: 'scene_class_1',
    credits: {
      enabled: true,
      endingTitle: 'JUST MONIKA',
      scrollingText: 'Você deletou o arquivo errado.\n\nAgora somos apenas nós dois.\n\nPara sempre.',
      backgroundImageUrl: 'https://media1.tenor.com/m/m1m2m3m4/glitch-error.gif'
    },
    scenes: [
      {
        id: 'scene_class_1',
        name: 'Sala de Aula',
        backgroundUrl: 'https://img.freepik.com/free-vector/anime-high-school-classroom_1308-53106.jpg',
        speakerName: 'Sayori',
        characterUrl: 'https://i.ibb.co/hxSz0SJr/Background-Eraser-20251224-125356967.png', // Reutilizando a mascote por enquanto
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
        backgroundUrl: 'https://media1.tenor.com/m/m1m2m3m4/glitch-error.gif', // Glitch effect
        speakerName: 'S̴a̴y̴o̴r̴i̴',
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
        dialogue: 'Bem-vindo ao clube! Estamos tão felizes em ter um novo membro. Por favor, escreva um poema para amanhã.',
        choices: [] // Fim da demo
      }
    ]
  },
  {
    id: 'vn_romance_school',
    creatorId: 'system_romance',
    title: 'Sakura Promise',
    author: 'Studio Romance',
    description: 'A temporada das cerejeiras chegou. Você vai declarar seu amor para sua amiga de infância ou para a presidente do conselho estudantil?',
    coverUrl: 'https://img.freepik.com/free-photo/cherry-blossoms-spring-season_23-2150262456.jpg',
    tags: ['Romance', 'Vida Escolar', 'Drama'],
    createdAt: Date.now() - 100000,
    playCount: 4500,
    likes: 890,
    startSceneId: 'start',
    credits: {
      enabled: true,
      endingTitle: 'FIM',
      scrollingText: 'O amor floresce no tempo certo.\n\nObrigado por jogar Sakura Promise.'
    },
    scenes: [
      {
        id: 'start',
        name: 'Entrada da Escola',
        backgroundUrl: 'https://img.freepik.com/free-vector/school-building-scenery_1308-53109.jpg',
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
        speakerName: 'Hina (Amiga)',
        dialogue: 'Sabia que te encontraria aqui! Você sempre foge da cerimônia de abertura.',
        characterEffect: 'slide-up',
        choices: []
      },
      {
        id: 'library',
        name: 'Biblioteca',
        backgroundUrl: 'https://img.freepik.com/free-vector/library-interior-background_1308-53111.jpg',
        speakerName: 'Presidente',
        dialogue: 'Silêncio. A biblioteca não é lugar para se esconder, aluno.',
        choices: []
      }
    ]
  },
  {
    id: 'vn_cyberpunk',
    creatorId: 'system_scifi',
    title: 'Neon Rain: Protocolo Zero',
    author: 'CyberWitch',
    description: 'Em 2077, memórias podem ser compradas. Você é um detetive tentando solucionar o assassinato de um androide que sonhava.',
    coverUrl: 'https://img.freepik.com/free-photo/cyberpunk-city-street-night-with-neon-lights_23-2150712399.jpg',
    tags: ['Sci-Fi', 'Mistério', 'Cyberpunk'],
    createdAt: Date.now() - 500000,
    playCount: 1200,
    likes: 340,
    startSceneId: 'scene_rain',
    credits: {
      enabled: true,
      endingTitle: 'SISTEMA DESLIGADO',
      scrollingText: 'A chuva esconde todas as lágrimas.\n\nRoteiro por AI.\nArte por Imagen.'
    },
    scenes: [
      {
        id: 'scene_rain',
        name: 'Beco Escuro',
        backgroundUrl: 'https://img.freepik.com/free-photo/cyberpunk-city-street-night-with-neon-lights_23-2150712399.jpg',
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
        speakerName: 'Sistema',
        dialogue: 'ACESSO NEGADO. Criptografia de nível militar detectada.',
        choices: []
      },
      {
        id: 'witness',
        name: 'A Testemunha',
        backgroundUrl: 'https://img.freepik.com/free-photo/cyberpunk-city-street-night-with-neon-lights_23-2150712399.jpg',
        speakerName: 'Garota Misteriosa',
        dialogue: 'Ele sabia demais. Eles vão vir atrás de você também.',
        choices: []
      }
    ]
  },
  {
    id: 'vn_isekai',
    creatorId: 'system_fantasy',
    title: 'Re:Kingdom - O Herói da Padaria',
    author: 'IsekaiLover',
    description: 'Fui atropelado por um caminhão e reencarnei... como o padeiro do Rei Demônio?! Uma comédia romântica de fantasia.',
    coverUrl: 'https://img.freepik.com/free-photo/fantasy-village-landscape_23-2150655447.jpg',
    tags: ['Fantasia', 'Comédia', 'Isekai'],
    createdAt: Date.now() - 200000,
    playCount: 8900,
    likes: 1500,
    startSceneId: 'bakery',
    credits: { enabled: true, endingTitle: 'FIM', scrollingText: 'Fim do Capítulo 1' },
    scenes: [
      {
        id: 'bakery',
        name: 'Padaria Infernal',
        backgroundUrl: 'https://img.freepik.com/free-photo/medieval-kitchen-interior_23-2150712682.jpg',
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
        speakerName: 'General Demônio',
        dialogue: 'Delicioso! Você será poupado da destruição hoje.',
        choices: []
      },
      {
        id: 'fight',
        name: 'Erro Crítico',
        backgroundUrl: 'https://img.freepik.com/free-photo/fire-flame-background_1122-1234.jpg',
        speakerName: 'Narrador',
        dialogue: 'Você morreu. Nunca jogue farinha em um demônio de fogo.',
        choices: []
      }
    ]
  }
];
