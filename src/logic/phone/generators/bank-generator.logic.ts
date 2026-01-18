
import { BankTransaction } from '../../../models/phone-content.model';
import { Character } from '../../../models/character.model';

export class BankGeneratorLogic {
  
  private static readonly MERCHANTS = [
    'Uber', 'iFood', 'Steam', 'Amazon', 'Starbucks', 'Netflix', 
    'Spotify', 'Mercado', 'Farmácia', 'Cinema', 'SHEIN', 'Shopee'
  ];

  static generate(character: Character): { balance: string, transactions: BankTransaction[] } {
    const isRich = character.tags.some(t => ['rich', 'wealthy', 'ojou', 'princess', 'ceo', 'celebrity'].includes(t.toLowerCase()));
    const isPoor = character.tags.some(t => ['poor', 'student', 'debt'].includes(t.toLowerCase()));

    // 1. Generate Balance based on Lore
    let balanceVal = 0;
    if (isRich) balanceVal = 50000 + Math.random() * 500000;
    else if (isPoor) balanceVal = Math.random() * 500;
    else balanceVal = 1000 + Math.random() * 5000;

    // Format to currency string
    const balance = balanceVal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    // 2. Generate Fake Transactions (Local Logic = 0 Internet usage)
    const transactions: BankTransaction[] = [];
    const count = 3 + Math.floor(Math.random() * 5);

    for (let i = 0; i < count; i++) {
      const isDebit = Math.random() > 0.2; // 80% spending
      const amount = isDebit 
        ? -(10 + Math.random() * 200) 
        : (500 + Math.random() * 2000);
      
      const date = new Date();
      date.setDate(date.getDate() - i); // Go back days

      transactions.push({
        merchant: isDebit ? this.getRandomMerchant() : 'Transferência Pix',
        amount: amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
        date: date.toLocaleDateString('pt-BR'),
        type: isDebit ? 'debit' : 'credit'
      });
    }

    return { balance, transactions };
  }

  private static getRandomMerchant(): string {
    return this.MERCHANTS[Math.floor(Math.random() * this.MERCHANTS.length)];
  }
}
