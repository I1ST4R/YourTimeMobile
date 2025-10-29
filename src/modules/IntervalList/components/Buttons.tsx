import { Alert, Text, TouchableOpacity, View } from "react-native";
import tw from 'twrnc';
import { useAppDispatch } from "../../../app/store";
import { FormIntervalType, StoreIntervalType } from "../slices/interval/intervalStorage";
import { UseFormHandleSubmit, UseFormReset } from "react-hook-form";
import { deleteInterval, updateInterval } from "../slices/interval/interval.slice";
import { calculateDuration } from "../timeHelpers";

type ButtonsProps = {
  isDirty: boolean,
  reset: UseFormReset<FormIntervalType>
  handleSubmit: UseFormHandleSubmit<FormIntervalType>
  interval: StoreIntervalType
}

export const Buttons = ({
  isDirty,
  reset,
  handleSubmit,
  interval
}: ButtonsProps) => {
  const dispatch = useAppDispatch()

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

  return (
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
            onPress={() => reset(interval)}
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
  );
};
