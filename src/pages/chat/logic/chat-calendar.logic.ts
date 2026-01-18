
import { ToolEntry } from '../../../services/chat-history.service';

export interface CalendarDay {
  day: number;
  dateStr: string;
  hasEntry: boolean;
}

export class ChatCalendarLogic {
  
  static getDaysInMonth(currentDate: Date, history: ToolEntry[]): (CalendarDay | null)[] {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const days: (CalendarDay | null)[] = [];
    
    // Padding para dias vazios antes do dia 1
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }
    
    // Dias reais
    for (let i = 1; i <= lastDay.getDate(); i++) {
       const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(i).padStart(2,'0')}`;
       const hasEntry = history.some(h => h.type === 'diary' && h.dateRef === dateStr);
       
       days.push({ 
         day: i, 
         dateStr, 
         hasEntry 
       });
    }
    
    return days;
  }

  static moveMonth(current: Date, delta: number): Date {
    const newDate = new Date(current);
    newDate.setMonth(newDate.getMonth() + delta);
    return newDate;
  }
}
