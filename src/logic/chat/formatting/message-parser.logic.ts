
export interface ParsedMessagePart {
  type: 'text' | 'action';
  content: string;
}

export function parseChatMessage(text: string): ParsedMessagePart[] {
    if (!text) return [];
    
    const parts: ParsedMessagePart[] = [];
    
    // Regex matches *actions* while respecting boundaries
    // Note: The sanitization logic should have already moved actions outside of quotes.
    const regex = /\*([^*]+)\*/g;
    let lastIndex = 0;
    let match;
    
    while ((match = regex.exec(text)) !== null) {
       // Push text before action
       if (match.index > lastIndex) {
         const content = text.substring(lastIndex, match.index);
         if (content) parts.push({ type: 'text', content });
       }
       
       // Push action
       const actionContent = match[1];
       if (actionContent) parts.push({ type: 'action', content: actionContent });
       
       lastIndex = regex.lastIndex;
    }
    
    // Push remaining text
    if (lastIndex < text.length) {
      const content = text.substring(lastIndex);
      if (content) parts.push({ type: 'text', content });
    }
    
    return parts;
}
