import { configureStore } from '@reduxjs/toolkit';
import tripReducer from '../features/trip/tripSlice';
import authReducer from '../features/auth/authSlice';

export const store = configureStore({
  reducer: {
    trip: tripReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
