
export interface PhoneMessage {
  sender: string; // 'me' or 'other'
  text: string;
  time: string;
}

export interface PhoneContact {
  name: string;
  avatarSeed: string; // For picsum
  lastMessage: string;
  history: PhoneMessage[];
}

export interface BankTransaction {
  merchant: string;
  amount: string; // e.g. "-$50.00" or "+$2000.00"
  date: string;
  type: 'debit' | 'credit';
}

export interface Note {
  title: string;
  content: string;
  date: string;
}

export interface PhotoItem {
  description: string;
  visualPrompt: string; // To generate if clicked
  timestamp: string;
}

export interface PhoneData {
  ownerName: string;
  modelType: string; // e.g. "CyberPhone X"
  currentLocation: string; // For map
  batteryLevel: number;
  contacts: PhoneContact[];
  browserHistory: string[];
  bankAccount: {
    balance: string;
    transactions: BankTransaction[];
  };
  notes: Note[];
  gallery: PhotoItem[];
}
