
import { StyleConfig } from './prompt-template.logic';

/**
 * Constrói um prompt otimizado para CAPAS (Cenário + Título + Atmosfera)
 * Diferente do prompt de personagens que foca no rosto/corpo.
 */
export function buildNovelCoverPrompt(title: string, description: string, config: StyleConfig, type: 'Book' | 'Game'): string {
  return `
🎯 Objetivo: Crie uma capa oficial de alta qualidade para um ${type === 'Book' ? 'Livro Best-Seller' : 'Visual Novel/Jogo'}.
Título da Obra: "${title}"
Contexto/Sinopse: ${description}

📷 Composição da Capa:
Enquadramento: ${type === 'Book' ? 'Vertical book cover composition, rule of thirds, space for title at top' : 'Cinematic key visual, dynamic composition'}
Ângulo: ${config.angle}
Distância: Wide shot or Mid-shot (focus on atmosphere)
Iluminação: ${config.lighting}, dramatic shadows suitable for cover art

🎨 Estilo Visual & Atmosfera:
Estilo de Arte: ${config.generalStyle}
Textura: ${config.material}
Paleta de Cores: ${config.palette}

🌍 Cenário e Elementos:
Ambiente: Detailed background representing the synopsis location.
Interação: Characters (if any) integrated into the scene, not just standing.
Atmosfera Geral: ${config.context}

🚫 Negative Prompt: Text, watermarks, blurry, low quality, cropped, bad anatomy.
  `.trim();
}
