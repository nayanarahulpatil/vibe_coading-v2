
import { TripDashboard } from './features/trip/components/TripDashboard';
import { AddExpenseForm } from './features/expense/components/AddExpenseForm';
import { RunningBalancesList } from './features/balance/components/RunningBalancesList';
import { SettleUpSummary } from './features/balance/components/SettleUpSummary';
import { useAppSelector, useAppDispatch } from './hooks/store';
import { clearTrip } from './features/trip/tripSlice';
import { LogOut } from 'lucide-react';

function App() {
  const currentTrip = useAppSelector((state) => state.trip.currentTrip);
  const dispatch = useAppDispatch();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-12">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center text-white font-bold">
              T
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Trip Budget Tracker</h1>
          </div>
          
          {currentTrip && (
            <button 
              onClick={() => dispatch(clearTrip())}
              className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-full"
            >
              <LogOut size={14} />
              <span>Leave Trip</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <TripDashboard />
            <AddExpenseForm />
          </div>
          
          <div className="space-y-6">
            {currentTrip && currentTrip.members.length > 0 && (
              <>
                <RunningBalancesList />
                <SettleUpSummary />
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
