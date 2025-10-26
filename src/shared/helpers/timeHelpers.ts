// Форматирование времени для отображения
export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
};

// Форматирование даты
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('ru-RU');
};

// Расчет длительности интервала
export const calculateDuration = (startTime: string, endTime: string): string => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const diffMs = end.getTime() - start.getTime();
  
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

// Валидация интервала
export const validateInterval = (startTime: string, endTime: string): { isValid: boolean; error: string | null } => {
  if (!startTime || !endTime) {
    return { isValid: false, error: 'Оба времени должны быть заполнены' };
  }
  
  const start = new Date(startTime);
  const end = new Date(endTime);
  
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return { isValid: false, error: 'Неверный формат времени' };
  }
  
  if (end <= start) {
    return { isValid: false, error: 'Время окончания должно быть позже времени начала' };
  }
  
  return { isValid: true, error: null };
};

// Получить текущее время в формате для input
export const getCurrentDateTime = (): string => {
  return new Date().toISOString().slice(0, 16);
};