import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Trip, Member, Expense } from '../../types';

interface TripState {
  currentTrip: Trip | null;
}

const initialState: TripState = {
  currentTrip: null,
};

const tripSlice = createSlice({
  name: 'trip',
  initialState,
  reducers: {
    createTrip: (state, action: PayloadAction<{ id: string; title: string; members: Member[] }>) => {
      state.currentTrip = {
        id: action.payload.id,
        title: action.payload.title,
        members: action.payload.members,
        expenses: [],
      };
    },
    addMember: (state, action: PayloadAction<Member>) => {
      if (state.currentTrip) {
        state.currentTrip.members.push(action.payload);
      }
    },
    addExpense: (state, action: PayloadAction<Expense>) => {
      if (state.currentTrip) {
        state.currentTrip.expenses.push(action.payload);
      }
    },
    clearTrip: (state) => {
      state.currentTrip = null;
    },
  },
});

export const { createTrip, addMember, addExpense, clearTrip } = tripSlice.actions;
export default tripSlice.reducer;
