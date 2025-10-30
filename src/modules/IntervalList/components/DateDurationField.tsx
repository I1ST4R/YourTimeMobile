import { Text, TouchableOpacity, View } from 'react-native';
import tw from 'twrnc';
import { dateToString, stringToDate } from '../timeHelpers';
import React, { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useUpdateIntervalMutation } from '../slices/interval/intervalsApi';

type DateDurationFieldProps = {
  date: string;
  duration: string;
  intervalId: string;
  isTimerActive: boolean;
};

export const DateDurationField = ({
  date,
  duration,
  intervalId,
  isTimerActive
}: DateDurationFieldProps) => {
  const [updateInterval] = useUpdateIntervalMutation();
  const [currentDate, setCurrentDate] = useState(date);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const formatDateForDisplay = (dateString: string) => {
    const date = stringToDate(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const selectedDate = stringToDate(currentDate);

  const handleDateChange = (event: any, date?: Date) => {
    setShowDatePicker(false);
  
    if (date) {
      const newDateString = dateToString(date);
      setCurrentDate(newDateString);
      updateInterval({
        id: intervalId,
        interval: { date: newDateString }
      });
    }
  };

  return (
    <View style={tw`flex-row justify-between items-center mb-2`}>
      <View>
        <TouchableOpacity
          style={tw`bg-gray-100 rounded-lg px-3 py-2 min-w-20 items-center`}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={tw`text-sm text-gray-800 font-medium`}>
            {formatDateForDisplay(currentDate)}
          </Text>
        </TouchableOpacity>
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