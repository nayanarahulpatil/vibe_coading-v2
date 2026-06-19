import React, { useState } from 'react';
import { useAppSelector } from '../../../hooks/store';
import { Receipt, X, ZoomIn } from 'lucide-react';
import { ReceiptImage } from '../../../components/ReceiptImage';

const CATEGORY_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  Food: { bg: 'bg-amber-50/80', text: 'text-amber-800', border: 'border-amber-200/50' },
  Transport: { bg: 'bg-blue-50/80', text: 'text-blue-800', border: 'border-blue-200/50' },
  Accommodation: { bg: 'bg-emerald-50/80', text: 'text-emerald-800', border: 'border-emerald-200/50' },
  Entertainment: { bg: 'bg-purple-50/80', text: 'text-purple-800', border: 'border-purple-200/50' },
  Other: { bg: 'bg-slate-50/80', text: 'text-slate-650', border: 'border-slate-200/50' },
};

export const ExpenseList: React.FC = () => {
  const currentTrip = useAppSelector((state) => state.trip.currentTrip);
  const [selectedExpenseId, setSelectedExpenseId] = useState<string | null>(null);

  if (!currentTrip) return null;

  const { expenses, members, baseCurrency } = currentTrip;

  const getPayerName = (payerId: string) => {
    return members.find((m) => m.id === payerId)?.name || 'Unknown Payer';
  };

  const sortedExpenses = [...expenses].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200/80 transition-all duration-300 hover:shadow-md">
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-5 text-slate-800 font-bold text-lg">
        <Receipt size={20} className="text-secondary" />
        <h2>Expense Log</h2>
      </div>

      {sortedExpenses.length === 0 ? (
        <div className="text-slate-400 italic p-6 bg-slate-50 border border-slate-100 rounded-2xl text-center text-sm">
          No expenses recorded yet. Save an expense to start tracking.
        </div>
      ) : (
        <div className="divide-y divide-slate-100 max-h-[420px] overflow-y-auto pr-1">
          {sortedExpenses.map((expense) => {
            const payerName = getPayerName(expense.payerId);
            const style = CATEGORY_STYLES[expense.category] || CATEGORY_STYLES.Other;
            const dateFormatted = new Date(expense.date).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
            });

            const isMultiCurrency = expense.currency !== baseCurrency;

            return (
              <div key={expense.id} className="py-3.5 flex items-center justify-between gap-3 group/row">
                <div className="flex items-center gap-3 min-w-0">
                  {/* Category Badge & Description */}
                  <div className="flex flex-col gap-1.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded border ${style.bg} ${style.text} ${style.border}`}
                      >
                        {expense.category}
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                        {dateFormatted}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-slate-800 truncate" title={expense.description}>
                      {expense.description}
                    </span>
                    <span className="text-xs text-slate-400">
                      Paid by <span className="font-semibold text-slate-500">{payerName}</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {/* Amount Block */}
                  <div className="text-right flex flex-col items-end">
                    <span className="font-extrabold text-slate-800 text-sm">
                      {baseCurrency} {expense.amount.toFixed(2)}
                    </span>
                    {isMultiCurrency && (
                      <span className="text-[11px] text-slate-400 font-semibold mt-0.5">
                        ({expense.currency} {expense.amountOriginal.toFixed(2)})
                      </span>
                    )}
                  </div>

                  {/* Receipt Thumbnail */}
                  {expense.receiptPhotoUrl ? (
                    <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-slate-200/80 shadow-sm cursor-zoom-in group/thumb shrink-0 active:scale-95 transition-all duration-200">
                      <ReceiptImage
                        expenseId={expense.id}
                        receiptUrl={expense.receiptPhotoUrl}
                        className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-200"
                        onClick={() => setSelectedExpenseId(expense.id)}
                      />
                      <div 
                        className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover/thumb:opacity-100 flex items-center justify-center transition-opacity pointer-events-none duration-150"
                      >
                        <ZoomIn size={12} className="text-white" />
                      </div>
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-lg bg-slate-50 border border-dashed border-slate-200 flex items-center justify-center shrink-0" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Lightbox Modal */}
      {selectedExpenseId && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedExpenseId(null)}
        >
          <div 
            className="relative bg-white rounded-3xl p-3 max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedExpenseId(null)}
              className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center shadow-lg transition-all duration-200 border border-white/10 active:scale-90 cursor-pointer"
            >
              <X size={16} />
            </button>

            <div className="w-full overflow-hidden rounded-2xl flex items-center justify-center bg-slate-50 border border-slate-100">
              <ReceiptImage
                expenseId={selectedExpenseId}
                receiptUrl={sortedExpenses.find((e) => e.id === selectedExpenseId)?.receiptPhotoUrl}
                className="max-w-full max-h-[78vh] object-contain rounded-xl"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
