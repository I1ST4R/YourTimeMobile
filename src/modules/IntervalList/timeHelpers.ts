import { IntervalType } from "./slices/interval/intervalStorage";


export const parseTime = (timeStr: string) => {
  const [hours, minutes, seconds] = timeStr.split(':').map(Number);
  return { hours, minutes, seconds };
};

const SECONDS_IN_DAY = 24 * 3600

export const calculateDuration = (
  startTime: string, 
  endTime: string,
): [string, boolean] => { 

  const start = parseTime(startTime);
  const end = parseTime(endTime);

  const startTotalSeconds = start.hours * 3600 + start.minutes * 60 + start.seconds;
  const endTotalSeconds = end.hours * 3600 + end.minutes * 60 + end.seconds;

  let totalSeconds: number;

  if (endTotalSeconds < startTotalSeconds) {
    totalSeconds = (SECONDS_IN_DAY - startTotalSeconds) + endTotalSeconds;
  } else {
    totalSeconds = endTotalSeconds - startTotalSeconds;
  }

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  // Всегда показываем часы, даже если они равны 0
  const duration = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return [duration, endTotalSeconds < startTotalSeconds];
};

// export const getCurrentDate = (): string => {
//   const date = new Date();
//   date.setHours(0, 0, 0, 0); 
//   return date.toString();
// };

export const getCurrentTime = (): string => {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
};

export const stringToDate = (dateString: string): Date => {
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return new Date(dateString + 'T00:00:00');
  }
  
  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) {
    console.warn('Invalid date string:', dateString);
    return new Date();
  }
  
  return date;
};

export const dateToString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`; 
};

// Парсим время в секунды
export const timeStringToSeconds = (timeStr: string): number => {
  const [hours, minutes, seconds] = timeStr.split(':').map(Number);
  return hours * 3600 + minutes * 60 + seconds;
};

// Конвертируем секунды обратно в строку HH:MM:SS
export const secondsToTimeString = (totalSeconds: number): string => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

// Группируем интервалы по категориям и суммируем время
export const analyzeIntervalsByCategory = (intervals: IntervalType[]): { 
  category: string; 
  totalSeconds: number;
  formattedTime: string;
}[] => {
  const categoryMap = new Map<string, number>();
  
  intervals.forEach(interval => {
    const durationSeconds = timeStringToSeconds(interval.duration);
    const currentTotal = categoryMap.get(interval.category) || 0;
    categoryMap.set(interval.category, currentTotal + durationSeconds);
  });
  
  // Преобразуем Map в массив объектов
  return Array.from(categoryMap.entries()).map(([category, totalSeconds]) => ({
    category,
    totalSeconds,
    formattedTime: secondsToTimeString(totalSeconds)
  }));
};

// Генерируем цвета для категорий
export const generateCategoryColors = (categories: string[]): Map<string, string> => {
  const colorPalette = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', 
    '#FF9F40', '#FF6384', '#C9CBCF', '#7CFFB2', '#FF6B6B',
    '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'
  ];
  
  const colorMap = new Map<string, string>();
  categories.forEach((category, index) => {
    colorMap.set(category, colorPalette[index % colorPalette.length]);
  });
  
  return colorMap;
};