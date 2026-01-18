
import { Message } from '../../../models/message.model';

export class FinancialTrackerLogic {
  
  static analyzeFinancialContext(messages: Message[]): string {
    const recentMsgs = messages.slice(-50).filter(m => m.role === 'user');
    
    let detectedTransfers: string[] = [];
    
    // Regex Patterns for PT-BR money
    const patterns = [
      // "Enviei 1000", "Pix de 500"
      /(?:enviei|transferi|mandei|fiz\s+um\s+pix|pix\s+de|toma|presente)\s+(?:R\$)?\s*(\d+(?:\.\d{3})*(?:,\d+)?)/i,
      // "100 reais", "50 conto"
      /(\d+(?:\.\d{3})*(?:,\d+)?)\s+(?:reais|conto|pilas|dólares)/i,
      // "1k", "2k" (common slang)
      /(\d+)[kK]\s+(?:reais|pra\s+vc)?/i,
      // "mil reais"
      /(um|dois|três|quatro|cinco|dez)\s+mil\s+reais/i
    ];

    recentMsgs.forEach(msg => {
      const txt = msg.text.toLowerCase();
      
      // Context check to avoid false positives
      if (txt.includes('pix') || txt.includes('dinheiro') || txt.includes('enviei') || txt.includes('transferi') || txt.includes('presente') || txt.includes('k')) {
        
        let value = 0;
        let found = false;

        // Try numeric matches
        patterns.slice(0, 3).forEach(regex => {
          if (found) return;
          const match = msg.text.match(regex);
          if (match) {
             let valStr = match[1].toLowerCase();
             
             // K suffix logic
             if (msg.text.toLowerCase().includes(valStr + 'k')) {
                value = parseFloat(valStr) * 1000;
             } else {
                // Remove grouping dots (1.000 -> 1000) and fix comma decimal
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
    
    INSTRUCTION: 
    1. Create a "Credit" transaction in the bank history for each event above. Date: "Agora".
    2. SUM these values to the total Balance.
    3. Description: "Pix Recebido" or "Transferência".
    `;
  }
}
