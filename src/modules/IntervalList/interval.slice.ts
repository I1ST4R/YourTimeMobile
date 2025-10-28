import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { FormIntervalType, StoreIntervalType, TimeIntervalStorage } from '../../shared/storage';

interface IntervalState {
  intervals: StoreIntervalType[];
  loading: boolean;
  error: string | null;
}

const initialState: IntervalState = {
  intervals: [],
  loading: false,
  error: null,
};

export const loadIntervals = createAsyncThunk(
  'intervals/loadIntervals',
  async () => {
    const intervals = await TimeIntervalStorage.getAllIntervals();
    return intervals;
  }
);

export const addInterval = createAsyncThunk(
  'intervals/addInterval',
  async (intervalData: FormIntervalType, { dispatch }) => {
    const success = await TimeIntervalStorage.addInterval(intervalData);
    if (success) {
      await dispatch(loadIntervals());
      return;
    }
    throw new Error('Failed to add interval');
  }
);

export const updateInterval = createAsyncThunk(
  'intervals/updateInterval',
  async ({ id, interval }: { id: string; interval: Partial<FormIntervalType> }, { dispatch }) => {
    const success = await TimeIntervalStorage.updateInterval(id, interval);
    if (success) {
      await dispatch(loadIntervals());
      return;
    }
    throw new Error('Failed to update interval');
  }
);

export const deleteInterval = createAsyncThunk(
  'intervals/deleteInterval',
  async (id: string, { dispatch }) => {
    const success = await TimeIntervalStorage.deleteInterval(id);
    if (success) {
      await dispatch(loadIntervals());
      return;
    }
    throw new Error('Failed to delete interval');
  }
);

const intervalSlice = createSlice({
  name: 'intervals',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  selectors: {
    selectIntervals: (state) => state.intervals,
    selectIntervalsLoading: (state) => state.loading,
    selectIntervalsError: (state) => state.error,
    selectIntervalsCount: (state) => state.intervals.length,
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadIntervals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadIntervals.fulfilled, (state, action) => {
        state.loading = false;
        state.intervals = action.payload;
      })
      .addCase(loadIntervals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load intervals';
      })
      .addCase(addInterval.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addInterval.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to add interval';
      })
      .addCase(updateInterval.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateInterval.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update interval';
      })
      .addCase(deleteInterval.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteInterval.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete interval';
      });
  },
});

export const { clearError } = intervalSlice.actions;
export const { 
  selectIntervals, 
  selectIntervalsLoading, 
  selectIntervalsError, 
  selectIntervalsCount 
} = intervalSlice.selectors;

export default intervalSlice.reducer;