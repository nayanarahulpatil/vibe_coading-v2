import React from 'react';
import { useAppSelector } from '../../../hooks/store';
import { CreateTripForm } from './CreateTripForm';
import { AddMemberForm } from './AddMemberForm';
import { Users, FileDown } from 'lucide-react';

export const TripDashboard: React.FC = () => {
  const currentTrip = useAppSelector((state) => state.trip.currentTrip);

  if (!currentTrip) {
    return (
      <div className="max-w-2xl mx-auto mt-12 px-0">
        <CreateTripForm />
      </div>
    );
  }

  const handleExport = () => {
    if (currentTrip.expenses.length > 0) {
      window.print();
    }
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200/80 transition-all duration-300 hover:shadow-md">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {currentTrip.title}
          </h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">
            Base Currency: {currentTrip.baseCurrency}
          </p>
        </div>
        <button
          onClick={handleExport}
          disabled={currentTrip.expenses.length === 0}
          className={`flex items-center gap-1.5 text-[11px] font-semibold px-3.5 py-2 rounded-xl transition-all shadow-sm border select-none active:scale-95 duration-200 cursor-pointer ${currentTrip.expenses.length === 0
              ? 'opacity-30 border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed hover:scale-100 active:scale-100'
              : 'bg-primary/10 hover:bg-primary/20 text-primary border-primary/20 hover:shadow-sm'
            }`}
          title={currentTrip.expenses.length === 0 ? 'Add at least one expense to export' : 'Export Trip Summary'}
        >
          <FileDown size={13} />
          <span>Export Summary</span>
        </button>
      </div>

      <div className="bg-slate-50/50 rounded-2xl p-5 border border-slate-200/60 shadow-inner">
        <div className="flex items-center gap-2 mb-4 text-slate-500 font-bold text-[10px] uppercase tracking-wider">
          <Users size={14} className="text-primary" />
          <h3>Trip Members ({currentTrip.members.length})</h3>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {currentTrip.members.map((member) => (
            <div
              key={member.id}
              className="bg-white border border-slate-200/80 px-4 py-1.5 rounded-full text-xs font-semibold text-slate-700 shadow-sm hover:shadow hover:border-slate-300 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-default select-none"
            >
              {member.name}
            </div>
          ))}
          {currentTrip.members.length === 0 && (
            <p className="text-sm text-slate-400 italic">No members added yet.</p>
          )}
        </div>

        <div className="border-t border-slate-200/60 pt-4 mt-2">
          <AddMemberForm />
        </div>
      </div>
    </div>
  );
};
