import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import tw from 'twrnc';

import { useAppDispatch } from '../../app/store';
import { deleteInterval } from './slices/interval/interval.slice';
import { changeCurrentInterval, openForm } from '../IntervalForm/form.slice';
import { StoreIntervalType } from './slices/interval/intervalStorage';

const IntervalItem = ({ interval }: { interval: StoreIntervalType }) => {
  const dispatch = useAppDispatch();

  const handleEditInterval = () => {
    dispatch(changeCurrentInterval(interval));
    dispatch(openForm());
  };

  const handleDelete = () => {
    Alert.alert(
      'Удаление интервала',
      'Вы уверены, что хотите удалить этот интервал?',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: () => dispatch(deleteInterval(interval.id)),
        },
      ],
    );
  };

  // const [duration, isDifDays] = calculateDuration(
  //   interval.startTime,
  //   interval.endTime,
  // );

  return (
    <View style={tw`flex-row bg-white p-4 my-1 mx-2 rounded-lg shadow-md shadow-black/10 elevation-2`}>
      {/* Content */}
      <View style={tw`flex-1`}>
        <Text style={tw`text-base font-bold mb-1`}>{interval.name}</Text>
        <Text style={tw`text-sm text-gray-600 mb-1`}>{interval.date.toString()}</Text>
        
        <View style={tw`mb-1`}>
          <View style={tw`flex-row items-center gap-1.5`}>
            <Text style={tw`text-sm text-gray-800`}>
              {interval.startTime} - {interval.endTime}
            </Text>
            {interval.isDifDays && (
              <View style={tw`bg-red-400 px-1.5 py-0.5 rounded-lg`}>
                <Text style={tw`text-white text-xs font-bold`}>+1д</Text>
              </View>
            )}
          </View>
          <Text style={tw`text-blue-500 text-xs mt-0.5`}>
            Длительность: {interval.duration}
          </Text>
        </View>
        
        {interval.category && (
          <Text style={tw`text-gray-600 text-xs italic mt-1`}>
            {interval.category}
          </Text>
        )}
      </View>

      {/* Actions */}
      <View style={tw`flex-row items-center gap-2`}>
        <TouchableOpacity
          style={tw`bg-orange-500 p-2 rounded min-w-9 items-center`}
          onPress={handleEditInterval}
        >
          <Text style={tw`text-white text-xs`}>✏️</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={tw`bg-red-500 p-2 rounded min-w-9 items-center`}
          onPress={handleDelete}
        >
          <Text style={tw`text-white text-xs`}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default IntervalItem;