import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import {intervalsApi} from "../modules/IntervalList/slices/interval/intervalsApi"
import {categoriesApi} from "../modules/CategoryList/category/categoriesApi"
import {timerApi} from "../modules/IntervalList/slices/timer/timerApi"
import {intervalsAnalysisApi} from "../modules/AnalysisBody/intervalsAnalysisApi"

export const store = configureStore({
  reducer: {
    [intervalsApi.reducerPath]: intervalsApi.reducer,
    [timerApi.reducerPath]: timerApi.reducer,
    [categoriesApi.reducerPath]: categoriesApi.reducer,
    [intervalsAnalysisApi.reducerPath]: intervalsAnalysisApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(intervalsApi.middleware)
    .concat(timerApi.middleware)
    .concat(categoriesApi.middleware)
    .concat(intervalsAnalysisApi.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();