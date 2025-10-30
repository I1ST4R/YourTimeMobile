import React from 'react';
import { View, Alert, Text, TouchableOpacity } from 'react-native';
import { NameField } from './components/NameField';
import { CategoryField } from './components/CategoryField';
import { TimeField } from './components/TimeField';
import { DateDurationField } from './components/DateDurationField';
import tw from 'twrnc';
import { useSelector } from 'react-redux';
import { selectTimer } from './slices/timer/timer.slice';
import { RootState } from '../../app/store';
import {
  useDeleteIntervalMutation,
  useGetIntervalByIdQuery,
} from './slices/interval/intervalsApi';

type IntervalItemProps = {
  intervalId: string;
};

const IntervalItem = ({ intervalId }: IntervalItemProps) => {
  const { data: interval, isLoading } = useGetIntervalByIdQuery(intervalId);
  const [deleteInterval] = useDeleteIntervalMutation();
  const timer = useSelector((state: RootState) =>
    selectTimer(state)(intervalId),
  );
  
  console.log(timer)
  const handleDelete = () => {
    Alert.alert(
      'Удаление интервала',
      'Вы уверены, что хотите удалить этот интервал?',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: () => deleteInterval(intervalId),
        },
      ],
    );
  };

  if (isLoading) {
    return (
      <View style={tw`bg-white p-3 my-1 mx-2 rounded-lg`}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!interval) {
    return (
      <View style={tw`bg-white p-3 my-1 mx-2 rounded-lg`}>
        <Text>Interval not found</Text>
      </View>
    );
  }

  return (
    <View
      style={tw`bg-white p-3 my-1 mx-2 rounded-lg shadow-md shadow-black/10 elevation-2`}
    >
      <NameField value={interval.name} intervalId={intervalId}/>
      <CategoryField value={interval.category} intervalId={intervalId}/>
      <TimeField
        timer={timer}
        intervalId={intervalId}
        startTime={interval.startTime}
        endTime={interval.endTime}
      />

      <View style={tw`flex-row items-center justify-between`}>
        <View style={tw`flex-1`}>
          <DateDurationField
            date={interval.date}
            duration={interval.duration}
            intervalId={intervalId}
            isTimerActive = {Boolean(timer)}
          />
        </View>

        <TouchableOpacity
          style={tw`bg-red-500 p-3 rounded-lg ml-2 mb-2`}
          onPress={handleDelete}
        >
          <Text style={tw`text-white text-sm`}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default IntervalItem;
