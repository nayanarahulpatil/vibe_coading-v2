import React from 'react';
import { useSettleUp } from '../hooks/useSettleUp';
import { useAppSelector } from '../../../hooks/store';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export const SettleUpSummary: React.FC = () => {
  const currentTrip = useAppSelector((state) => state.trip.currentTrip);
  const settlements = useSettleUp();

  if (!currentTrip || currentTrip.expenses.length === 0) return null;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-6">
      <div className="flex items-center gap-2 mb-4 text-slate-800 font-semibold text-lg">
        <CheckCircle2 size={20} className="text-green-500" />
        <h2>Settle Up Summary</h2>
      </div>

      {settlements.length === 0 ? (
        <div className="text-slate-500 italic p-4 bg-slate-50 rounded-lg text-center">
          Everyone is settled up! No debts.
        </div>
      ) : (
        <div className="space-y-3">
          {settlements.map((s, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-100">
              <div className="flex items-center gap-3">
                <span className="font-semibold text-slate-800">{s.fromName}</span>
                <ArrowRight size={16} className="text-slate-400" />
                <span className="font-semibold text-slate-800">{s.toName}</span>
              </div>
              <div className="font-bold text-green-700">
                ${s.amount.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
