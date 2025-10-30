import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useAppDispatch } from '../../app/store';
import { loadIntervals, selectIntervals, addInterval } from './slices/interval/interval.slice';
import { useSelector } from 'react-redux';
import IntervalItem from './IntervalItem';
import tw from 'twrnc';
import { dateToString, getCurrentTime } from './timeHelpers';
import { getTimer } from './slices/timer/timer.slice';

const IntervalList = () => {
  const dispatch = useAppDispatch()
  
  useEffect(() => {
    dispatch(loadIntervals())
    dispatch(getTimer())
  },[dispatch])
  
  const intervals = useSelector(selectIntervals)

  const handleAddNewInterval = () => {
    dispatch(addInterval({
      name: '',
      startTime: getCurrentTime(),
      endTime: getCurrentTime(),
      date: dateToString(new Date()),
      category: '',
      duration: '00:00:00',
      isDifDays: false
    }))
  }

  return (
    <View style={tw`flex-1`}>
      {/* Кнопка добавления */}
      <TouchableOpacity 
        style={tw`bg-blue-500 mx-4 my-3 p-3 rounded-lg items-center`}
        onPress={handleAddNewInterval}
      >
        <Text style={tw`text-white text-base font-bold`}>+ Добавить интервал</Text>
      </TouchableOpacity>
      <FlatList
        data={intervals}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <IntervalItem interval={item} />
        )}
        style={tw`flex-1`}
        contentContainerStyle={tw`py-2`}
      />
    </View>
  );
};

export default IntervalList;