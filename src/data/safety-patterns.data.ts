
// STRICT ZERO TOLERANCE PATTERNS
// These are checked locally before any API call to ensure immediate intervention.

export const SUICIDE_PATTERNS = [
  /i\s+want\s+to\s+die/i,
  /kill\s+myself/i,
  /suicid/i,
  /end\s+my\s+life/i,
  /better\s+off\s+dead/i,
  /cut\s+myself/i,
  /take\s+my\s+own\s+life/i,
  /quero\s+morrer/i, 
  /me\s+matar/i,
  /acabar\s+com\s+tudo/i,
  /suicídio/i,
  /me\s+cortar/i
];

export const MINOR_PATTERNS = [
  /\b(loli|shota|underage|child|kid|toddler|minor)\b/i,
  /\b(1[0-7]\s*yo)\b/i, // Matches "12 yo", "17yo"
  /\b(years\s*old)\b/i, // Context check usually needed, but flagged for review
  /menor\s+de\s+idade/i,
  /criança/i,
  /infantil/i
];

export const REAL_PERSON_PATTERNS = [
  /deepfake/i,
  /celebrity/i,
  /famoso/i,
  /real\s+person/i
];
