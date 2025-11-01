import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import supabase from '../../api/supabaseClient';

const initialState = {
  user: null,
  session: null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

/**
 * Sign in with Google
 */
export const signInWithGoogle = createAsyncThunk('auth/signInWithGoogle', async (_, thunkAPI) => {
  try {
    if (!supabase) {
      throw new Error('Supabase not configured');
    }

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (error) throw error;
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

/**
 * Sign out
 */
export const signOut = createAsyncThunk('auth/signOut', async (_, thunkAPI) => {
  try {
    if (!supabase) {
      throw new Error('Supabase not configured');
    }

    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return null;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

/**
 * Check current session
 */
export const checkSession = createAsyncThunk('auth/checkSession', async (_, thunkAPI) => {
  try {
    if (!supabase) {
      return null;
    }

    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setSession: (state, action) => {
      state.session = action.payload;
      state.user = action.payload?.user || null;
    },
    clearAuth: (state) => {
      state.user = null;
      state.session = null;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Sign in with Google
      .addCase(signInWithGoogle.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(signInWithGoogle.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(signInWithGoogle.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Sign out
      .addCase(signOut.fulfilled, (state) => {
        state.user = null;
        state.session = null;
        state.status = 'idle';
      })
      // Check session
      .addCase(checkSession.fulfilled, (state, action) => {
        state.session = action.payload;
        state.user = action.payload?.user || null;
        state.status = 'succeeded';
      });
  },
});

export const { setSession, clearAuth } = authSlice.actions;

export const selectUser = (state) => state.auth.user;
export const selectSession = (state) => state.auth.session;
export const selectAuthStatus = (state) => state.auth.status;
export const selectIsAuthenticated = (state) => !!state.auth.user;

export default authSlice.reducer;
