import React from 'react';
import { useSettleUp } from '../hooks/useSettleUp';
import { useAppSelector } from '../../../hooks/store';
import { CheckCircle2, ArrowRight, ExternalLink } from 'lucide-react';

export const SettleUpSummary: React.FC = () => {
  const currentTrip = useAppSelector((state) => state.trip.currentTrip);
  const settlements = useSettleUp();

  if (!currentTrip || currentTrip.expenses.length === 0) return null;

  const getCreditorDetails = (memberId: string) => {
    return currentTrip.members.find((m) => m.id === memberId);
  };

  const getUpiLink = (upiId: string, payeeName: string, amount: number, baseCurrency: string) => {
    return `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${amount.toFixed(2)}&cu=${baseCurrency}`;
  };

  const getPaypalLink = (username: string, amount: number) => {
    return `https://www.paypal.me/${username}/${amount.toFixed(2)}`;
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200/80 transition-all duration-305 hover:shadow-md">
      <div className="flex items-center gap-2.5 mb-4 text-slate-805 font-bold text-lg">
        <CheckCircle2 size={20} className="text-emerald-600" />
        <h2>Settle Up Summary</h2>
      </div>

      {settlements.length === 0 ? (
        <div className="text-slate-400 italic p-4 bg-slate-50 border border-slate-100 rounded-2xl text-center text-sm">
          Everyone is settled up! No debts.
        </div>
      ) : (
        <div className="space-y-3">
          {settlements.map((s, idx) => {
            const creditor = getCreditorDetails(s.toId);
            const hasUpi = !!creditor?.upiId;
            const hasPaypal = !!creditor?.paypalUsername;

            return (
              <div key={idx} className="p-4 bg-gradient-to-r from-emerald-50/20 to-teal-50/20 backdrop-blur-sm rounded-2xl border border-emerald-100/40 shadow-sm hover:shadow-md transition-all space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-800 text-sm">{s.fromName}</span>
                    <ArrowRight size={14} className="text-slate-400" />
                    <span className="font-bold text-slate-800 text-sm">{s.toName}</span>
                  </div>
                  <div className="font-extrabold text-emerald-600 text-base">
                    {currentTrip.baseCurrency} {s.amount.toFixed(2)}
                  </div>
                </div>
                
                {(hasUpi || hasPaypal) && (
                  <div className="flex flex-wrap gap-2 pt-2.5 border-t border-slate-100">
                    {hasUpi && (
                      <a
                        href={getUpiLink(creditor!.upiId!, creditor!.name, s.amount, currentTrip.baseCurrency)}
                        className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-lg transition-all shadow-sm cursor-pointer select-none active:scale-95 duration-200 no-underline decoration-transparent bg-indigo-650 hover:bg-indigo-700 hover:shadow-indigo-650/20 hover:shadow text-white"
                      >
                        <span>Pay via UPI</span>
                        <ExternalLink size={11} />
                      </a>
                    )}
                    {hasPaypal && (
                      <a
                        href={getPaypalLink(creditor!.paypalUsername!, s.amount)}
                        className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-lg transition-all shadow-sm cursor-pointer select-none active:scale-95 duration-200 no-underline decoration-transparent bg-amber-500 hover:bg-amber-600 hover:shadow-amber-500/20 hover:shadow text-slate-900"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span>PayPal Me</span>
                        <ExternalLink size={11} />
                      </a>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
