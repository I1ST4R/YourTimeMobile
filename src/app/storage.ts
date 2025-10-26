import { MMKV } from 'react-native-mmkv';

// Создаем fallback хранилище
const createFallbackStorage = () => {
  let memoryStorage: { [key: string]: string } = {};
  return {
    set: (key: string, value: string) => { 
      memoryStorage[key] = value; 
    },
    getString: (key: string) => memoryStorage[key],
    contains: (key: string) => key in memoryStorage,
    delete: (key: string) => { delete memoryStorage[key]; },
    clearAll: () => { memoryStorage = {}; },
    getAllKeys: () => Object.keys(memoryStorage),
  };
};

// Пытаемся создать MMKV, если не получается - используем fallback
let storage: any;

try {
  storage = new MMKV();
  console.log('MMKV initialized successfully');
} catch (error) {
  console.log('MMKV failed, using fallback storage:', error);
  storage = createFallbackStorage();
}

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
  getAllIntervals: (): TimeIntervalType[] => {
    try {
      const intervals = storage.getString(StorageKeys.TIME_INTERVALS);
      return intervals ? JSON.parse(intervals) : [];
    } catch (error) {
      console.error('Error getting intervals:', error);
      return [];
    }
  },

  saveAllIntervals: (intervals: TimeIntervalType[]): boolean => {
    try {
      storage.set(StorageKeys.TIME_INTERVALS, JSON.stringify(intervals));
      return true;
    } catch (error) {
      console.error('Error saving intervals:', error);
      return false;
    }
  },

  addInterval: (interval: Omit<IntervalFormDataType, 'id'>): boolean => {
    const intervals = TimeIntervalStorage.getAllIntervals();
    const newInterval: TimeIntervalType = {
      ...interval,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    intervals.push(newInterval);
    return TimeIntervalStorage.saveAllIntervals(intervals);
  },

  updateInterval: (id: string, updatedInterval: Partial<IntervalFormDataType>): boolean => {
    const intervals = TimeIntervalStorage.getAllIntervals();
    const index = intervals.findIndex(interval => interval.id === id);
    if (index !== -1) {
      intervals[index] = { 
        ...intervals[index], 
        ...updatedInterval, 
        updatedAt: new Date().toISOString() 
      };
      return TimeIntervalStorage.saveAllIntervals(intervals);
    }
    return false;
  },

  deleteInterval: (id: string): boolean => {
    const intervals = TimeIntervalStorage.getAllIntervals();
    const filteredIntervals = intervals.filter(interval => interval.id !== id);
    return TimeIntervalStorage.saveAllIntervals(filteredIntervals);
  },

  getIntervalById: (id: string): TimeIntervalType | undefined => {
    const intervals = TimeIntervalStorage.getAllIntervals();
    return intervals.find(interval => interval.id === id);
  },
};