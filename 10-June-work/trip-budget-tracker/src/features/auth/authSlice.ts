import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { authApi, type AuthUser } from '../../services/authApi';
import { getToken, clearToken, ApiError } from '../../services/apiClient';

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: !!getToken(),
  isLoading: !!getToken(),
  error: null,
};

export const bootstrapAuth = createAsyncThunk('auth/bootstrap', async (_, { rejectWithValue }) => {
  if (!getToken()) return null;
  try {
    return await authApi.me();
  } catch {
    clearToken();
    return rejectWithValue('Session expired');
  }
});

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const result = await authApi.login(email, password);
      return result.user;
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Login failed';
      return rejectWithValue(message);
    }
  }
);

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  await authApi.logout();
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
    setUnauthenticated: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      clearToken();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(bootstrapAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(bootstrapAuth.fulfilled, (state, action: PayloadAction<AuthUser | null>) => {
        state.isLoading = false;
        if (action.payload) {
          state.user = action.payload;
          state.isAuthenticated = true;
        } else {
          state.isAuthenticated = false;
        }
      })
      .addCase(bootstrapAuth.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<AuthUser>) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || 'Invalid email or password';
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const { clearAuthError, setUnauthenticated } = authSlice.actions;
export default authSlice.reducer;
