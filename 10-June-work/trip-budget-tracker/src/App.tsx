import styles from './App.module.css';
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
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.logoContainer}>
            <div className={styles.logo}>
              T
            </div>
            <h1 className={styles.title}>Trip Budget Tracker</h1>
          </div>
          
          {currentTrip && (
            <button 
              onClick={() => dispatch(clearTrip())}
              className={styles.leaveButton}
            >
              <LogOut size={14} />
              <span>Leave Trip</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.mainContent}>
        <div className={styles.grid}>
          <div className={styles.column}>
            <TripDashboard />
            <AddExpenseForm />
          </div>
          
          <div className={styles.column}>
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
