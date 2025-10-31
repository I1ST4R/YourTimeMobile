import { Text, TouchableOpacity, View } from 'react-native';
import tw from 'twrnc';
import { dateToString, stringToDate } from '../timeHelpers';
import React, { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useUpdateIntervalMutation } from '../slices/interval/intervalsApi';

type DateDurationFieldProps = {
  date: string;
  duration: string,
  isDifDays: boolean,
  intervalId: string;
  isTimerActive: boolean;
};

export const DateDurationField = ({
  date,
  duration,
  isDifDays,
  intervalId,
  isTimerActive
}: DateDurationFieldProps) => {
  const [updateInterval] = useUpdateIntervalMutation();
  const [currentDate, setCurrentDate] = useState(date);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const formatDateForDisplay = (dateString: string) => {
    const dateFormated = stringToDate(dateString);
    return dateFormated.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const selectedDate = stringToDate(currentDate);

  const handleDateChange = (event: any, dateToChange?: Date) => {
    setShowDatePicker(false);
  
    if (dateToChange) {
      const newDateString = dateToString(dateToChange);
      setCurrentDate(newDateString);
      updateInterval({
        id: intervalId,
        interval: { date: newDateString }
      });
    }
  };

  return (
    <View style={tw`flex-row justify-between items-center mb-2`}>
      <View style={tw`flex-row items-center`}>
        <TouchableOpacity
          style={tw`bg-gray-100 rounded-lg px-3 py-2 min-w-20 items-center`}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={tw`text-sm text-gray-800 font-medium`}>
            {formatDateForDisplay(currentDate)}
          </Text>
        </TouchableOpacity>
        
        {/* Показываем +1 красным если таймер переходит на следующий день */}
        {isDifDays && (
          <Text style={tw`text-red-500 text-sm font-bold ml-1`}>
            +1
          </Text>
        )}
      </View>

      {!isTimerActive && (
        <Text style={tw`text-blue-500 text-base font-bold`}>
          {duration}
        </Text>
      )}

      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
    </View>
  );
};