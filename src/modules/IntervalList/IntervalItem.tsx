import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, TextInput } from 'react-native';
import tw from 'twrnc';

import { useAppDispatch } from '../../app/store';
import {
  deleteInterval,
  updateInterval,
  addInterval,
} from './slices/interval/interval.slice';
import { StoreIntervalType } from './slices/interval/intervalStorage';
import { calculateDuration } from './timeHelpers';

type IntervalItemProps = {
  interval: StoreIntervalType;
};

const IntervalItem = ({ interval }: IntervalItemProps) => {
  const dispatch = useAppDispatch();

  const [name, setName] = useState(interval.name);
  const [startTime, setStartTime] = useState(interval?.startTime);
  const [endTime, setEndTime] = useState(interval?.endTime);
  const [category, setCategory] = useState(interval?.category);
  const [date, setDate] = useState(interval?.date);

  const [isChanged, setIsChanged] = useState(false);
  const [showCategorySelector, setShowCategorySelector] = useState(false);

  const handleChange = (field: string, value: string) => {
    switch (field) {
      case 'name':
        setName(value);
        break;
      case 'startTime':
        setStartTime(value);
        break;
      case 'endTime':
        setEndTime(value);
        break;
      case 'category':
        setCategory(value);
        break;
    }

    if (!isChanged) {
      setIsChanged(true);
    }
  };

  const handleSave = () => {
    const [duration, isDifDays] = calculateDuration(startTime, endTime);

    const intervalData = {
      name: name.trim(),
      startTime,
      endTime,
      date,
      duration,
      isDifDays,
      category,
    };

    dispatch(
      updateInterval({
        id: interval!.id,
        interval: intervalData,
      }),
    );
    setIsChanged(false);
  };

  const handleCancel = () => {
    setName(interval!.name);
    setStartTime(interval!.startTime);
    setEndTime(interval!.endTime);
    setCategory(interval!.category || '');
    setDate(interval!.date);
    setIsChanged(false);
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
          onPress: () => dispatch(deleteInterval(interval!.id)),
        },
      ],
    );
  };

  return (
    <View
      style={tw`bg-white p-3 my-1 mx-2 rounded-lg shadow-md shadow-black/10 elevation-2`}
    >
      {/* Первая строка: Название и категория */}
      <View style={tw`flex-row justify-between items-center mb-2`}>
        <TextInput
          value={name}
          onChangeText={value => handleChange('name', value)}
          style={tw`flex-1 bg-gray-100 rounded-lg px-3 py-2 text-base font-bold mr-2`}
          placeholder="Название"
          placeholderTextColor="#808080"
        />

        <TextInput
          value={category}
          onChangeText={value => handleChange('category', value)}
          style={tw`w-1/3 bg-gray-100 rounded-lg px-3 py-2 text-sm text-gray-600`}
          placeholder="Категория"
          placeholderTextColor="#808080"
        />

        <TouchableOpacity
          style={tw`bg-red-500 p-2 rounded-lg min-w-10 items-center`}
          onPress={handleDelete}
        >
          <Text style={tw`text-white text-sm`}>🗑️</Text>
        </TouchableOpacity>
      </View>

      {/* Вторая строка: Время и длительность */}
      <View style={tw`flex-row justify-between items-center`}>
        <View style={tw`flex-row items-center gap-1`}>
          <TextInput
            value={startTime}
            onChangeText={value => handleChange('startTime', value)}
            style={tw`bg-gray-100 rounded-lg px-2 py-1 text-sm text-gray-800 w-16 text-center`}
            placeholder="10:00"
            placeholderTextColor="#808080"
          />
          <Text style={tw`text-gray-600 text-sm`}>-</Text>
          <TextInput
            value={endTime}
            onChangeText={value => handleChange('endTime', value)}
            style={tw`bg-gray-100 rounded-lg px-2 py-1 text-sm text-gray-800 w-16 text-center`}
            placeholder="11:00"
            placeholderTextColor="#808080"
          />

          {interval!.isDifDays && (
            <View style={tw`bg-red-400 px-1.5 py-0.5 rounded-lg ml-1`}>
              <Text style={tw`text-white text-xs font-bold`}>+1д</Text>
            </View>
          )}
        </View>

        <View style={tw`flex-row items-center gap-1`}>
          <Text style={tw`text-gray-600 text-sm`}>{date}</Text>
          <Text style={tw`text-blue-500 text-sm font-bold`}>
            {interval!.duration}
          </Text>
        </View>
      </View>

      {/* Кнопки сохранения/отмены (только при изменениях) */}
      {isChanged && (
        <View style={tw`flex-row justify-end gap-2 mt-2`}>
          <TouchableOpacity
            style={tw`bg-gray-500 p-2 rounded-lg min-w-10 items-center`}
            onPress={handleCancel}
          >
            <Text style={tw`text-white text-sm`}>❌</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={tw`bg-green-500 p-2 rounded-lg min-w-10 items-center`}
            onPress={handleSave}
          >
            <Text style={tw`text-white text-sm`}>✅</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default IntervalItem;