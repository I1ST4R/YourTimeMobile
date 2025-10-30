import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { IntervalType, TimeIntervalStorage } from './intervalStorage';

export const intervalsApi = createApi({
  reducerPath: 'intervalsApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Interval'],
  endpoints: (builder) => ({
    getIntervalIds: builder.query<string[], void>({
      queryFn: async () => {
        try {
          const ids = await TimeIntervalStorage.getAllIntervalsId();
          return { data: ids };
        } catch (error) {
          return { error: error instanceof Error ? error.message : 'Failed to load interval ids' };
        }
      },
      providesTags: ['Interval'],
    }),

    getIntervalById: builder.query<IntervalType, string>({
      queryFn: async (id) => {
        try {
          const interval = await TimeIntervalStorage.getIntervalById(id);
          if (!interval) {
            return { error: 'Interval not found' };
          }
          return { data: interval };
        } catch (error) {
          return { error: error instanceof Error ? error.message : 'Failed to get interval' };
        }
      },
      providesTags: (result, error, id) => [{ type: 'Interval', id }],
    }),

    addInterval: builder.mutation<{ success: boolean }, IntervalType>({
      queryFn: async (intervalData) => {
        try {
          const success = await TimeIntervalStorage.addInterval(intervalData);
          return { data: { success } };
        } catch (error) {
          return { error: error instanceof Error ? error.message : 'Failed to add interval' };
        }
      },
      invalidatesTags: ['Interval'],
    }),

    updateInterval: builder.mutation<{ success: boolean }, { id: string; interval: Partial<IntervalType> }>({
      queryFn: async ({ id, interval }) => {
        try {
          const success = await TimeIntervalStorage.updateInterval(id, interval);
          return { data: { success } };
        } catch (error) {
          return { error: error instanceof Error ? error.message : 'Failed to update interval' };
        }
      },
      invalidatesTags: (result, error, { id }) => [{ type: 'Interval', id }],
    }),

    deleteInterval: builder.mutation<{ success: boolean }, string>({
      queryFn: async (id) => {
        try {
          const success = await TimeIntervalStorage.deleteInterval(id);
          return { data: { success } };
        } catch (error) {
          return { error: error instanceof Error ? error.message : 'Failed to delete interval' };
        }
      },
      invalidatesTags: ['Interval'],
    }),
  }),
});

export const {
  useGetIntervalIdsQuery,
  useGetIntervalByIdQuery,
  useAddIntervalMutation,
  useUpdateIntervalMutation,
  useDeleteIntervalMutation,
} = intervalsApi;