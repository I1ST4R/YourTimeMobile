import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import formIntervalReducer from "../modules/IntervalForm/form.slice";
import intervalReducer from "../modules/IntervalList/interval.slice"

export const store = configureStore({
  reducer: {
    formInterval: formIntervalReducer,
    intervals: intervalReducer, 
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();