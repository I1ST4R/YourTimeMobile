import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { IntervalType, TimeIntervalStorage } from '../IntervalList/slices/interval/intervalStorage';

export const intervalsAnalysisApi = createApi({
  reducerPath: 'intervalsAnalysisApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['IntervalsAnalysis'],
  endpoints: (builder) => ({
    getAllIntervals: builder.query<IntervalType[], void>({
      queryFn: async () => {
        try {
          const intervals = await TimeIntervalStorage.getAllIntervals();
          return { data: intervals };
        } catch (error) {
          return { error: error instanceof Error ? error.message : 'Failed to load intervals' };
        }
      },
      providesTags: ['IntervalsAnalysis'],
    }),
  }),
});

export const { useGetAllIntervalsQuery } = intervalsAnalysisApi;