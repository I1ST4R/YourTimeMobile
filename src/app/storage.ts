import AsyncStorage from '@react-native-async-storage/async-storage';

// Типы остаются точно такие же
export type TimeIntervalType = {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  description?: string;
  createdAt: string;
  updatedAt?: string;
}

export type IntervalFormDataType = {
  name: string;
  startTime: string;
  endTime: string;
  description?: string;
}

export const StorageKeys = {
  TIME_INTERVALS: 'time_intervals',
} as const;

export const TimeIntervalStorage = {
  // Получить все интервалы
  getAllIntervals: async (): Promise<TimeIntervalType[]> => {
    try {
      const intervals = await AsyncStorage.getItem(StorageKeys.TIME_INTERVALS);
      return intervals ? JSON.parse(intervals) : [];
    } catch (error) {
      console.error('Error getting intervals:', error);
      return [];
    }
  },

  // Сохранить все интервалы
  saveAllIntervals: async (intervals: TimeIntervalType[]): Promise<boolean> => {
    try {
      await AsyncStorage.setItem(StorageKeys.TIME_INTERVALS, JSON.stringify(intervals));
      return true;
    } catch (error) {
      console.error('Error saving intervals:', error);
      return false;
    }
  },

  // Добавить новый интервал
  addInterval: async (interval: Omit<IntervalFormDataType, 'id'>): Promise<boolean> => {
    try {
      const intervals = await TimeIntervalStorage.getAllIntervals();
      const newInterval: TimeIntervalType = {
        ...interval,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      intervals.push(newInterval);
      return await TimeIntervalStorage.saveAllIntervals(intervals);
    } catch (error) {
      console.error('Error adding interval:', error);
      return false;
    }
  },

  // Обновить интервал
  updateInterval: async (id: string, updatedInterval: Partial<IntervalFormDataType>): Promise<boolean> => {
    try {
      const intervals = await TimeIntervalStorage.getAllIntervals();
      const index = intervals.findIndex(interval => interval.id === id);
      if (index !== -1) {
        intervals[index] = { 
          ...intervals[index], 
          ...updatedInterval, 
          updatedAt: new Date().toISOString() 
        };
        return await TimeIntervalStorage.saveAllIntervals(intervals);
      }
      return false;
    } catch (error) {
      console.error('Error updating interval:', error);
      return false;
    }
  },

  // Удалить интервал
  deleteInterval: async (id: string): Promise<boolean> => {
    try {
      const intervals = await TimeIntervalStorage.getAllIntervals();
      const filteredIntervals = intervals.filter(interval => interval.id !== id);
      return await TimeIntervalStorage.saveAllIntervals(filteredIntervals);
    } catch (error) {
      console.error('Error deleting interval:', error);
      return false;
    }
  },

  // Найти интервал по ID
  getIntervalById: async (id: string): Promise<TimeIntervalType | undefined> => {
    try {
      const intervals = await TimeIntervalStorage.getAllIntervals();
      return intervals.find(interval => interval.id === id);
    } catch (error) {
      console.error('Error getting interval by id:', error);
      return undefined;
    }
  },
};