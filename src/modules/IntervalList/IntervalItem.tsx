import React, { useEffect } from 'react';
import { View, Alert, Text, TouchableOpacity } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  baseIntervalSchema,
  FormIntervalType,
  StoreIntervalType,
} from './slices/interval/intervalStorage';
import { calculateDuration } from './timeHelpers';
import { NameField } from './components/NameField';
import { CategoryField } from './components/CategoryField';
import { TimeField } from './components/TimeField';
import { DateDurationField } from './components/DateDurationField';
import tw from 'twrnc';
import { useSelector } from 'react-redux';
import { selectTimer } from './slices/timer/timer.slice';
import { RootState, useAppDispatch } from '../../app/store';
import { deleteInterval, updateInterval } from './slices/interval/interval.slice';

type IntervalItemProps = {
  interval: StoreIntervalType;
};

const IntervalItem = ({ interval }: IntervalItemProps) => {
  const dispatch = useAppDispatch();
  const timer = useSelector((state: RootState) => selectTimer(state)(interval.id));
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, ...intervalWithoutId } = interval;

  const {
    control,
    formState: { errors, isDirty },
    setValue,
    watch,
    trigger,
  } = useForm<FormIntervalType>({
    resolver: zodResolver(baseIntervalSchema),
    defaultValues: { ...intervalWithoutId },
    mode: 'onChange',
  });

  const watchAll = watch();

  // Функция для удаления интервала
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

  // Автосохранение при изменении любого поля
  useEffect(() => {
    if (!isDirty) return;

    const [duration, isDifDays] = calculateDuration(watchAll.startTime, watchAll.endTime);

    const intervalData = {
      name: watchAll.name?.trim() || '',
      startTime: watchAll.startTime,
      endTime: watchAll.endTime,
      date: watchAll.date,
      duration,
      isDifDays,
      category: watchAll.category,
    };

    dispatch(updateInterval({
      id: interval.id,
      interval: intervalData,
    }));
  }, [watchAll, isDirty, dispatch, interval.id]);

  // Обновление duration и isDifDays при изменении времени
  useEffect(() => {
    const isTimerActive = Boolean(timer);
    if (isTimerActive) return;

    const [duration, isDifDays] = calculateDuration(watchAll.startTime, watchAll.endTime);
    
    // Используем trigger для валидации после установки значений
    setValue('duration', duration, { shouldValidate: true });
    setValue('isDifDays', isDifDays, { shouldValidate: true });
    
    // Триггерим валидацию всех полей
    trigger();
  }, [watchAll.startTime, watchAll.endTime, setValue, trigger, timer]);

  return (
    <View style={tw`bg-white p-3 my-1 mx-2 rounded-lg shadow-md shadow-black/10 elevation-2`}>
      <NameField control={control} errors={errors} />
      <CategoryField watch={watch} errors={errors} setValue={setValue} trigger={trigger} />
      <TimeField
        errors={errors}
        watch={watch}
        setValue={setValue}
        trigger={trigger}
        timer={timer}
        intervalId={interval.id}
      />
      
      {/* Объединенная строка с DateDurationField и кнопкой удаления */}
      <View style={tw`flex-row items-center justify-between`}>
        <View style={tw`flex-1`}>
          <DateDurationField
            errors={errors}
            watch={watch}
            setValue={setValue}
            trigger={trigger}
            isTimerActive={Boolean(timer)}
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