import AsyncStorage from '@react-native-async-storage/async-storage';
import z from 'zod';
import { validateArray, validateData } from '../../../../shared/helpers/validation';

export const timeSchema = z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/, {
  message: "Время должно быть в формате ЧЧ:ММ:СС (24-часовой формат)"
});

const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
  message: "Дата должна быть в формате ГГГГ-ММ-ДД"
});

// Базовая схема без refine
export const baseIntervalSchema = z.object({
  name: z.string().max(100, "Название слишком длинное"),
  date: dateSchema,
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

const STORAGE_INTERVALS_KEY = 'time_intervals'

export const TimeIntervalStorage = {
  getAllIntervals: async (): Promise<StoreIntervalType[]> => {
    try {
      const intervals = await AsyncStorage.getItem(STORAGE_INTERVALS_KEY);
      const parsedData = intervals ? JSON.parse(intervals) : [];
      return validateArray(parsedData, storeIntervalSchema);
    } catch (error) {
      console.error('Error getting intervals:', error);
      return [];
    }
  },

  saveAllIntervals: async (
    intervals: StoreIntervalType[],
  ): Promise<boolean> => {
    try {
      // Валидируем данные перед сохранением
      const validatedIntervals = validateArray(intervals, storeIntervalSchema);
      if (validatedIntervals.length !== intervals.length) {
        throw new Error('Some intervals failed validation');
      }

      await AsyncStorage.setItem(
        STORAGE_INTERVALS_KEY,
        JSON.stringify(validatedIntervals),
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
      
      // Валидируем новый интервал
      const validatedInterval = validateData(newInterval, storeIntervalSchema);
      if (!validatedInterval) {
        throw new Error('Interval validation failed');
      }

      intervals.push(validatedInterval);
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
        const mergedInterval = {
          ...intervals[index],
          ...updatedInterval,
        };
        
        console.log(mergedInterval)
        const validatedInterval = validateData(mergedInterval, storeIntervalSchema);
        if (!validatedInterval) {
          throw new Error('Updated interval validation failed');
        }

        intervals[index] = validatedInterval;
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
  ): Promise<StoreIntervalType | undefined> => {
    try {
      const intervals = await TimeIntervalStorage.getAllIntervals();
      const interval = intervals.find(interval => interval.id === id);
      return interval ? validateData(interval, storeIntervalSchema) || undefined : undefined;
    } catch (error) {
      console.error('Error getting interval by id:', error);
      return undefined;
    }
  },
};