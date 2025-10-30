import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import {intervalsApi} from "../modules/IntervalList/slices/interval/intervalsApi"
import categoriesReducer from "../modules/CategoryList/category/category.slice"
import timerReducer from "../modules/IntervalList/slices/timer/timer.slice"

export const store = configureStore({
  reducer: {
    [intervalsApi.reducerPath]: intervalsApi.reducer,
    categories: categoriesReducer,
    timer: timerReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(intervalsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();