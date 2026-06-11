import React from 'react';
import { useSettleUp } from '../hooks/useSettleUp';
import { useAppSelector } from '../../../hooks/store';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import styles from './SettleUpSummary.module.css';

export const SettleUpSummary: React.FC = () => {
  const currentTrip = useAppSelector((state) => state.trip.currentTrip);
  const settlements = useSettleUp();

  if (!currentTrip || currentTrip.expenses.length === 0) return null;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <CheckCircle2 size={20} className={styles.icon} />
        <h2>Settle Up Summary</h2>
      </div>

      {settlements.length === 0 ? (
        <div className={styles.emptyState}>
          Everyone is settled up! No debts.
        </div>
      ) : (
        <div className={styles.list}>
          {settlements.map((s, idx) => (
            <div key={idx} className={styles.listItem}>
              <div className={styles.memberNames}>
                <span className={styles.name}>{s.fromName}</span>
                <ArrowRight size={16} className={styles.arrow} />
                <span className={styles.name}>{s.toName}</span>
              </div>
              <div className={styles.amount}>
                ${s.amount.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
