import React from 'react';
import { useAppSelector } from '../../../hooks/store';
import { CreateTripForm } from './CreateTripForm';
import { AddMemberForm } from './AddMemberForm';
import { Users } from 'lucide-react';

export const TripDashboard: React.FC = () => {
  const currentTrip = useAppSelector((state) => state.trip.currentTrip);

  if (!currentTrip) {
    return (
      <div className="max-w-2xl mx-auto mt-12 px-4">
        <CreateTripForm />
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{currentTrip.title}</h1>
          <p className="text-sm text-slate-500 mt-1">Trip Dashboard</p>
        </div>
      </div>

      <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
        <div className="flex items-center gap-2 mb-3 text-slate-700 font-medium">
          <Users size={18} />
          <h3>Trip Members ({currentTrip.members.length})</h3>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {currentTrip.members.map((member) => (
            <div
              key={member.id}
              className="bg-white border border-slate-200 px-3 py-1.5 rounded-full text-sm font-medium text-slate-700 shadow-sm"
            >
              {member.name}
            </div>
          ))}
          {currentTrip.members.length === 0 && (
            <p className="text-sm text-slate-400 italic">No members added yet.</p>
          )}
        </div>

        <div className="border-t border-slate-200 pt-2">
          <AddMemberForm />
        </div>
      </div>
    </div>
  );
};
