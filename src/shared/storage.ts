import AsyncStorage from '@react-native-async-storage/async-storage';
import z from 'zod';

const timeSchema = z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/, {
  message: "Время должно быть в формате ЧЧ:ММ:СС (24-часовой формат)"
});

// Базовая схема без refine
const baseIntervalSchema = z.object({
  name: z.string().max(100, "Название слишком длинное"),
  date: z.date(),
  startTime: timeSchema,
  endTime: timeSchema,
  duration: timeSchema,
  isDifDays: z.boolean(),
  category: z.string().max(30, "Описание слишком длинное"),
});


export const storeIntervalSchema = baseIntervalSchema.extend({
  id: z.string(),
});

export type FormIntervalType = z.infer<typeof baseIntervalSchema>;
export type StoreIntervalType = z.infer<typeof storeIntervalSchema>;


export const StorageKeys = {
  TIME_INTERVALS: 'time_intervals',
} as const;

export const TimeIntervalStorage = {
  getAllIntervals: async (): Promise<StoreIntervalType[]> => {
    try {
      const intervals = await AsyncStorage.getItem(StorageKeys.TIME_INTERVALS);
      return intervals ? JSON.parse(intervals) : [];
    } catch (error) {
      console.error('Error getting intervals:', error);
      return [];
    }
  },

  saveAllIntervals: async (
    intervals: StoreIntervalType[],
  ): Promise<boolean> => {
    try {
      await AsyncStorage.setItem(
        StorageKeys.TIME_INTERVALS,
        JSON.stringify(intervals),
      );
      return true;
    } catch (error) {
      console.error('Error saving intervals:', error);
      return false;
    }
  },

  addInterval: async (interval: FormIntervalType): Promise<boolean> => {
    try {
      const intervals = await TimeIntervalStorage.getAllIntervals();
      const newInterval: StoreIntervalType = {
        ...interval,
        id: Date.now().toString(),
      };
      intervals.push(newInterval);
      return await TimeIntervalStorage.saveAllIntervals(intervals);
    } catch (error) {
      console.error('Error adding interval:', error);
      return false;
    }
  },

  updateInterval: async (
    id: string,
    updatedInterval: Partial<FormIntervalType>,
  ): Promise<boolean> => {
    try {
      const intervals = await TimeIntervalStorage.getAllIntervals();
      const index = intervals.findIndex(interval => interval.id === id);
      if (index !== -1) {
        intervals[index] = {
          ...intervals[index],
          ...updatedInterval,
        };
        return await TimeIntervalStorage.saveAllIntervals(intervals);
      }
      return false;
    } catch (error) {
      console.error('Error updating interval:', error);
      return false;
    }
  },

  deleteInterval: async (id: string): Promise<boolean> => {
    try {
      const intervals = await TimeIntervalStorage.getAllIntervals();
      const filteredIntervals = intervals.filter(
        interval => interval.id !== id,
      );
      return await TimeIntervalStorage.saveAllIntervals(filteredIntervals);
    } catch (error) {
      console.error('Error deleting interval:', error);
      return false;
    }
  },

  getIntervalById: async (
    id: string,
  ): Promise<FormIntervalType | undefined> => {
    try {
      const intervals = await TimeIntervalStorage.getAllIntervals();
      return intervals.find(interval => interval.id === id);
    } catch (error) {
      console.error('Error getting interval by id:', error);
      return undefined;
    }
  },
};
