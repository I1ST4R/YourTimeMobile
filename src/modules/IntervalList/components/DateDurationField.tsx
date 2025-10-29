import { FieldErrors, UseFormSetValue, UseFormTrigger, UseFormWatch } from 'react-hook-form';
import { Text, TouchableOpacity, View } from 'react-native';
import tw from 'twrnc';
import { FormIntervalType } from '../interval/intervalStorage';
import { dateToString, stringToDate } from '../timeHelpers';
import React, { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';

type DateDurationFieldProps = {
  watch: UseFormWatch<FormIntervalType>
  errors: FieldErrors<FormIntervalType>
  setValue: UseFormSetValue<FormIntervalType>
  trigger: UseFormTrigger<FormIntervalType>
};

export const DateDurationField = ({
  watch,
  errors,
  setValue,
  trigger
}: DateDurationFieldProps) => {
  const formatDateForDisplay = (dateString: string) => {
    const date = stringToDate(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const [showDatePicker, setShowDatePicker] = useState(false);

  const selectedDate = stringToDate(watch('date'));

  const handleDateChange = (event: any, date?: Date) => {
    setShowDatePicker(false)

    if (date) {
      const newDateString = dateToString(date);
      setValue('date', newDateString, { shouldValidate: true });
      trigger('date');
      setShowDatePicker(false)
    }
  };

  return (
    <View style={tw`flex-row justify-between items-center mb-2`}>
      <View>
        <TouchableOpacity
          style={[
            tw`bg-gray-100 rounded-lg px-3 py-2 min-w-20 items-center`,
            errors.date && tw`border border-red-500`,
          ]}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={tw`text-sm text-gray-800 font-medium`}>
            {formatDateForDisplay(watch('date'))}
          </Text>
        </TouchableOpacity>
        {errors.date && (
          <Text style={tw`text-red-500 text-xs mt-1 text-center`}>
            {errors.date.message}
          </Text>
        )}
      </View>

      <Text style={tw`text-blue-500 text-base font-bold`}>
        {watch('duration')}
      </Text>

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
