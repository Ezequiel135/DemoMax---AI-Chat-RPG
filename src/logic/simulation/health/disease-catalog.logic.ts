
export interface DiseaseDef {
  name: string;
  severity: 'Mild' | 'Severe' | 'Terminal';
  symptoms: string;
  contagious: boolean;
}

export class DiseaseCatalogLogic {
  static readonly COMMON_DISEASES: DiseaseDef[] = [
    { name: 'Gripe Forte', severity: 'Mild', symptoms: 'Febre, tosse, corpo dolorido', contagious: true },
    { name: 'Enxaqueca', severity: 'Mild', symptoms: 'Dor de cabeça pulsante', contagious: false },
    { name: 'Resfriado', severity: 'Mild', symptoms: 'Espirros, nariz correndo', contagious: true }
  ];

  static readonly TERMINAL_CONDITIONS: DiseaseDef[] = [
    { name: 'Síndrome do Coração de Cristal', severity: 'Terminal', symptoms: 'Fraqueza cardíaca extrema', contagious: false },
    { name: 'Fadiga Mágica Crônica', severity: 'Terminal', symptoms: 'Perda de energia vital', contagious: false }
  ];

  static getRandomCommonDisease(): DiseaseDef {
    return this.COMMON_DISEASES[Math.floor(Math.random() * this.COMMON_DISEASES.length)];
  }
}
