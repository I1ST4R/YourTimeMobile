import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
} from 'react-native';
import { useAppDispatch } from '../../app/store';
import { loadIntervals, selectIntervals } from './interval.slice';
import { useSelector } from 'react-redux';
import IntervalItem from './IntervalItem';
import tw from 'twrnc';

const IntervalList = () => {
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(loadIntervals())
  },[dispatch])
  const intervals = useSelector(selectIntervals)

  if (intervals.length === 0) {
    return (
      <View style={tw`flex-1 justify-center items-center p-5`}>
        <Text style={tw`text-lg text-gray-600 mb-2`}>Нет добавленных интервалов</Text>
        <Text style={tw`text-sm text-gray-500 text-center`}>Нажмите "+" чтобы добавить первый интервал</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={intervals}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <IntervalItem interval={item}/>
      )}
      style={tw`flex-1`}
      contentContainerStyle={tw`py-2`}
    />
  );
};

export default IntervalList;