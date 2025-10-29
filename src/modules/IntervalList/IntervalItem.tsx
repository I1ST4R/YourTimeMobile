import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, TextInput, Platform, Modal } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import tw from 'twrnc';

import { useAppDispatch } from '../../app/store';
import {
  deleteInterval,
  updateInterval,
} from './slices/interval/interval.slice';
import { StoreIntervalType } from './slices/interval/intervalStorage';
import { calculateDuration, dateToString, stringToDate } from './timeHelpers';
import { CategorySelector } from '../CategorySelector/CategorySelector';
import TimePickerModal from '../TimePickerModal/TimePickerModal';

type IntervalItemProps = {
  interval: StoreIntervalType;
};

const IntervalItem = ({ interval }: IntervalItemProps) => {
  const dispatch = useAppDispatch();
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [category, setCategory] = useState(interval.category);
  const [isDifDays, setIsDifDays] = useState(interval.isDifDays);
  const [name, setName] = useState(interval.name);
  const [startTime, setStartTime] = useState(interval.startTime);
  const [endTime, setEndTime] = useState(interval.endTime);
  const [date, setDate] = useState(interval.date);

  const [isChanged, setIsChanged] = useState(false);

  // Состояния для TimePickerModal
  const [timePickerOpen, setTimePickerOpen] = useState(false);
  const [editingField, setEditingField] = useState<
    'startTime' | 'endTime' | null
  >(null);
  const [currentTime, setCurrentTime] = useState('');

  // Состояния для DatePicker
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(stringToDate(date));

  const handleChange = (field: string, value: string) => {
    let newStartTime = startTime;
    let newEndTime = endTime;
    switch (field) {
      case 'name':
        setName(value);
        break;
      case 'startTime':
        newStartTime = value;
        setStartTime(value);
        break;
      case 'endTime':
        newEndTime = value;
        setEndTime(value);
        break;
      case 'date':
        setDate(value);
        break;
    }
    const [_, isDifDaysParam] = calculateDuration(newStartTime, newEndTime);
    setIsDifDays(isDifDaysParam);
    if (!isChanged) {
      setIsChanged(true);
    }
  };

  const handleChangeCategory = (value: string) => {
    setCategory(value);
    if (!isChanged) {
      setIsChanged(true);
    }
  };

  // Функция для открытия пикера времени
  const openTimePicker = (field: 'startTime' | 'endTime') => {
    setEditingField(field);
    setCurrentTime(field === 'startTime' ? startTime : endTime);
    setTimePickerOpen(true);
  };

  // Функция для обработки выбора времени из модалки
  const handleTimeSelect = (time: string) => {
    if (editingField) {
      handleChange(editingField, time);
    }
    setTimePickerOpen(false);
    setEditingField(null);
  };

  // Функция для закрытия модалки без сохранения
  const handleTimePickerClose = () => {
    setTimePickerOpen(false);
    setEditingField(null);
  };

  // Функция для открытия DatePicker
  const openDatePicker = () => {
    setSelectedDate(stringToDate(date));
    setShowDatePicker(true);
  };

  // Функция для обработки выбора даты
  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }

    if (selectedDate) {
      setSelectedDate(selectedDate);
      const newDateString = dateToString(selectedDate);
      handleChange('date', newDateString);
      
      // На Android закрываем сразу после выбора
      if (Platform.OS === 'android') {
        setShowDatePicker(false);
      }
    }
  };

  // Функция для подтверждения выбора даты на iOS
  const handleDateConfirm = () => {
    const newDateString = dateToString(selectedDate);
    handleChange('date', newDateString);
    setShowDatePicker(false);
  };

  // Функция для форматирования времени для отображения в кнопке
  const formatTimeForDisplay = (time: string) => {
    const [hours, minutes, seconds] = time.split(':');
    // Если секунды равны 00, не показываем их
    if (seconds === '00') {
      return `${hours}:${minutes}`;
    }
    return `${hours}:${minutes}:${seconds}`;
  };

  // Функция для форматирования даты для отображения
  const formatDateForDisplay = (dateString: string) => {
    const date = stringToDate(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
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
    setName(interval.name);
    setStartTime(interval.startTime);
    setEndTime(interval.endTime);
    setCategory(interval.category);
    setDate(interval.date);
    setIsDifDays(interval.isDifDays);
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
      {/* Первая строка: Название */}
      <View style={tw`mb-2`}>
        <TextInput
          value={name}
          onChangeText={value => handleChange('name', value)}
          style={tw`w-full bg-gray-100 rounded-lg px-3 py-2 text-base font-bold`}
          placeholder="Название"
          placeholderTextColor="#808080"
        />
      </View>

      {/* Вторая строка: Категория */}
      <View style={tw`mb-2`}>
        <TouchableOpacity
          onPress={() => setIsSelectOpen(true)}
          style={tw`w-full bg-gray-100 rounded-lg px-3 py-2`}
        >
          <Text style={tw`text-sm text-gray-600 text-left`}>
            {category || 'Категория'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Третья строка: Время */}
      <View style={tw`flex-row items-center gap-2 mb-1`}>
        {/* Кнопка для выбора времени начала */}
        <TouchableOpacity
          onPress={() => openTimePicker('startTime')}
          style={tw`flex-1 bg-gray-100 rounded-lg px-3 py-2 items-center`}
        >
          <Text style={tw`text-sm text-gray-800 font-medium`}>
            {formatTimeForDisplay(startTime)}
          </Text>
        </TouchableOpacity>

        <Text style={tw`text-gray-600 text-sm`}>-</Text>

        {/* Кнопка для выбора времени окончания */}
        <TouchableOpacity
          onPress={() => openTimePicker('endTime')}
          style={tw`flex-1 bg-gray-100 rounded-lg px-3 py-2 items-center`}
        >
          <Text style={tw`text-sm text-gray-800 font-medium`}>
            {formatTimeForDisplay(endTime)}
          </Text>
        </TouchableOpacity>

        {isDifDays && (
          <View style={tw`bg-red-400 px-1.5 py-0.5 rounded-lg`}>
            <Text style={tw`text-white text-xs font-bold`}>+1д</Text>
          </View>
        )}
      </View>

      {/* Четвертая строка: Дата и длительность */}
      <View style={tw`flex-row justify-between items-center mb-2`}>
        {/* Кнопка даты */}
        <TouchableOpacity
          style={tw`bg-gray-100 rounded-lg px-3 py-2 min-w-20 items-center`}
          onPress={openDatePicker}
        >
          <Text style={tw`text-sm text-gray-800 font-medium`}>
            {formatDateForDisplay(date)}
          </Text>
        </TouchableOpacity>

        {/* Суммарное время */}
        <Text style={tw`text-blue-500 text-base font-bold`}>
          {interval.duration}
        </Text>
      </View>

      {/* Пятая строка: Кнопки действий */}
      <View style={tw`flex-row justify-between items-center`}>
        {/* Кнопка удаления (всегда видна) */}
        <TouchableOpacity
          style={tw`bg-red-500 p-2 rounded-lg min-w-10 items-center`}
          onPress={handleDelete}
        >
          <Text style={tw`text-white text-sm`}>🗑️</Text>
        </TouchableOpacity>

        {/* Кнопки сохранения/отмены (только при изменениях) */}
        {isChanged && (
          <View style={tw`flex-row gap-1`}>
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

      <CategorySelector
        onCategoryChange={handleChangeCategory}
        setIsOpen={setIsSelectOpen}
        isOpen={isSelectOpen}
      />

      {/* Модалка для выбора времени */}
      <TimePickerModal
        isOpen={timePickerOpen}
        onClose={handleTimePickerClose}
        onTimeSelect={handleTimeSelect}
        initialTime={currentTime}
      />

      {/* DatePicker */}
      {showDatePicker && (
        Platform.OS === 'ios' ? (
          <Modal
            visible={showDatePicker}
            transparent={true}
            animationType="slide"
          >
            <View style={tw`flex-1 justify-end bg-black/50`}>
              <View style={tw`bg-white rounded-t-3xl p-6`}>
                <View style={tw`flex-row justify-between items-center mb-4`}>
                  <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                    <Text style={tw`text-red-500 text-lg font-semibold`}>Отмена</Text>
                  </TouchableOpacity>
                  <Text style={tw`text-lg font-bold text-gray-800`}>Выберите дату</Text>
                  <TouchableOpacity onPress={handleDateConfirm}>
                    <Text style={tw`text-green-500 text-lg font-semibold`}>✓</Text>
                  </TouchableOpacity>
                </View>
                <DateTimePicker
                  value={selectedDate}
                  mode="date"
                  display="spinner"
                  onChange={handleDateChange}
                  locale="ru-RU"
                />
              </View>
            </View>
          </Modal>
        ) : (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )
      )}
    </View>
  );
};

export default IntervalItem;