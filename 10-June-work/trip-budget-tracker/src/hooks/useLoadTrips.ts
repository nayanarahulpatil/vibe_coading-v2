import { useEffect } from 'react';
import { useAppDispatch } from '../hooks/store';
import { tripApi } from '../services/tripApi';
import { setTrips, setCurrentTrip, setTripLoading, setTripError } from '../features/trip/tripSlice';
import { ApiError } from '../services/apiClient';
import { setUnauthenticated } from '../features/auth/authSlice';

export const useLoadTrips = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const load = async () => {
      dispatch(setTripLoading(true));
      dispatch(setTripError(null));
      try {
        const trips = await tripApi.listTrips();
        dispatch(setTrips(trips));

        if (trips.length > 0) {
          const fullTrip = await tripApi.getTrip(trips[0].id);
          dispatch(setCurrentTrip(fullTrip));
        } else {
          dispatch(setCurrentTrip(null));
        }
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
          dispatch(setUnauthenticated());
        } else {
          dispatch(setTripError(err instanceof Error ? err.message : 'Failed to load trips'));
        }
      } finally {
        dispatch(setTripLoading(false));
      }
    };

    load();
  }, [dispatch]);
};
