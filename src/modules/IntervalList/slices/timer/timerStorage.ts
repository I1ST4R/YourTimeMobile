import AsyncStorage from '@react-native-async-storage/async-storage';
import z from 'zod';
import { validateData } from '../../../../shared/helpers/validation';


export const timerSchema = z.object({
  intervalId: z.string(), 
  startTime: z.string().datetime(), 
});

export type TimerType = z.infer<typeof timerSchema>;

const STORAGE_TIMER_KEY = 'timer'

export const TimerStorage = {
  getTimer: async (): Promise<TimerType | null> => {
    try {
      const timer = await AsyncStorage.getItem(STORAGE_TIMER_KEY);
      if (!timer) return null;
      const parsedData = JSON.parse(timer);
      return validateData(parsedData, timerSchema)
    } catch (error) {
      console.error('Error getting timer:', error)
      return null;
    }
  },

  saveTimer: async (timer: TimerType): Promise<boolean> => {
    try {
      const validatedTimer = validateData(timer, timerSchema)
      await AsyncStorage.setItem(
        STORAGE_TIMER_KEY,
        JSON.stringify(validatedTimer),
      );
      return true;
    } catch (error) {
      console.error('Error saving timer:', error);
      return false;
    }
  },

  // Добавляем метод для очистки
  clearTimer: async (): Promise<boolean> => {
    try {
      await AsyncStorage.removeItem(STORAGE_TIMER_KEY);
      return true;
    } catch (error) {
      console.error('Error clearing timer:', error);
      return false;
    }
  },
};