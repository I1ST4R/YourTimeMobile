import { Platform, Text, TouchableOpacity, View } from "react-native";
import tw from 'twrnc';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from "react";

type PeriodPickerProps = {
  setStartDate: React.Dispatch<React.SetStateAction<Date>>
  startDate: Date
  setEndDate: React.Dispatch<React.SetStateAction<Date>>
  endDate: Date
}

export const PeriodPicker = ({
  setStartDate,
  startDate,
  setEndDate,
  endDate
} : PeriodPickerProps) => {
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const onStartDateChange = (event: any, selectedDate?: Date) => {
    setShowStartPicker(false);
    if (selectedDate) {
      setStartDate(selectedDate);
      if (selectedDate > endDate) {
        setEndDate(selectedDate);
      }
    }
  };

  const onEndDateChange = (event: any, selectedDate?: Date) => {
    setShowEndPicker(false);
    if (selectedDate) {
      if (selectedDate >= startDate) {
        setEndDate(selectedDate);
      }
    }
  };

  // Установить период "Сегодня"
  const setTodayPeriod = () => {
    const today = new Date();
    setStartDate(today);
    setEndDate(today);
  };

  // Установить период "Неделя"
  const setWeekPeriod = () => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 6);
    setStartDate(start);
    setEndDate(end);
  };

  const formatDisplayDate = (date: Date) => {
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <View style={tw`bg-white mx-4 rounded-xl p-4 shadow-lg mb-4`}>
      <Text style={tw`text-lg font-semibold mb-3 text-gray-800`}>
        Выберите период:
      </Text>

      {/* Быстрые кнопки периода */}
      <View style={tw`flex-row justify-between mb-4`}>
        <TouchableOpacity
          style={tw`px-3 py-2 bg-blue-100 rounded-lg border border-blue-300`}
          onPress={setTodayPeriod}
        >
          <Text style={tw`text-blue-700 font-medium text-sm`}>Сегодня</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={tw`px-3 py-2 bg-green-100 rounded-lg border border-green-300`}
          onPress={setWeekPeriod}
        >
          <Text style={tw`text-green-700 font-medium text-sm`}>Неделя</Text>
        </TouchableOpacity>
      </View>

      {/* Выбор дат */}
      <View style={tw`flex-row justify-between items-center`}>
        <View style={tw`flex-1 mr-2`}>
          <Text style={tw`text-sm text-gray-600 mb-1`}>С:</Text>
          <TouchableOpacity
            style={tw`border border-gray-300 rounded-lg p-3 bg-white`}
            onPress={() => setShowStartPicker(true)}
          >
            <Text style={tw`text-gray-800 text-center`}>
              {formatDisplayDate(startDate)}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={tw`flex-1 ml-2`}>
          <Text style={tw`text-sm text-gray-600 mb-1`}>По:</Text>
          <TouchableOpacity
            style={tw`border border-gray-300 rounded-lg p-3 bg-white`}
            onPress={() => setShowEndPicker(true)}
          >
            <Text style={tw`text-gray-800 text-center`}>
              {formatDisplayDate(endDate)}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Date Pickers */}
      {showStartPicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onStartDateChange}
          maximumDate={endDate}
        />
      )}

      {showEndPicker && (
        <DateTimePicker
          value={endDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onEndDateChange}
          minimumDate={startDate}
          maximumDate={new Date()}
        />
      )}
    </View>
  );
};
