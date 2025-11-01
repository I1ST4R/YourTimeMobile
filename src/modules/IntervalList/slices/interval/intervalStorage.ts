import AsyncStorage from '@react-native-async-storage/async-storage';
import z from 'zod';
import { validateArray, validateData } from '../../../../shared/helpers/validation';
import { categorySchema } from '../../../CategoryList/category/categoryStorage';

export const timeSchema = z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/, {
  message: "Время должно быть в формате ЧЧ:ММ:СС (24-часовой формат)"
});

const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
  message: "Дата должна быть в формате ГГГГ-ММ-ДД"
});

export const intervalSchema = z.object({
  name: z.string().max(100, "Название слишком длинное"),
  date: dateSchema,
  startTime: timeSchema,
  endTime: timeSchema,
  duration: timeSchema,
  isDifDays: z.boolean(),
  category: categorySchema.shape.name, 
});

export type IntervalType = z.infer<typeof intervalSchema>;

const INTERVAL_KEY_BASE = "interval_"
const LAST_ID_KEY = "last_id"
const INTERVALS_LIST_KEY = "intervals_list"

export const TimeIntervalStorage = {
  generateKey: async (): Promise<string> => {
    try {
      const lastKey = await AsyncStorage.getItem(LAST_ID_KEY);
      
      if (lastKey === null) {
        await AsyncStorage.setItem(LAST_ID_KEY, "0");
        return INTERVAL_KEY_BASE + "0";
      } else {
        const lastId = parseInt(lastKey, 10);
        if (isNaN(lastId)) {
          await AsyncStorage.setItem(LAST_ID_KEY, "0");
          return INTERVAL_KEY_BASE + "0";
        }   
        const newId = lastId + 1;
        const newKey = newId.toString();
        await AsyncStorage.setItem(LAST_ID_KEY, newKey);
        return INTERVAL_KEY_BASE + newKey;
      }
    } catch (error) {
      console.error('Error generating key:', error);
      return INTERVAL_KEY_BASE + Date.now().toString();
    }
  },

  getAllIntervalsId: async (): Promise<string[]> => {
    try {
      const intervals = await AsyncStorage.getItem(INTERVALS_LIST_KEY);
      console.log('intervals', intervals);
      return intervals ? JSON.parse(intervals) : [];
    } catch (error) {
      console.error('Error getting intervals ids:', error);
      return [];
    }
  },

  getAllIntervals: async (): Promise<IntervalType[]> => {
    try {
      const intervalIds = await TimeIntervalStorage.getAllIntervalsId();
      const intervals: IntervalType[] = [];
      
      for (const id of intervalIds) {
        const interval = await TimeIntervalStorage.getIntervalById(id);
        if (interval) {
          intervals.push(interval);
        }
      }
      
      return intervals;
    } catch (error) {
      console.error('Error getting all intervals:', error);
      return [];
    }
  },

  addInterval: async (interval: IntervalType): Promise<boolean> => {
    try {
      const validatedInterval = validateData(interval, intervalSchema);
      if (!validatedInterval) {
        return false;
      }
      const newKey = await TimeIntervalStorage.generateKey();
      await AsyncStorage.setItem(newKey, JSON.stringify(validatedInterval));
      const existingIds = await TimeIntervalStorage.getAllIntervalsId();
      const updatedIds = [...existingIds, newKey];
      await AsyncStorage.setItem(INTERVALS_LIST_KEY, JSON.stringify(updatedIds));
      return true;
    } catch (error) {
      console.error('9. Error in addInterval:', error);
      return false;
    }
  },

  addIntervals: async (intervals: IntervalType[]): Promise<boolean> => {
    try {

      const validatedIntervals = validateArray(intervals, intervalSchema)
      if (!validatedIntervals || !Array.isArray(validatedIntervals) || validatedIntervals.length === 0) {
        console.error('No valid intervals to add');
        return false;
      }
      
      const curIntervalsIds = await TimeIntervalStorage.getAllIntervalsId();
      
      for (const id of curIntervalsIds) {
        await TimeIntervalStorage.deleteInterval(id);
      }

      await AsyncStorage.setItem(LAST_ID_KEY, "0")

      for (const interval of validatedIntervals) {
        await TimeIntervalStorage.addInterval(interval);
      }

      return true;
    } catch (error) {
      console.error('Error in addIntervals:', error);
      return false;
    }
  },

  getIntervalById: async (id: string): Promise<IntervalType | undefined> => {
    try {
      const interval = await AsyncStorage.getItem(id);
      if (!interval) return undefined;
      
      const parsed = JSON.parse(interval);
      return validateData(parsed, intervalSchema) || undefined;
    } catch (error) {
      console.error('Error getting interval by id:', error);
      return undefined;
    }
  },

  updateInterval: async (id: string, interval: Partial<IntervalType>): Promise<boolean> => {
    try {
      const existing = await TimeIntervalStorage.getIntervalById(id);
      if (!existing) return false;
      
      const updatedInterval = { ...existing, ...interval };
      const validated = validateData(updatedInterval, intervalSchema);
      if (!validated) return false;
      
      await AsyncStorage.setItem(id, JSON.stringify(validated));
      return true;
    } catch (error) {
      console.error('Error updating interval:', error);
      return false;
    }
  },

  deleteInterval: async (id: string): Promise<boolean> => {
    try {
      await AsyncStorage.removeItem(id);
      
      const existingIds = await TimeIntervalStorage.getAllIntervalsId();
      const updatedIds = existingIds.filter(key => key !== id);
      await AsyncStorage.setItem(INTERVALS_LIST_KEY, JSON.stringify(updatedIds));
      
      return true;
    } catch (error) {
      console.error('Error deleting interval:', error);
      return false;
    }
  },

  deleteAllIntervals: async (): Promise<boolean> => {
    try {
      const intervalIds = await TimeIntervalStorage.getAllIntervalsId();

      for (const intervalId of intervalIds) {
        await TimeIntervalStorage.deleteInterval(intervalId)
      }
      return true;
    } catch (error) {
      console.error('Error deleting all intervals:', error);
      return false;
    }
  }
};