import { useCalculateBalances } from './useCalculateBalances';

export interface Settlement {
  fromId: string;
  fromName: string;
  toId: string;
  toName: string;
  amount: number;
}

export const useSettleUp = (): Settlement[] => {
  const balances = useCalculateBalances();

  if (balances.length === 0) return [];

  // Create deep copies to avoid mutating the original
  const debtors = balances
    .filter((b) => b.balance < -0.01) // Using -0.01 to avoid floating point precision issues
    .map((b) => ({ ...b, balance: Math.abs(b.balance) }))
    .sort((a, b) => b.balance - a.balance); // Sort by largest debt first

  const creditors = balances
    .filter((b) => b.balance > 0.01)
    .map((b) => ({ ...b }))
    .sort((a, b) => b.balance - a.balance); // Sort by largest credit first

  const settlements: Settlement[] = [];
  
  let dIndex = 0;
  let cIndex = 0;

  while (dIndex < debtors.length && cIndex < creditors.length) {
    const debtor = debtors[dIndex];
    const creditor = creditors[cIndex];

    const amount = Math.min(debtor.balance, creditor.balance);

    if (amount > 0.01) {
      settlements.push({
        fromId: debtor.memberId,
        fromName: debtor.name,
        toId: creditor.memberId,
        toName: creditor.name,
        amount: Number(amount.toFixed(2)),
      });
    }

    debtor.balance -= amount;
    creditor.balance -= amount;

    if (debtor.balance < 0.01) dIndex++;
    if (creditor.balance < 0.01) cIndex++;
  }

  return settlements;
};
