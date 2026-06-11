import React from 'react';
import { useCalculateBalances } from '../hooks/useCalculateBalances';
import { useAppSelector } from '../../../hooks/store';
import { Wallet } from 'lucide-react';
import styles from './RunningBalancesList.module.css';

export const RunningBalancesList: React.FC = () => {
  const currentTrip = useAppSelector((state) => state.trip.currentTrip);
  const balances = useCalculateBalances();

  if (!currentTrip || balances.length === 0) return null;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Wallet size={20} className={styles.icon} />
        <h2>Running Balances</h2>
      </div>

      <div className={styles.list}>
        {balances.map((b) => (
          <div key={b.memberId} className={styles.listItem}>
            <div className={styles.memberName}>{b.name}</div>
            <div className={b.balance > 0 ? styles.balancePositive : b.balance < 0 ? styles.balanceNegative : styles.balanceZero}>
              {b.balance > 0 ? '+' : ''}{b.balance.toFixed(2)}
            </div>
          </div>
        ))}
      </div>
      
      <div className={styles.footer}>
        <p>Positive balance: They are owed money.</p>
        <p>Negative balance: They owe money.</p>
      </div>
    </div>
  );
};
