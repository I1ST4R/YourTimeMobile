import { FieldErrors, UseFormSetValue, UseFormTrigger, UseFormWatch } from 'react-hook-form';
import { Text, TouchableOpacity, View } from 'react-native';
import tw from 'twrnc';
import { FormIntervalType } from '../interval/intervalStorage';
import TimePickerModal from '../../TimePickerModal/TimePickerModal';
import { useState } from 'react';

type TimeFieldProps = {
  errors: FieldErrors<FormIntervalType>
  watch: UseFormWatch<FormIntervalType>
  setValue: UseFormSetValue<FormIntervalType>
  trigger: UseFormTrigger<FormIntervalType>
};

export const TimeField = ({ 
  errors, 
  watch,
  setValue,
  trigger
}: TimeFieldProps) => {
  const watchStartTime = watch('startTime');
  const watchEndTime = watch('endTime');
  const watchIsDifDays = watch('isDifDays');
  const [timePickerOpen, setTimePickerOpen] = useState(false);
  const [editingField, setEditingField] = useState<'startTime' | 'endTime' | null>(null);

  const openTimePicker = (field: 'startTime' | 'endTime') => {
    setEditingField(field);
    setTimePickerOpen(true);
  };

  const formatTimeForDisplay = (time: string) => {
    const [hours, minutes, seconds] = time.split(':');
    if (seconds === '00') {
      return `${hours}:${minutes}`;
    }
    return `${hours}:${minutes}:${seconds}`;
  };

  const handleTimeSelect = (time: string) => {
    if (editingField) {
      setValue(editingField, time, { shouldValidate: true });
      trigger(editingField);
    }
    setTimePickerOpen(false);
    setEditingField(null);
  };

  const handleTimePickerClose = () => {
    setTimePickerOpen(false);
    setEditingField(null);
  };

  return (
    <View style={tw`flex-row items-center gap-2 mb-1`}>
      <View style={tw`flex-1`}>
        <TouchableOpacity
          onPress={() => openTimePicker('startTime')}
          style={[
            tw`bg-gray-100 rounded-lg px-3 py-2 items-center`,
            errors.startTime && tw`border border-red-500`,
          ]}
        >
          <Text style={tw`text-sm text-gray-800 font-medium`}>
            {formatTimeForDisplay(watchStartTime)}
          </Text>
        </TouchableOpacity>
        {errors.startTime && (
          <Text style={tw`text-red-500 text-xs mt-1 text-center`}>
            {errors.startTime.message}
          </Text>
        )}
      </View>

      <Text style={tw`text-gray-600 text-sm`}>-</Text>

      <View style={tw`flex-1`}>
        <TouchableOpacity
          onPress={() => openTimePicker('endTime')}
          style={[
            tw`bg-gray-100 rounded-lg px-3 py-2 items-center`,
            errors.endTime && tw`border border-red-500`,
          ]}
        >
          <Text style={tw`text-sm text-gray-800 font-medium`}>
            {formatTimeForDisplay(watchEndTime)}
          </Text>
        </TouchableOpacity>
        {errors.endTime && (
          <Text style={tw`text-red-500 text-xs mt-1 text-center`}>
            {errors.endTime.message}
          </Text>
        )}
      </View>

      {watchIsDifDays && (
        <View style={tw`bg-red-400 px-1.5 py-0.5 rounded-lg`}>
          <Text style={tw`text-white text-xs font-bold`}>+1д</Text>
        </View>
      )}

      <TimePickerModal
        isOpen={timePickerOpen}
        onClose={handleTimePickerClose}
        onTimeSelect={handleTimeSelect}
        initialTime={editingField ? watch(editingField) : ''}
      />
    </View>
  );
};
