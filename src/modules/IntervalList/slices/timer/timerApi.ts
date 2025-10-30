import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { TimerStorage, TimerType } from './timerStorage';

export const timerApi = createApi({
  reducerPath: 'timerApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Timer'],
  endpoints: (builder) => ({
    getTimer: builder.query<TimerType | null, string>({
      queryFn: async (intervalId) => {
        try {
          const timer = await TimerStorage.getTimer(intervalId);
          return { data: timer };
        } catch (error) {
          return { error: error as Error };
        }
      },
      providesTags: ['Timer'],
    }),

    saveTimer: builder.mutation<TimerType, TimerType>({
      queryFn: async (timerData) => {
        try {
          const success = await TimerStorage.saveTimer(timerData);
          if (!success) {
            throw new Error('Failed to save timer');
          }
          return { data: timerData };
        } catch (error) {
          return { error: error as Error };
        }
      },
      invalidatesTags: ['Timer'],
    }),

    clearTimer: builder.mutation<null, void>({
      queryFn: async () => {
        try {
          const success = await TimerStorage.clearTimer();
          if (!success) {
            throw new Error('Failed to clear timer');
          }
          return { data: null };
        } catch (error) {
          return { error: error as Error };
        }
      },
      invalidatesTags: ['Timer'],
    }),
  }),
});

// Экспорт хуков
export const {
  useGetTimerQuery,
  useSaveTimerMutation,
  useClearTimerMutation,
} = timerApi;