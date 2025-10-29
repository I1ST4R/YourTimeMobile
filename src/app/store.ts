import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import intervalReducer from "../modules/IntervalList/interval/interval.slice"
import categoriesReducer from "../modules/CategoryList/category/category.slice"

export const store = configureStore({
  reducer: {
    intervals: intervalReducer,
    categories: categoriesReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();