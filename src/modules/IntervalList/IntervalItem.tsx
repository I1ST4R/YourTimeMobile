import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, Platform, Modal } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import DateTimePicker from '@react-native-community/datetimepicker';
import tw from 'twrnc';

import { useAppDispatch } from '../../app/store';
import {
  deleteInterval,
  updateInterval,
} from './interval/interval.slice';
import { baseIntervalSchema, FormIntervalType, StoreIntervalType } from './interval/intervalStorage';
import { calculateDuration, dateToString, stringToDate } from './timeHelpers';
import { CategorySelector } from '../CategorySelector/CategorySelector';
import { NameField } from './components/NameField';
import { CategoryField } from './components/CategoryField';
import { TimeField } from './components/TimeField';

type IntervalItemProps = {
  interval: StoreIntervalType;
};

const IntervalItem = ({ interval }: IntervalItemProps) => {
  const dispatch = useAppDispatch();
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  
  const [showDatePicker, setShowDatePicker] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
    setValue,
    watch,
    reset,
    trigger
  } = useForm<FormIntervalType>({
    resolver: zodResolver(baseIntervalSchema),
    defaultValues: {
      name: interval.name,
      date: interval.date,
      startTime: interval.startTime,
      endTime: interval.endTime,
      duration: interval.duration,
      isDifDays: interval.isDifDays,
      category: interval.category,
    },
    mode: 'onChange'
  });

  const watchStartTime = watch('startTime');
  const watchEndTime = watch('endTime');

  useEffect(() => {
    const [duration, isDifDays] = calculateDuration(watchStartTime, watchEndTime);
    setValue('duration', duration, { shouldValidate: true });
    setValue('isDifDays', isDifDays, { shouldValidate: true });
  }, [watchStartTime, watchEndTime, setValue]);

  const openDatePicker = () => {
    setShowDatePicker(true);
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }

    if (selectedDate) {
      const newDateString = dateToString(selectedDate);
      setValue('date', newDateString, { shouldValidate: true });
      trigger('date');
      
      if (Platform.OS === 'android') {
        setShowDatePicker(false);
      }
    }
  };

  const handleDateConfirm = () => {
    const selectedDate = stringToDate(watch('date'));
    const newDateString = dateToString(selectedDate);
    setValue('date', newDateString, { shouldValidate: true });
    trigger('date');
    setShowDatePicker(false);
  };

  const formatDateForDisplay = (dateString: string) => {
    const date = stringToDate(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleSave = (data: FormIntervalType) => {
    const [duration, isDifDays] = calculateDuration(data.startTime, data.endTime);

    const intervalData = {
      name: data.name.trim(),
      startTime: data.startTime,
      endTime: data.endTime,
      date: data.date,
      duration,
      isDifDays,
      category: data.category,
    };

    dispatch(
      updateInterval({
        id: interval.id,
        interval: intervalData,
      }),
    );
    reset(data);
  };

  const handleCancel = () => {
    reset({
      name: interval.name,
      date: interval.date,
      startTime: interval.startTime,
      endTime: interval.endTime,
      duration: interval.duration,
      isDifDays: interval.isDifDays,
      category: interval.category,
    });
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

  const handleChangeCategory = (value: string) => {
    setValue('category', value, { shouldValidate: true });
    trigger('category');
  };

  const selectedDate = stringToDate(watch('date'));

  return (
    <View
      style={tw`bg-white p-3 my-1 mx-2 rounded-lg shadow-md shadow-black/10 elevation-2`}
    >
      <NameField control={control} errors={errors}/>

      <CategoryField watch={watch} errors={errors} setIsSelectOpen={setIsSelectOpen}/>

      <TimeField errors={errors} watch={watch} setValue={setValue} trigger={trigger}/>

      <View style={tw`flex-row justify-between items-center mb-2`}>
        <View>
          <TouchableOpacity
            style={[
              tw`bg-gray-100 rounded-lg px-3 py-2 min-w-20 items-center`,
              errors.date && tw`border border-red-500`
            ]}
            onPress={openDatePicker}
          >
            <Text style={tw`text-sm text-gray-800 font-medium`}>
              {formatDateForDisplay(watch('date'))}
            </Text>
          </TouchableOpacity>
          {errors.date && (
            <Text style={tw`text-red-500 text-xs mt-1 text-center`}>
              {errors.date.message}
            </Text>
          )}
        </View>

        <Text style={tw`text-blue-500 text-base font-bold`}>
          {watch('duration')}
        </Text>
      </View>

      <View style={tw`flex-row justify-between items-center`}>
        <TouchableOpacity
          style={tw`bg-red-500 p-2 rounded-lg min-w-10 items-center`}
          onPress={handleDelete}
        >
          <Text style={tw`text-white text-sm`}>🗑️</Text>
        </TouchableOpacity>

        {isDirty && (
          <View style={tw`flex-row gap-1`}>
            <TouchableOpacity
              style={tw`bg-gray-500 p-2 rounded-lg min-w-10 items-center`}
              onPress={handleCancel}
            >
              <Text style={tw`text-white text-sm`}>❌</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={tw`bg-green-500 p-2 rounded-lg min-w-10 items-center`}
              onPress={handleSubmit(handleSave)}
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