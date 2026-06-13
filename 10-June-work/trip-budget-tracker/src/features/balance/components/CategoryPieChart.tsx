import React from 'react';
import { useAppSelector } from '../../../hooks/store';
import { PieChart } from 'lucide-react';

const CATEGORY_COLORS: Record<string, string> = {
  Food: '#f59e0b',          // Amber
  Transport: '#3b82f6',     // Blue
  Accommodation: '#10b981', // Emerald
  Entertainment: '#8b5cf6', // Purple
  Other: '#64748b',         // Slate
};

export const CategoryPieChart: React.FC = () => {
  const currentTrip = useAppSelector((state) => state.trip.currentTrip);

  if (!currentTrip || currentTrip.expenses.length === 0) {
    return (
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200/80 transition-all duration-300 hover:shadow-md">
        <div className="flex items-center gap-2.5 mb-4 text-slate-800 font-bold text-lg">
          <PieChart size={20} className="text-indigo-500" />
          <h2>Category Breakdown</h2>
        </div>
        <div className="text-slate-400 italic p-6 bg-slate-50 border border-slate-100 rounded-2xl text-center text-sm">
          No expenses recorded yet. Add an expense to see analytics.
        </div>
      </div>
    );
  }

  const { expenses, baseCurrency } = currentTrip;

  const categoryTotals: Record<string, number> = {
    Food: 0,
    Transport: 0,
    Accommodation: 0,
    Entertainment: 0,
    Other: 0,
  };

  expenses.forEach((exp) => {
    categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
  });

  const grandTotal = Object.values(categoryTotals).reduce((sum, val) => sum + val, 0);

  if (grandTotal === 0) {
    return (
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200/80 transition-all duration-300 hover:shadow-md">
        <div className="flex items-center gap-2.5 mb-4 text-slate-800 font-bold text-lg">
          <PieChart size={20} className="text-indigo-500" />
          <h2>Category Breakdown</h2>
        </div>
        <div className="text-slate-400 italic p-6 bg-slate-50 border border-slate-100 rounded-2xl text-center text-sm">
          Total trip spend is 0.
        </div>
      </div>
    );
  }

  let accumulatedPercent = 0;
  const gradientStops: string[] = [];
  const details = Object.entries(categoryTotals)
    .map(([category, amount]) => {
      const percentage = (amount / grandTotal) * 100;
      const color = CATEGORY_COLORS[category] || '#ccc';
      
      if (amount > 0) {
        const start = accumulatedPercent;
        accumulatedPercent += percentage;
        gradientStops.push(`${color} ${start.toFixed(1)}% ${accumulatedPercent.toFixed(1)}%`);
      }

      return {
        category,
        amount,
        percentage,
        color,
      };
    })
    .filter((d) => d.amount > 0)
    .sort((a, b) => b.amount - a.amount);

  const conicGradientValue = gradientStops.length > 0 
    ? `conic-gradient(${gradientStops.join(', ')})`
    : '#e2e8f0';

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200/80 transition-all duration-300 hover:shadow-md">
      <div className="flex items-center gap-2.5 mb-4 text-slate-800 font-bold text-lg">
        <PieChart size={20} className="text-indigo-500" />
        <h2>Category Breakdown</h2>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6 mt-4">
        <div className="flex items-center justify-center">
          <div 
            className="relative w-40 h-40 rounded-full flex items-center justify-center shadow-md transition-transform duration-500 hover:scale-105 border border-slate-200/50"
            style={{ background: conicGradientValue }}
          >
            <div className="w-26 h-26 rounded-full bg-white flex items-center justify-center shadow-inner">
              <div className="flex flex-col items-center justify-center">
                <span className="text-[9px] uppercase font-black text-slate-400 tracking-wider">{baseCurrency}</span>
                <span className="text-xl font-black text-slate-850 tracking-tight">{grandTotal.toFixed(0)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 w-full space-y-2">
          {details.map((d) => (
            <div key={d.category} className="flex items-center justify-between p-1.5 rounded-xl hover:bg-slate-55 transition-colors">
              <div className="flex items-center gap-2.5">
                <span 
                  className="w-2.5 h-2.5 rounded-full shadow-sm" 
                  style={{ backgroundColor: d.color }} 
                />
                <span className="font-bold text-slate-600 text-xs uppercase tracking-wider">{d.category}</span>
              </div>
              <div className="flex items-center gap-4 text-right">
                <span className="text-[10px] font-extrabold text-slate-400">{d.percentage.toFixed(1)}%</span>
                <span className="font-extrabold text-slate-800 text-sm">
                  {baseCurrency} {d.amount.toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
