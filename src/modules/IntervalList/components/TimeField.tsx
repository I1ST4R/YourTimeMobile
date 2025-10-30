import { Text, TouchableOpacity, View } from 'react-native';
import tw from 'twrnc';
import { useState } from 'react';
import TimePickerModal from '../../TimePickerModal/TimePickerModal';
import { useAppDispatch} from '../../../app/store';
import { clearTimer } from '../slices/timer/timer.slice';
import { TimerType } from '../slices/timer/timerStorage';
import { useUpdateIntervalMutation } from '../slices/interval/intervalsApi';
import { TimerField } from './TimerField';

type TimeFieldProps = {
  startTime: string,
  endTime: string,
  timer?: TimerType | null
  intervalId: string
};

export const TimeField = ({ 
  startTime,
  endTime,
  timer,
  intervalId
}: TimeFieldProps) => {
  const dispatch = useAppDispatch();
  const [updateInterval] = useUpdateIntervalMutation();
  const [timePickerOpen, setTimePickerOpen] = useState(false);
  const [editingField, setEditingField] = useState<'startTime' | 'endTime' | null>(null);
  const isTimerActive = timer !== undefined;
  const [isTimerMode, setIsTimerMode] = useState(isTimerActive);

  const openTimePicker = (field: 'startTime' | 'endTime') => {
    setEditingField(field);
    setTimePickerOpen(true);
  };

  const handleChange = (time: string) => {
    if(editingField === 'startTime') updateInterval({
      id: intervalId,
      interval : {
        startTime: time
      }
    })
    if(editingField === 'endTime') updateInterval({
      id: intervalId,
      interval : {
        endTime: time
      }
    })
  }

  

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

  if (isTimerMode) {
    return (
      <View style={tw`flex-row items-center gap-2 mb-1`}>
        <View style={tw`flex-1`}>
          <TimerField 
            timer={timer} 
            intervalId={intervalId}
          />
        </View>
        
        <TouchableOpacity
          onPress={handleModeToggle}
          style={tw`bg-gray-500 rounded-lg px-3 py-2 items-center justify-center min-w-12`}
        >
          <Text style={tw`text-white text-sm font-bold`}>✏️</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={tw`flex-row items-center gap-2 mb-1`}>
      <View style={tw`flex-1`}>
        <TouchableOpacity
          onPress={() => openTimePicker('startTime')}
          style={tw`bg-gray-100 rounded-lg px-3 py-2 items-center`}
        >
          <Text style={tw`text-sm text-gray-800 font-medium`}>
            {startTime}
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={tw`text-gray-600 text-sm`}>-</Text>

      <View style={tw`flex-1`}>
        <TouchableOpacity
          onPress={() => openTimePicker('endTime')}
          style={tw`bg-gray-100 rounded-lg px-3 py-2 items-center`}
        >
          <Text style={tw`text-sm text-gray-800 font-medium`}>
            {endTime}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={handleModeToggle}
        style={tw`bg-blue-500 rounded-lg px-3 py-2 items-center justify-center min-w-12`}
      >
        <Text style={tw`text-white text-sm font-bold`}>⏱️</Text>
      </TouchableOpacity>

      <TimePickerModal
        isOpen={timePickerOpen}
        onClose={handleTimePickerClose}
        initialTime={editingField === 'startTime' ? startTime : endTime}
        timeChange={handleChange}
      />
    </View>
  );
};