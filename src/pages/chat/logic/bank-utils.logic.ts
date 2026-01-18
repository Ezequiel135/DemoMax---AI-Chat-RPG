
export class BankUtilsLogic {
  
  /**
   * Formata uma string ou número para o formato de moeda Real (R$).
   */
  static formatCurrency(value: string | number): string {
    let numVal: number;

    if (typeof value === 'string') {
      // Tenta limpar strings como "R$ 1.200,00" para float
      const cleanStr = value.replace(/[^0-9,-]/g, '').replace(',', '.');
      numVal = parseFloat(cleanStr);
    } else {
      numVal = value;
    }

    if (isNaN(numVal)) return 'R$ 0,00';

    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(numVal);
  }

  /**
   * Determina se uma transação é positiva (entrada) ou negativa (saída)
   * Baseado no tipo ou no sinal do valor.
   */
  static getTransactionType(type: 'credit' | 'debit', amountStr: string): 'positive' | 'negative' {
    if (type === 'credit') return 'positive';
    if (type === 'debit') return 'negative';
    
    // Fallback: Tenta detectar pelo sinal na string ("-R$ 50")
    return amountStr.includes('-') ? 'negative' : 'positive';
  }
}
