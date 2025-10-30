import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import IntervalItem from './IntervalItem';
import tw from 'twrnc';
import { dateToString, getCurrentTime } from './timeHelpers';
import { useAddIntervalMutation, useGetIntervalIdsQuery } from './slices/interval/intervalsApi';

const IntervalList = () => {
  const { data: intervalIds = [], isLoading, error } = useGetIntervalIdsQuery();
  const [addInterval] = useAddIntervalMutation();
  console.log("List render")
  const handleAddNewInterval = async () => {
    try {
      await addInterval({
        name: '',
        startTime: getCurrentTime(),
        endTime: getCurrentTime(),
        date: dateToString(new Date()),
        category: '',
        duration: '00:00:00',
        isDifDays: false
      }).unwrap();
    } catch (error) {
      console.error('Failed to add interval:', error);
    }
  };

  if (isLoading) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <Text>Error loading intervals</Text>
      </View>
    );
  }

  return (
    <View style={tw`flex-1`}>
      <TouchableOpacity 
        style={tw`bg-blue-500 mx-4 my-3 p-3 rounded-lg items-center`}
        onPress={handleAddNewInterval}
      >
        <Text style={tw`text-white text-base font-bold`}>+ Добавить интервал</Text>
      </TouchableOpacity>
      <FlatList
        data={intervalIds}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <IntervalItem intervalId={item} />
        )}
        style={tw`flex-1`}
        contentContainerStyle={tw`py-2`}
      />
    </View>
  );
};

export default IntervalList;