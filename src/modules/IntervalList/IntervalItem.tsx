import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppDispatch } from '../../app/store';
import { deleteInterval, updateInterval } from './interval/interval.slice';
import { baseIntervalSchema, FormIntervalType, StoreIntervalType } from './interval/intervalStorage';
import { calculateDuration } from './timeHelpers';
import { NameField } from './components/NameField';
import { CategoryField } from './components/CategoryField';
import { TimeField } from './components/TimeField';
import tw from 'twrnc';
import { DateDurationField } from './components/DateDurationField';

type IntervalItemProps = {
  interval: StoreIntervalType;
};

const IntervalItem = ({ interval }: IntervalItemProps) => {
  const dispatch = useAppDispatch();

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

  return (
    <View
      style={tw`bg-white p-3 my-1 mx-2 rounded-lg shadow-md shadow-black/10 elevation-2`}
    >
      <NameField control={control} errors={errors}/>
      <CategoryField watch={watch} errors={errors} setValue={setValue} trigger={trigger}/>
      <TimeField errors={errors} watch={watch} setValue={setValue} trigger={trigger}/>
      <DateDurationField errors={errors} watch={watch} setValue={setValue} trigger={trigger}/>
      

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

      
    </View>
  );
};

export default IntervalItem;