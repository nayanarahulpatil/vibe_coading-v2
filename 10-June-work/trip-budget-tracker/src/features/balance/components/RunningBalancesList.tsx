import React from 'react';
import { useCalculateBalances } from '../hooks/useCalculateBalances';
import { useAppSelector } from '../../../hooks/store';
import { Wallet, Paperclip } from 'lucide-react';

export const RunningBalancesList: React.FC = () => {
  const currentTrip = useAppSelector((state) => state.trip.currentTrip);
  const balances = useCalculateBalances();

  if (!currentTrip || balances.length === 0) return null;

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200/80 transition-all duration-300 hover:shadow-md">
      <div className="flex items-center gap-2.5 mb-4 text-slate-800 font-bold text-lg">
        <Wallet size={20} className="text-primary" />
        <h2>Running Balances</h2>
      </div>

      <div className="space-y-2">
        {balances.map((b) => {
          const receiptCount = currentTrip.expenses.filter(
            (exp) => exp.payerId === b.memberId && !!exp.receiptPhotoUrl
          ).length;

          return (
            <div key={b.memberId} className="flex justify-between items-center p-3 bg-slate-50 border border-slate-100 rounded-2xl shadow-sm hover:border-slate-200 transition-colors">
              <div className="flex items-center gap-2 font-semibold text-slate-800 text-sm">
                <span>{b.name}</span>
                {receiptCount > 0 && (
                  <span 
                    className="inline-flex items-center gap-0.5 text-[10px] text-slate-400 bg-slate-200/50 border border-slate-200/20 px-1.5 py-0.5 rounded-md"
                    title={`${receiptCount} receipt(s) attached`}
                  >
                    <Paperclip size={10} className="shrink-0" />
                    <span>{receiptCount}</span>
                  </span>
                )}
              </div>
              <div className={`font-extrabold text-sm ${
                b.balance > 0 
                  ? 'text-emerald-650' 
                  : b.balance < 0 
                    ? 'text-rose-600' 
                    : 'text-slate-400'
              }`}>
                {b.balance > 0 ? '+' : ''}{currentTrip.baseCurrency} {b.balance.toFixed(2)}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="text-[10px] text-slate-400 font-semibold space-y-1 border-t border-slate-200/60 pt-3 mt-3">
        <p>Positive balance: They are owed money.</p>
        <p>Negative balance: They owe money.</p>
      </div>
    </div>
  );
};
