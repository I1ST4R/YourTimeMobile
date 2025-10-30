import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TimerStorage, TimerType } from './timerStorage'; 

interface TimerState {
  timer: TimerType | null;
  loading: boolean;
  error: string | null;
}

const initialState: TimerState = {
  timer: null,
  loading: false,
  error: null
};

export const getTimer = createAsyncThunk(
  'timer/getTimer',
  async (_, { dispatch }) => {
    const timer = await TimerStorage.getTimer(); 
    dispatch(setTimer(timer));
    return timer;
  }
);

export const saveTimer = createAsyncThunk(
  'timer/saveTimer',
  async ({ intervalId, startTime }: { intervalId: string; startTime: string }, { dispatch }) => {
    const timerData = { intervalId, startTime };
    dispatch(setTimer(timerData));
    
    const success = await TimerStorage.saveTimer(timerData); 
    if (!success) {
      dispatch(setTimer(null));
      throw new Error('Failed to save timer');
    }
    return timerData;
  }
);

export const clearTimer = createAsyncThunk(
  'timer/clearTimer',
  async (_, { dispatch }) => {
    dispatch(setTimer(null));
    
    const success = await TimerStorage.clearTimer();
    if (!success) {
      const previousTimer = await TimerStorage.getTimer();
      dispatch(setTimer(previousTimer));
      throw new Error('Failed to clear timer');
    }
    return null;
  }
);

const timerSlice = createSlice({ 
  name: 'timer', 
  initialState,
  reducers: {
    setTimer: (state, action) => {
      state.timer = action.payload;
    }
  },
  selectors: {
    selectTimer: (state) => (intervalId: string) => 
      state.timer?.intervalId === intervalId ? state.timer : null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTimer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTimer.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(getTimer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load timer';
      })
      .addCase(saveTimer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveTimer.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(saveTimer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to save timer';
      })
      .addCase(clearTimer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearTimer.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(clearTimer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to clear timer';
      });
  },
});

export const { setTimer } = timerSlice.actions;
export const { 
  selectTimer, 
} = timerSlice.selectors;

export default timerSlice.reducer;