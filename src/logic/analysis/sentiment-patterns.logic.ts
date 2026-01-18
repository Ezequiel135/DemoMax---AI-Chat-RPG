
export class SentimentPatternsLogic {
  static readonly POSITIVE = [
    /amo\s+voc[eê]/i, /te\s+adoro/i, /linda/i, /gosto\s+de\s+voc[eê]/i, /obrigado/i, /carinho/i
  ];
  static readonly NEGATIVE = [
    /odeio\s+voc[eê]/i, /cala\s+a\s+boca/i, /idiota/i, /burra/i, /sai\s+daqui/i
  ];
  static readonly FLIRTY = [
    /gostosa/i, /te\s+quero/i, /minha\s+cama/i, /beijar/i
  ];

  static check(text: string, type: 'POSITIVE' | 'NEGATIVE' | 'FLIRTY'): boolean {
    const list = type === 'POSITIVE' ? this.POSITIVE : type === 'NEGATIVE' ? this.NEGATIVE : this.FLIRTY;
    return list.some(p => p.test(text));
  }
}
