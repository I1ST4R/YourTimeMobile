import { FieldErrors, UseFormSetValue, UseFormTrigger, UseFormWatch } from 'react-hook-form';
import { Text, TouchableOpacity, View } from 'react-native';
import tw from 'twrnc';
import { FormIntervalType } from '../slices/interval/intervalStorage';
import TimePickerModal from '../../TimePickerModal/TimePickerModal';
import { useState } from 'react';
import { TimerField } from './TimerField';
import { useAppDispatch} from '../../../app/store';
import { clearTimer } from '../slices/timer/timer.slice';
import { TimerType } from '../slices/timer/timerStorage';

type TimeFieldProps = {
  errors: FieldErrors<FormIntervalType>
  watch: UseFormWatch<FormIntervalType>
  setValue: UseFormSetValue<FormIntervalType>
  trigger: UseFormTrigger<FormIntervalType>
  timer?: TimerType | null
  intervalId: string
};

export const TimeField = ({ 
  errors, 
  watch,
  setValue,
  trigger,
  timer,
  intervalId
}: TimeFieldProps) => {
  const dispatch = useAppDispatch();
  const watchStartTime = watch('startTime');
  const watchEndTime = watch('endTime');
  const watchIsDifDays = watch('isDifDays');
  const [timePickerOpen, setTimePickerOpen] = useState(false);
  const [editingField, setEditingField] = useState<'startTime' | 'endTime' | null>(null);

  // Если есть timer - значит таймер активен для этого интервала
  const isTimerActive = timer !== undefined;
  // Автоматически включаем режим таймера если он активен
  const [isTimerMode, setIsTimerMode] = useState(isTimerActive);

  const openTimePicker = (field: 'startTime' | 'endTime') => {
    setEditingField(field);
    setTimePickerOpen(true);
  };

  const handleTimeSelect = (time: string) => {
    if (editingField) {
      setValue(editingField, time, { 
        shouldValidate: true,
        shouldDirty: true 
      });
      trigger(editingField);
    }
    setTimePickerOpen(false);
    setEditingField(null);
  };

  const handleTimePickerClose = () => {
    setTimePickerOpen(false);
    setEditingField(null);
  };

  const handleModeToggle = () => {
    if (isTimerMode && isTimerActive) {
      dispatch(clearTimer());
    }
    setIsTimerMode(prev => !prev);
  };

  // Если включен режим таймера - показываем компонент таймера
  if (isTimerMode) {
    return (
      <View style={tw`flex-row items-center gap-2 mb-1`}>
        {/* Таймер слева */}
        <View style={tw`flex-1`}>
          <TimerField 
            setValue={setValue}
            timer={timer} 
            intervalId= {intervalId}
            trigger={trigger}
          />
        </View>
        
        {/* Кнопка переключения обратно СПРАВА */}
        <TouchableOpacity
          onPress={handleModeToggle}
          style={tw`bg-gray-500 rounded-lg px-3 py-2 items-center justify-center min-w-12`}
        >
          <Text style={tw`text-white text-sm font-bold`}>✏️</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Иначе показываем обычный выбор времени
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
            {watchStartTime}
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
            {watchEndTime}
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

      {/* Кнопка таймера СПРАВА */}
      <TouchableOpacity
        onPress={handleModeToggle}
        style={tw`bg-blue-500 rounded-lg px-3 py-2 items-center justify-center min-w-12`}
      >
        <Text style={tw`text-white text-sm font-bold`}>⏱️</Text>
      </TouchableOpacity>

      <TimePickerModal
        isOpen={timePickerOpen}
        onClose={handleTimePickerClose}
        onTimeSelect={handleTimeSelect}
        initialTime={editingField ? watch(editingField) : ''}
      />
    </View>
  );
};