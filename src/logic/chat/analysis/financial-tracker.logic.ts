
import { Message } from '../../../models/message.model';

export class FinancialTrackerLogic {
  
  static analyzeFinancialContext(messages: Message[]): string {
    const recentMsgs = messages.slice(-50).filter(m => m.role === 'user');
    let detectedTransfers: string[] = [];
    
    const patterns = [
      /(?:enviei|transferi|fiz\s+um\s+pix|pix\s+de|toma|presente)\s+(?:R\$)?\s*(\d+(?:\.\d{3})*(?:,\d+)?)/i,
      /(\d+(?:\.\d{3})*(?:,\d+)?)\s+(?:reais|conto|pilas|dólares)/i,
      /(\d+)[kK]\s+(?:reais|pra\s+vc)?/i,
      /(um|dois|três|quatro|cinco|dez)\s+mil\s+reais/i
    ];

    recentMsgs.forEach(msg => {
      const txt = msg.text.toLowerCase();
      if (txt.includes('pix') || txt.includes('dinheiro') || txt.includes('enviei') || txt.includes('transferi') || txt.includes('k')) {
        let value = 0;
        let found = false;

        patterns.forEach(regex => {
          if (found) return;
          const match = msg.text.match(regex);
          if (match) {
             let valStr = match[1].toLowerCase();
             if (msg.text.toLowerCase().includes(valStr + 'k')) {
                value = parseFloat(valStr) * 1000;
             } else {
                valStr = valStr.replace(/\./g, '').replace(',', '.');
                value = parseFloat(valStr);
             }
             found = true;
          }
        });

        if (found && !isNaN(value) && value > 0) {
           detectedTransfers.push(`Transferência de R$ ${value.toFixed(2)}`);
        }
      }
    });

    if (detectedTransfers.length === 0) return '';

    return `
    [REAL TIME FINANCIAL EVENTS]
    User recently sent money in chat:
    - ${detectedTransfers.join('\n- ')}
    INSTRUCTION: Create a "Credit" transaction in the bank history. SUM these values to balance.
    `;
  }
}
