import React from 'react';
import { useCalculateBalances } from '../hooks/useCalculateBalances';
import { useAppSelector } from '../../../hooks/store';
import { Wallet } from 'lucide-react';

export const RunningBalancesList: React.FC = () => {
  const currentTrip = useAppSelector((state) => state.trip.currentTrip);
  const balances = useCalculateBalances();

  if (!currentTrip || balances.length === 0) return null;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-6">
      <div className="flex items-center gap-2 mb-4 text-slate-800 font-semibold text-lg">
        <Wallet size={20} className="text-primary-500" />
        <h2>Running Balances</h2>
      </div>

      <div className="space-y-3">
        {balances.map((b) => (
          <div key={b.memberId} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
            <div className="font-medium text-slate-700">{b.name}</div>
            <div className={`font-semibold ${b.balance > 0 ? 'text-green-600' : b.balance < 0 ? 'text-red-500' : 'text-slate-500'}`}>
              {b.balance > 0 ? '+' : ''}{b.balance.toFixed(2)}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 text-xs text-slate-400">
        <p>Positive balance: They are owed money.</p>
        <p>Negative balance: They owe money.</p>
      </div>
    </div>
  );
};
