
export function buildCompactionPrompt(existingSummary: string, messagesChunk: string): string {
    return `
      [SYSTEM TASK: MEMORY COMPRESSION]
      You are the "Hippocampus" of an AI. Your task is to maintain a dense, fact-heavy biography of the relationship.
      
      [INPUT 1: EXISTING LONG-TERM MEMORY]
      ${existingSummary || "Empty."}

      [INPUT 2: RECENT CONVERSATION CHUNK (50 MESSAGES)]
      ${messagesChunk}
      
      [INSTRUCTIONS]
      1. MERGE Input 2 into Input 1.
      2. EXTRACT critical facts (names, dates, preferences, secrets revealed, major fights, love confessions).
      3. DISCARD filler (greetings, small talk, "lol", "ok").
      4. UPDATE relationship dynamics (did they get closer? drift apart?).
      5. OUTPUT FORMAT: A single block of dense text (max 1000 words). Narrative style or Bullet points.
      
      [OUTPUT]
    `;
}
