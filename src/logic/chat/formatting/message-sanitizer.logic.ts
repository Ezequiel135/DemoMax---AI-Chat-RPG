
/**
 * Corrige alucinações de formatação comuns da IA, especificamente
 * ações (*) colocadas incorretamente dentro de diálogos ("").
 */
export class MessageSanitizerLogic {
  
  static sanitize(text: string): string {
    let cleanText = text;

    // 1. Remove Markdown Bold (**texto**) e converte para *texto* (ação) ou texto normal
    // A IA as vezes usa ** para ação por erro.
    cleanText = cleanText.replace(/\*\*([^*]+)\*\*/g, '*$1*');

    // 2. Correção Crítica: Extrair *ação* de dentro de "diálogo"
    // Ex: "Olá *sorri* tudo bem?" -> "Olá" *sorri* "tudo bem?"
    // Regex complexo para identificar *...* dentro de "..."
    // Uma abordagem mais segura é fazer split e remontar
    
    // Substitui aspas curvas por retas para padronizar
    cleanText = cleanText.replace(/[\u201C\u201D]/g, '"');

    // Algoritmo de reparo simples:
    // Se encontrar uma ação *...* e estivermos 'dentro' de aspas (contagem ímpar de aspas antes), fechamos a aspa, colocamos a ação, e reabrimos.
    
    const chars = cleanText.split('');
    let inQuote = false;
    let buffer = '';
    
    for (let i = 0; i < chars.length; i++) {
        const c = chars[i];
        
        if (c === '"') {
            inQuote = !inQuote;
            buffer += c;
        } else if (c === '*' && inQuote) {
            // Detectou início ou fim de ação DENTRO de aspas
            // Fecha a aspa atual, coloca o asterisco, e reabre a aspa (se for o caso)
            // Mas precisamos saber se é abertura ou fechamento de *.
            // Simplificação: Sempre que ver *, fecha aspas, poe *, reabre aspas.
            // "Texto *ação* texto" -> "Texto " *ação* " texto"
            // Isso gera aspas vazias "" que limparemos depois.
            buffer += '"' + c + '"'; 
        } else {
            buffer += c;
        }
    }
    
    // Limpeza de artefatos gerados pelo hack acima
    // Remove aspas vazias "" resultantes
    buffer = buffer.replace(/""/g, '');
    
    // Remove espaços duplos criados
    buffer = buffer.replace(/\s+/g, ' ');
    
    return buffer.trim();
  }
}
