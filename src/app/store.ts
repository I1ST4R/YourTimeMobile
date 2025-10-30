import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import {intervalsApi} from "../modules/IntervalList/slices/interval/intervalsApi"
import categoriesReducer from "../modules/CategoryList/category/category.slice"
import {timerApi} from "../modules/IntervalList/slices/timer/timerApi"

export const store = configureStore({
  reducer: {
    [intervalsApi.reducerPath]: intervalsApi.reducer,
    [timerApi.reducerPath]: timerApi.reducer,
    categories: categoriesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(intervalsApi.middleware)
    .concat(timerApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();