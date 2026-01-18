import { Injectable } from '@angular/core';
import { scanTextForViolations, ViolationType } from '../../logic/safety/safety-scanner.logic';

export { ViolationType };

@Injectable({
  providedIn: 'root'
})
export class TextFilterService {
  analyze(text: string): ViolationType {
    return scanTextForViolations(text);
  }
}