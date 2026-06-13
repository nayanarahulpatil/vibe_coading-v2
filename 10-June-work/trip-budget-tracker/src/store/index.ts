import { configureStore } from '@reduxjs/toolkit';
import tripReducer from '../features/trip/tripSlice';

// Load initial state from localStorage
const loadState = () => {
  try {
    const serializedState = localStorage.getItem('trip_budget_tracker_state');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error('Error loading state from localStorage:', err);
    return undefined;
  }
};

// Save state to localStorage
const saveState = (state: any) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('trip_budget_tracker_state', serializedState);
  } catch (err) {
    console.error('Error saving state to localStorage:', err);
  }
};

const persistedState = loadState();

export const store = configureStore({
  reducer: {
    trip: tripReducer,
  },
  preloadedState: persistedState,
});

store.subscribe(() => {
  saveState({
    trip: store.getState().trip,
  });
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
