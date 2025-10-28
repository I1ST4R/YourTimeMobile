import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
} from 'react-native';
import tw from 'twrnc';

import { FormIntervalType } from '../../shared/storage';
import { useSelector } from 'react-redux';
import {
  closeForm,
  selectCurrentInterval,
  selectFormType,
  selectIsOpen,
} from './form.slice';
import { useAppDispatch } from '../../app/store';
import {
  addInterval,
  deleteInterval,
  updateInterval,
} from '../IntervalList/interval.slice';
import { calculateDuration, getCurrentDate } from '../IntervalList/timeHelpers';
import DateTimePicker from '@react-native-community/datetimepicker';

const IntervalForm = () => {
  const dispatch = useAppDispatch();
  const [name, setName] = useState<string>('');
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date>(getCurrentDate());
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);

  const curInterval = useSelector(selectCurrentInterval);
  const isOpen = useSelector(selectIsOpen);
  const formType = useSelector(selectFormType);

  useEffect(() => {
    if (curInterval) {
      setName(curInterval.name || '');
      setStartTime(curInterval.startTime || '');
      setEndTime(curInterval.endTime || '');
      setCategory(curInterval.category || '');
      setSelectedDate(curInterval.date);
    } else {
      resetForm();
    }
  }, [curInterval]);

  const resetForm = (): void => {
    setName('');
    setStartTime('');
    setEndTime('');
    setCategory('');
    setSelectedDate(new Date());
  };

  const handleDateChange = (event: any, date?: Date): void => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleSave = (): void => {
    const [duration, isDifDays] = calculateDuration(
      startTime,
      endTime,
    );

    const intervalData: FormIntervalType = {
      name: name.trim(),
      startTime,
      date: selectedDate,
      duration,
      isDifDays,
      endTime,
      category,
    };

    switch (formType) {
      case 'delete':
        dispatch(deleteInterval(curInterval?.id ?? ''));
        break;
      case 'create':
        dispatch(addInterval(intervalData));
        break;
      case 'update':
        dispatch(
          updateInterval({ id: curInterval?.id ?? '', interval: intervalData }),
        );
        break;
    }
    resetForm();
    dispatch(closeForm());
  };

  const handleCancel = (): void => {
    resetForm();
    dispatch(closeForm());
  };

  const showDatepicker = (): void => {
    setShowDatePicker(true);
  };

  return (
    <Modal
      visible={isOpen}
      animationType="slide"
      transparent={true}
      onRequestClose={handleCancel}
    >
      <View style={tw`flex-1 justify-center items-center bg-black/50`}>
        <View style={tw`bg-white p-5 rounded-xl w-11/12 max-w-100`}>
          <Text style={tw`text-lg font-bold mb-5 text-center`}>
            {formType === 'update'
              ? 'Редактировать интервал'
              : 'Добавить интервал'}
          </Text>

          <TextInput
            style={tw`border border-gray-300 rounded p-2.5 mb-3.5 text-base`}
            placeholder="Название"
            placeholderTextColor="#666"
            value={name}
            onChangeText={setName}
          />

          {/* Поле выбора даты */}
          <TouchableOpacity 
            style={tw`border border-gray-300 rounded p-2.5 mb-3.5 bg-gray-50`}
            onPress={showDatepicker}
          >
            <Text style={tw`text-base text-gray-800`}>
              Дата: {selectedDate.toLocaleDateString('ru-RU')}
            </Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}

          <TextInput
            style={tw`border border-gray-300 rounded p-2.5 mb-3.5 text-base`}
            placeholder="Начало"
            placeholderTextColor="#666"
            value={startTime}
            onChangeText={setStartTime}
          />

          <TextInput
            style={tw`border border-gray-300 rounded p-2.5 mb-3.5 text-base`}
            placeholder="Конец"
            placeholderTextColor="#666"
            value={endTime}
            onChangeText={setEndTime}
          />

          <TextInput
            style={tw`border border-gray-300 rounded p-2.5 mb-3.5 text-base`}
            placeholder="Категория"
            placeholderTextColor="#666"
            value={category}
            onChangeText={setCategory}
          />

          <View style={tw`flex-row justify-between mt-2.5`}>
            <TouchableOpacity
              style={tw`bg-gray-500 p-3 rounded min-w-25 items-center`}
              onPress={handleCancel}
            >
              <Text style={tw`text-white font-bold`}>Отмена</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={tw`bg-blue-500 p-3 rounded min-w-25 items-center`}
              onPress={handleSave}
            >
              <Text style={tw`text-white font-bold`}>Сохранить</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default IntervalForm;