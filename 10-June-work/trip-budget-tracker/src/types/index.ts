export interface Member {
  id: string;
  name: string;
  upiId?: string;
  paypalUsername?: string;
}

export interface Expense {
  id: string;
  payerId: string;
  amount: number; // base-currency converted amount
  amountOriginal: number; // user-entered amount in original currency
  currency: string; // user-selected currency (e.g. USD)
  fxRate: number; // rate conversion factor: 1 base = fxRate original
  category: 'Food' | 'Transport' | 'Accommodation' | 'Entertainment' | 'Other';
  description: string;
  date: string;
  receiptPhotoUrl?: string; // base64 string
  isOfflineRate?: boolean;
  rateFetchedAt?: string;
}

export interface Trip {
  id: string;
  title: string;
  members: Member[];
  expenses: Expense[];
  baseCurrency: string;
}
