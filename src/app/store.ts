
import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import formIntervalReducer from "../modules/IntervalForm/form.slice"

export const store = configureStore({
  reducer: {
    formInterval: formIntervalReducer,
  },
});

export type RootState = any;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()