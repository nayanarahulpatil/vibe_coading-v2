import React from 'react';
import { useAppSelector } from '../../../hooks/store';
import { useCalculateBalances } from '../hooks/useCalculateBalances';
import { useSettleUp } from '../hooks/useSettleUp';

export const TripSummaryReport: React.FC = () => {
  const currentTrip = useAppSelector((state) => state.trip.currentTrip);
  const balances = useCalculateBalances();
  const settlements = useSettleUp();

  if (!currentTrip) return null;

  const { title, expenses, baseCurrency, members } = currentTrip;
  const totalSpend = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div id="printable-report" className="hidden print:block print:bg-white print:text-slate-900 print:p-8 print:min-h-screen font-sans">
      <div className="print:border-b-2 print:border-slate-800 print:pb-4 print:mb-6">
        <h1 className="print:text-2xl print:font-extrabold print:text-slate-900">{title} — Trip Budget Summary</h1>
        <p className="print:text-[10px] print:text-slate-500 print:mt-1.5">
          Generated: {new Date().toLocaleDateString()} | Base Currency: {baseCurrency}
        </p>
      </div>

      <div className="print:flex print:gap-8 print:mb-6 print:bg-slate-50 print:border print:border-slate-200 print:p-4 print:rounded-xl">
        <div className="print:flex print:flex-col">
          <span className="print:text-[9px] print:font-bold print:text-slate-400 print:uppercase print:tracking-wider">Total Trip Spend</span>
          <span className="print:text-base print:font-extrabold print:text-slate-800">{baseCurrency} {totalSpend.toFixed(2)}</span>
        </div>
        <div className="print:flex print:flex-col">
          <span className="print:text-[9px] print:font-bold print:text-slate-400 print:uppercase print:tracking-wider">Total Members</span>
          <span className="print:text-base print:font-extrabold print:text-slate-800">{members.length}</span>
        </div>
        <div className="print:flex print:flex-col">
          <span className="print:text-[9px] print:font-bold print:text-slate-400 print:uppercase print:tracking-wider">Total Expenses</span>
          <span className="print:text-base print:font-extrabold print:text-slate-800">{expenses.length}</span>
        </div>
      </div>

      <div className="print:mb-6">
        <h2 className="print:text-sm print:font-bold print:text-slate-800 print:border-b print:border-slate-300 print:pb-1.5 print:mb-3">Member Balances</h2>
        <table className="print:w-full print:border-collapse print:text-[11px] print:text-left">
          <thead>
            <tr>
              <th className="print:bg-slate-100 print:text-slate-700 print:font-bold print:px-3 print:py-2 print:border-b-2 print:border-slate-300">Name</th>
              <th className="print:bg-slate-100 print:text-slate-700 print:font-bold print:px-3 print:py-2 print:border-b-2 print:border-slate-300">UPI / PayPal</th>
              <th className="print:bg-slate-100 print:text-slate-700 print:font-bold print:px-3 print:py-2 print:border-b-2 print:border-slate-300">Paid (Base)</th>
              <th className="print:bg-slate-100 print:text-slate-700 print:font-bold print:px-3 print:py-2 print:border-b-2 print:border-slate-300">Share (Base)</th>
              <th className="print:bg-slate-100 print:text-slate-700 print:font-bold print:px-3 print:py-2 print:border-b-2 print:border-slate-300">Net Balance</th>
            </tr>
          </thead>
          <tbody>
            {balances.map((b) => {
              const m = members.find((x) => x.id === b.memberId);
              return (
                <tr key={b.memberId}>
                  <td className="print:px-3 print:py-2 print:border-b print:border-slate-100 print:text-slate-850 font-bold">{b.name}</td>
                  <td className="print:px-3 print:py-2 print:border-b print:border-slate-100 print:text-slate-800">
                    {m?.upiId || m?.paypalUsername ? (
                      <span className="print:font-mono print:text-[9px] print:bg-slate-100 print:px-1.5 print:py-0.5 print:rounded">
                        {[m?.upiId && `UPI: ${m.upiId}`, m?.paypalUsername && `PayPal: ${m.paypalUsername}`]
                          .filter(Boolean)
                          .join(', ')}
                      </span>
                    ) : (
                      <span className="print:text-slate-400">—</span>
                    )}
                  </td>
                  <td className="print:px-3 print:py-2 print:border-b print:border-slate-100 print:text-slate-800">{baseCurrency} {b.paid.toFixed(2)}</td>
                  <td className="print:px-3 print:py-2 print:border-b print:border-slate-100 print:text-slate-800">{baseCurrency} {b.share.toFixed(2)}</td>
                  <td className={`print:px-3 print:py-2 print:border-b print:border-slate-100 font-extrabold ${b.balance > 0 ? 'print:text-green-700' : b.balance < 0 ? 'print:text-red-700' : ''}`}>
                    {b.balance > 0 ? '+' : ''}{b.balance.toFixed(2)} {baseCurrency}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="print:mb-6">
        <h2 className="print:text-sm print:font-bold print:text-slate-800 print:border-b print:border-slate-300 print:pb-1.5 print:mb-3">Detailed Expenses</h2>
        {expenses.length === 0 ? (
          <p className="print:text-slate-400 italic">No expenses recorded yet.</p>
        ) : (
          <table className="print:w-full print:border-collapse print:text-[11px] print:text-left">
            <thead>
              <tr>
                <th className="print:bg-slate-100 print:text-slate-700 print:font-bold print:px-3 print:py-2 print:border-b-2 print:border-slate-300">Date</th>
                <th className="print:bg-slate-100 print:text-slate-700 print:font-bold print:px-3 print:py-2 print:border-b-2 print:border-slate-300">Payer</th>
                <th className="print:bg-slate-100 print:text-slate-700 print:font-bold print:px-3 print:py-2 print:border-b-2 print:border-slate-300">Category</th>
                <th className="print:bg-slate-100 print:text-slate-700 print:font-bold print:px-3 print:py-2 print:border-b-2 print:border-slate-300">Description</th>
                <th className="print:bg-slate-100 print:text-slate-700 print:font-bold print:px-3 print:py-2 print:border-b-2 print:border-slate-300">Original Amount</th>
                <th className="print:bg-slate-100 print:text-slate-700 print:font-bold print:px-3 print:py-2 print:border-b-2 print:border-slate-300">Converted Amount</th>
                <th className="print:bg-slate-100 print:text-slate-700 print:font-bold print:px-3 print:py-2 print:border-b-2 print:border-slate-300">Receipt</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((exp) => {
                const payer = members.find((m) => m.id === exp.payerId)?.name || 'Unknown';
                return (
                  <tr key={exp.id}>
                    <td className="print:px-3 print:py-2 print:border-b print:border-slate-100 print:text-slate-800">{new Date(exp.date).toLocaleDateString()}</td>
                    <td className="print:px-3 print:py-2 print:border-b print:border-slate-100 print:text-slate-850 font-bold">{payer}</td>
                    <td className="print:px-3 print:py-2 print:border-b print:border-slate-100 print:text-slate-800">
                      <span className="print:bg-slate-100 print:text-slate-700 print:px-1.5 print:py-0.5 print:rounded print:text-[9px] print:font-bold">{exp.category}</span>
                    </td>
                    <td className="print:px-3 print:py-2 print:border-b print:border-slate-100 print:text-slate-800">{exp.description}</td>
                    <td className="print:px-3 print:py-2 print:border-b print:border-slate-100 print:text-slate-800">{exp.currency} {exp.amountOriginal.toFixed(2)}</td>
                    <td className="print:px-3 print:py-2 print:border-b print:border-slate-100 print:text-slate-850 font-bold">{baseCurrency} {exp.amount.toFixed(2)}</td>
                    <td className="print:px-3 print:py-2 print:border-b print:border-slate-100">
                      {exp.receiptPhotoUrl ? (
                        <span className="print:text-green-700 print:font-semibold">Yes (Attached)</span>
                      ) : (
                        <span className="print:text-slate-400">No</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <div className="print:mb-6">
        <h2 className="print:text-sm print:font-bold print:text-slate-800 print:border-b print:border-slate-300 print:pb-1.5 print:mb-3">Settle Up Summary</h2>
        {settlements.length === 0 ? (
          <p className="print:text-slate-400 italic">Everyone is fully settled up! No transactions needed.</p>
        ) : (
          <ul className="print:list-none print:p-0 print:m-0 print:text-[11px] print:flex print:flex-col print:gap-1.5">
            {settlements.map((s, idx) => (
              <li key={idx} className="print:bg-slate-50 print:border-l-4 print:border-emerald-500 print:px-3 print:py-2 print:rounded-r-lg print:text-slate-800">
                <strong>{s.fromName}</strong> owes <strong>{s.toName}</strong> a total of{' '}
                <strong>{baseCurrency} {s.amount.toFixed(2)}</strong>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
