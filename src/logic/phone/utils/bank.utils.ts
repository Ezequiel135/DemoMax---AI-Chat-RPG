
export class BankUtilsLogic {
  static formatCurrency(value: string | number): string {
    let numVal: number;
    if (typeof value === 'string') {
      const cleanStr = value.replace(/[^0-9,-]/g, '').replace(',', '.');
      numVal = parseFloat(cleanStr);
    } else {
      numVal = value;
    }
    if (isNaN(numVal)) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(numVal);
  }

  static getTransactionType(type: 'credit' | 'debit', amountStr: string): 'positive' | 'negative' {
    if (type === 'credit') return 'positive';
    if (type === 'debit') return 'negative';
    return amountStr.includes('-') ? 'negative' : 'positive';
  }
}
