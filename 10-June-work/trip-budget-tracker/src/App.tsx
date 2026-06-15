import { TripDashboard } from './features/trip/components/TripDashboard';
import { AddExpenseForm } from './features/expense/components/AddExpenseForm';
import { ExpenseList } from './features/expense/components/ExpenseList';
import { RunningBalancesList } from './features/balance/components/RunningBalancesList';
import { SettleUpSummary } from './features/balance/components/SettleUpSummary';
import { CategoryPieChart } from './features/balance/components/CategoryPieChart';
import { TripSummaryReport } from './features/balance/components/TripSummaryReport';
import { useAppSelector, useAppDispatch } from './hooks/store';
import { clearTrip } from './features/trip/tripSlice';
import { LogOut } from 'lucide-react';

function App() {
  const currentTrip = useAppSelector((state) => state.trip.currentTrip);
  const dispatch = useAppDispatch();

  const handleLeaveTrip = () => {
    if (window.confirm('Are you sure you want to clear current trip? All data will be reset.')) {
      dispatch(clearTrip());
      localStorage.removeItem('trip_budget_tracker_state');
    }
  };

  return (
    <>
      <div className="min-h-screen bg-slate-50 text-slate-800 pb-12 transition-colors duration-300 selection:bg-primary/20">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-50 shadow-sm transition-all duration-300 print:hidden">
          <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-default select-none group">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center text-white font-extrabold shadow-sm shadow-primary/10 transition-transform group-hover:scale-105 duration-300">
                T
              </div>
              <h1 className="text-lg font-black tracking-tight text-slate-800">
                Trip Budget Tracker v2
              </h1>
            </div>

            {currentTrip && (
              <button
                onClick={handleLeaveTrip}
                className="text-xs font-semibold text-slate-650 hover:text-slate-900 transition-all duration-200 flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 px-4 py-2 rounded-full border border-slate-200/80 shadow-sm hover:shadow cursor-pointer active:scale-95"
              >
                <LogOut size={13} className="text-slate-500" />
                <span>Leave Trip</span>
              </button>
            )}
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-0 mt-8 print:hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <TripDashboard />
              <AddExpenseForm />
              {currentTrip && currentTrip.members.length > 0 && <ExpenseList />}
            </div>

            <div className="space-y-6">
              {currentTrip && currentTrip.members.length > 0 && (
                <>
                  <RunningBalancesList />
                  <CategoryPieChart />
                  <SettleUpSummary />
                </>
              )}
            </div>
          </div>
        </main>
      </div>

      {currentTrip && <TripSummaryReport />}
    </>
  );
}

export default App;
