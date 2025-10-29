import React, { useEffect } from 'react';
import { View } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { baseIntervalSchema, FormIntervalType, StoreIntervalType } from './slices/interval/intervalStorage';
import { calculateDuration } from './timeHelpers';
import { NameField } from './components/NameField';
import { CategoryField } from './components/CategoryField';
import { TimeField } from './components/TimeField';
import { DateDurationField } from './components/DateDurationField';
import { Buttons } from './components/Buttons';
import tw from 'twrnc';

type IntervalItemProps = {
  interval: StoreIntervalType;
};

const IntervalItem = ({ interval }: IntervalItemProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, ...intervalWithoutId } = interval;
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
    defaultValues: {...intervalWithoutId},
    mode: 'onChange'
  });
  const watchStartTime = watch('startTime');
  const watchEndTime = watch('endTime');

  useEffect(() => {
    const [duration, isDifDays] = calculateDuration(watchStartTime, watchEndTime);
    setValue('duration', duration, { shouldValidate: true });
    setValue('isDifDays', isDifDays, { shouldValidate: true });
  }, [watchStartTime, watchEndTime, setValue]);

  return (
    <View style={tw`bg-white p-3 my-1 mx-2 rounded-lg shadow-md shadow-black/10 elevation-2`}>
      <NameField control={control} errors={errors}/>
      <CategoryField watch={watch} errors={errors} setValue={setValue} trigger={trigger}/>
      <TimeField errors={errors} watch={watch} setValue={setValue} trigger={trigger}/>
      <DateDurationField errors={errors} watch={watch} setValue={setValue} trigger={trigger}/>
      <Buttons isDirty={isDirty} reset={reset} handleSubmit={handleSubmit} interval={interval}/>
    </View>
  );
};

export default IntervalItem;