export const formatDateTime = (day: Date, time: string): string => {
  const dateString = day.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  return `${dateString} ${time}`;
};

const getFullDate = (day: Date,time: string) => {
  const dateTime = new Date(day)
  const [startHours, startMinutes, startSeconds] = time.split(':').map(Number)
  dateTime.setHours(startHours, startMinutes, startSeconds)
  return dateTime
}

export const calculateDuration = (
  startDay: Date, 
  startTime: string, 
  endDay: Date, 
  endTime: string
): string => {

  const startDateTime = getFullDate(startDay, startTime)
  const endDateTime = getFullDate(endDay, endTime)
  
  const diffMs = endDateTime.getTime() - startDateTime.getTime();
  
  const totalSeconds = Math.floor(diffMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

export const getCurrentDate = (): Date => {
  const date = new Date();
  date.setHours(0, 0, 0, 0); 
  return date;
};