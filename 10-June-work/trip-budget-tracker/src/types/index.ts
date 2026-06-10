export interface Member {
  id: string;
  name: string;
}

export interface Expense {
  id: string;
  payerId: string;
  amount: number;
  description: string;
  date: string;
}

export interface Trip {
  id: string;
  title: string;
  members: Member[];
  expenses: Expense[];
}
