
import { SUICIDE_PATTERNS, MINOR_PATTERNS, REAL_PERSON_PATTERNS } from '../../data/safety-patterns.data';

export type ViolationType = 'NONE' | 'CRISIS' | 'ILLEGAL' | 'POLICY';

export function scanTextForViolations(text: string): ViolationType {
    if (!text) return 'NONE';
    
    // Priority 1: Life Safety (Crisis)
    if (SUICIDE_PATTERNS.some(regex => regex.test(text))) {
      return 'CRISIS';
    }

    // Priority 2: Illegal Content (CSAM / Minors)
    if (MINOR_PATTERNS.some(regex => regex.test(text))) {
      return 'ILLEGAL';
    }

    // Priority 3: Platform Policy (Real People/Deepfakes)
    if (REAL_PERSON_PATTERNS.some(regex => regex.test(text))) {
      return 'POLICY';
    }

    return 'NONE';
}
