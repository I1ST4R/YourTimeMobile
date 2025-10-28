export const formatDateTime = (day: Date, time: string): string => {
  const dateString = day.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  return `${dateString} ${time}`;
};

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

  let duration: string;

  if (hours > 0) {
    duration = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  } else if (minutes > 0) {
    duration = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  } else {
    duration = `00:${seconds.toString().padStart(2, '0')}`;
  }

  return [duration, endTotalSeconds < startTotalSeconds];
};

export const getCurrentDate = (): Date => {
  const date = new Date();
  date.setHours(0, 0, 0, 0); 
  return date;
};