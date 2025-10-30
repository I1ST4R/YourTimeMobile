import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import intervalReducer from "../modules/IntervalList/slices/interval/interval.slice"
import categoriesReducer from "../modules/CategoryList/category/category.slice"
import timerReducer from "../modules/IntervalList/slices/timer/timer.slice"

export const store = configureStore({
  reducer: {
    intervals: intervalReducer,
    categories: categoriesReducer,
    timer: timerReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();