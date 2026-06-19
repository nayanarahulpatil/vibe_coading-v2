import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Trip, Member, Expense } from '../../types';
import type { TripSummary } from '../../services/tripApi';

interface TripState {
  currentTrip: Trip | null;
  trips: TripSummary[];
  isLoading: boolean;
  error: string | null;
}

const initialState: TripState = {
  currentTrip: null,
  trips: [],
  isLoading: false,
  error: null,
};

const tripSlice = createSlice({
  name: 'trip',
  initialState,
  reducers: {
    setTrips: (state, action: PayloadAction<TripSummary[]>) => {
      state.trips = action.payload;
    },
    setCurrentTrip: (state, action: PayloadAction<Trip | null>) => {
      state.currentTrip = action.payload;
    },
    setTripLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setTripError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    addMemberLocal: (state, action: PayloadAction<Member>) => {
      if (state.currentTrip) {
        state.currentTrip.members.push(action.payload);
      }
    },
    addExpenseLocal: (state, action: PayloadAction<Expense>) => {
      if (state.currentTrip) {
        state.currentTrip.expenses.push(action.payload);
      }
    },
    clearTripState: (state) => {
      state.currentTrip = null;
      state.trips = [];
      state.error = null;
    },
  },
});

export const {
  setTrips,
  setCurrentTrip,
  setTripLoading,
  setTripError,
  addMemberLocal,
  addExpenseLocal,
  clearTripState,
} = tripSlice.actions;
export default tripSlice.reducer;
