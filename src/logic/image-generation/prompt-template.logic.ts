
export interface StyleConfig {
  angle: string;
  distance: string;
  lighting: string;
  lens: string;
  material: string;
  generalStyle: string;
  palette: string;
  pose: string;
  expression: string;
  context: string;
}

/**
 * Monta o prompt final seguindo a estrutura exata solicitada.
 */
export function buildStructuredPrompt(subject: string, config: StyleConfig): string {
  return `
🎯 Tema Principal: Crie uma imagem de ${subject}

📷 Configuração da Câmera:
Ângulo: ${config.angle}
Distância: ${config.distance}
Iluminação: ${config.lighting}
Lente: ${config.lens}

🎨 Textura e Estilo Visual:
Material/Detalhamento: ${config.material}
Estilo Geral: ${config.generalStyle}
Paleta de Cores: ${config.palette}

🧍‍♀️ Pose e Composição:
Posicionamento: ${config.pose}
Expressão/Atitude: ${config.expression}
Interação/Contexto: ${config.context}
  `.trim();
}
