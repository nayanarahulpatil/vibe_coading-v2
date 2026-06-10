import { useAppSelector } from '../../../hooks/store';

export interface MemberBalance {
  memberId: string;
  name: string;
  paid: number;
  share: number;
  balance: number; // positive = owed money, negative = owes money
}

export const useCalculateBalances = () => {
  const currentTrip = useAppSelector((state) => state.trip.currentTrip);

  if (!currentTrip || currentTrip.members.length === 0) {
    return [];
  }

  const { members, expenses } = currentTrip;
  
  const totalExpense = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const fairShare = totalExpense / members.length;

  const balances: MemberBalance[] = members.map((member) => {
    const paidByMember = expenses
      .filter((exp) => exp.payerId === member.id)
      .reduce((sum, exp) => sum + exp.amount, 0);

    return {
      memberId: member.id,
      name: member.name,
      paid: paidByMember,
      share: fairShare,
      balance: paidByMember - fairShare,
    };
  });

  return balances;
};
