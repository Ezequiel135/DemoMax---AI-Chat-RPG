
import { Transaction } from '../../models/economy.model';
import { generateUUID } from '../core/uuid.logic';

export function createTransaction(type: 'earn' | 'spend', amount: number, reason: string): Transaction {
  return {
    id: generateUUID(),
    type,
    amount,
    currency: 'SC',
    reason,
    timestamp: Date.now()
  };
}
