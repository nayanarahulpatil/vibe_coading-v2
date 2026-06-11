import React from 'react';
import { useAppSelector } from '../../../hooks/store';
import { CreateTripForm } from './CreateTripForm';
import { AddMemberForm } from './AddMemberForm';
import { Users } from 'lucide-react';
import styles from './TripDashboard.module.css';

export const TripDashboard: React.FC = () => {
  const currentTrip = useAppSelector((state) => state.trip.currentTrip);

  if (!currentTrip) {
    return (
      <div className={styles.emptyStateContainer}>
        <CreateTripForm />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>{currentTrip.title}</h1>
          <p className={styles.subtitle}>Trip Dashboard</p>
        </div>
      </div>

      <div className={styles.membersSection}>
        <div className={styles.membersHeader}>
          <Users size={18} />
          <h3>Trip Members ({currentTrip.members.length})</h3>
        </div>
        
        <div className={styles.membersList}>
          {currentTrip.members.map((member) => (
            <div
              key={member.id}
              className={styles.memberPill}
            >
              {member.name}
            </div>
          ))}
          {currentTrip.members.length === 0 && (
            <p className={styles.noMembersText}>No members added yet.</p>
          )}
        </div>

        <div className={styles.formContainer}>
          <AddMemberForm />
        </div>
      </div>
    </div>
  );
};
