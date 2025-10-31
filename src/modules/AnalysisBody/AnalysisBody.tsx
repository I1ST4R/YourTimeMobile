// screens/Analysis.tsx
import React, { useState } from 'react';
import { View, Dimensions, Text, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { useFocusEffect } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import tw from 'twrnc';
import {
  analyzeIntervalsByCategory,
  generateCategoryColors,
  secondsToTimeString,
  dateToString,
} from '../IntervalList/timeHelpers';
import { useGetAllIntervalsQuery } from './intervalsAnalysisApi';
import { IntervalType } from '../IntervalList/slices/interval/intervalStorage';

type ChartData = {
  name: string;
  time: number;
  color: string;
  legendFontColor: string;
  legendFontSize: number;
};

const AnalysisBody = () => {
  const screenWidth = Dimensions.get('window').width;
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const {
    data: intervals = [],
    isLoading,
    error,
    refetch,
  } = useGetAllIntervalsQuery();

  // Рефетчим данные при фокусе на странице
  useFocusEffect(
    React.useCallback(() => {
      refetch();
    }, [refetch]),
  );

  // Фильтруем интервалы по выбранному периоду
  const filterIntervalsByDate = (intervals: IntervalType[], start: Date, end: Date): IntervalType[] => {
    const startStr = dateToString(start);
    const endStr = dateToString(end);
    
    return intervals.filter(interval => {
      const intervalDate = interval.date; // предполагаем что date в формате "YYYY-MM-DD"
      return intervalDate >= startStr && intervalDate <= endStr;
    });
  };

  // Анализируем интервалы с учетом фильтрации по дате
  const filteredIntervals = filterIntervalsByDate(intervals, startDate, endDate);
  const categoryAnalysis = analyzeIntervalsByCategory(filteredIntervals);

  // Генерируем цвета для категорий
  const categoryColors = generateCategoryColors(
    categoryAnalysis.map(item => item.category),
  );

  // Фильтруем данные по выбранным категориям
  const filteredAnalysis = selectedCategories.size > 0
    ? categoryAnalysis.filter(item => selectedCategories.has(item.category || 'Без категории'))
    : categoryAnalysis;

  // Подсчитываем общее количество интервалов в отфильтрованных данных
  const totalFilteredIntervals = filteredAnalysis.length > 0 
    ? filteredIntervals.filter(interval => 
        selectedCategories.size === 0 || 
        selectedCategories.has(interval.category || 'Без категории')
      ).length
    : 0;

  // Преобразуем данные для диаграммы
  const chartData: ChartData[] = filteredAnalysis.map(item => ({
    name: item.category || 'Без категории',
    time: item.totalSeconds,
    color: categoryColors.get(item.category) || '#CCCCCC',
    legendFontColor: '#7F7F7F',
    legendFontSize: 16,
  }));

  // Обработчики для DatePicker
  const onStartDateChange = (event: any, selectedDate?: Date) => {
    setShowStartPicker(false);
    if (selectedDate) {
      setStartDate(selectedDate);
      // Если начальная дата позже конечной, обновляем конечную дату
      if (selectedDate > endDate) {
        setEndDate(selectedDate);
      }
    }
  };

  const onEndDateChange = (event: any, selectedDate?: Date) => {
    setShowEndPicker(false);
    if (selectedDate) {
      // Не позволяем установить конечную дату раньше начальной
      if (selectedDate >= startDate) {
        setEndDate(selectedDate);
      }
    }
  };

  // Переключение выбора категории
  const toggleCategory = (category: string) => {
    const newSelected = new Set(selectedCategories);
    if (newSelected.has(category)) {
      newSelected.delete(category);
    } else {
      newSelected.add(category);
    }
    setSelectedCategories(newSelected);
  };

  // Выбрать все категории
  const selectAllCategories = () => {
    const allCategories = new Set(categoryAnalysis.map(item => item.category || 'Без категории'));
    setSelectedCategories(allCategories);
  };

  // Очистить выбор
  const clearSelection = () => {
    setSelectedCategories(new Set());
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
    start.setDate(end.getDate() - 6); // 7 дней включая сегодня
    setStartDate(start);
    setEndDate(end);
  };

  // Установить период "Месяц"
  const setMonthPeriod = () => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 29); // 30 дней включая сегодня
    setStartDate(start);
    setEndDate(end);
  };

  // Форматирование даты для отображения
  const formatDisplayDate = (date: Date) => {
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Если загрузка
  if (isLoading) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <Text style={tw`text-gray-600 text-lg`}>Загрузка данных...</Text>
      </View>
    );
  }

  // Если ошибка
  if (error) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <Text style={tw`text-red-500 text-lg`}>Ошибка загрузки данных</Text>
      </View>
    );
  }

  // Если нет данных
  if (intervals.length === 0) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <Text style={tw`text-gray-600 text-lg`}>Нет данных для анализа</Text>
        <Text style={tw`text-gray-500 text-center mt-2`}>
          Добавьте интервалы на главной странице
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={tw`flex-1 bg-gray-100`}>
      <Text style={tw`text-2xl font-bold text-center my-4 text-gray-800`}>
        Анализ по категориям
      </Text>

      {/* Выбор периода */}
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
          <TouchableOpacity
            style={tw`px-3 py-2 bg-purple-100 rounded-lg border border-purple-300`}
            onPress={setMonthPeriod}
          >
            <Text style={tw`text-purple-700 font-medium text-sm`}>Месяц</Text>
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

        {/* Статистика периода */}
        <Text style={tw`text-sm text-gray-600 mt-3`}>
          Показано интервалов: {filteredIntervals.length} из {intervals.length}
        </Text>
      </View>

      {/* Выбор категорий */}
      <View style={tw`bg-white mx-4 rounded-xl p-4 shadow-lg mb-4`}>
        <Text style={tw`text-lg font-semibold mb-3 text-gray-800`}>
          Выберите категории для анализа:
        </Text>
        
        {/* Кнопки управления */}
        <View style={tw`flex-row justify-between mb-3`}>
          <TouchableOpacity
            style={tw`px-4 py-2 bg-blue-500 rounded-lg`}
            onPress={selectAllCategories}
          >
            <Text style={tw`text-white font-medium`}>Выбрать все</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={tw`px-4 py-2 bg-gray-300 rounded-lg`}
            onPress={clearSelection}
          >
            <Text style={tw`text-gray-700 font-medium`}>Очистить</Text>
          </TouchableOpacity>
        </View>

        {/* Список категорий для выбора */}
        <View style={tw`flex-row flex-wrap`}>
          {categoryAnalysis.map((item, index) => {
            const categoryName = item.category || 'Без категории';
            const isSelected = selectedCategories.has(categoryName);
            
            return (
              <TouchableOpacity
                key={index}
                style={[
                  tw`flex-row items-center px-3 py-2 m-1 rounded-lg border`,
                  isSelected ? tw`bg-blue-100 border-blue-500` : tw`bg-gray-100 border-gray-300`
                ]}
                onPress={() => toggleCategory(categoryName)}
              >
                <View
                  style={[
                    tw`w-3 h-3 rounded-full mr-2`,
                    { backgroundColor: categoryColors.get(item.category) },
                  ]}
                />
                <Text style={isSelected ? tw`text-blue-700 font-medium` : tw`text-gray-700`}>
                  {categoryName}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Статус выбора */}
        <Text style={tw`text-sm text-gray-600 mt-3`}>
          {selectedCategories.size === 0 
            ? 'Выбраны все категории' 
            : `Выбрано категорий: ${selectedCategories.size} из ${categoryAnalysis.length}`
          }
        </Text>
      </View>

      {/* Круговая диаграмма */}
      {filteredAnalysis.length > 0 ? (
        <View style={tw`pl-15 mx-4`}>
          <PieChart
            data={chartData}
            width={screenWidth + 60}
            height={280}
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 0,
              color: () => `rgba(0, 0, 0, 1)`,
              style: {
                borderRadius: 16,
              },
            }}
            accessor="time"
            backgroundColor="transparent"
            paddingLeft="0"
            hasLegend={false}
          />
        </View>
      ) : (
        <View style={tw`bg-white mx-4 rounded-xl p-8 shadow-lg items-center`}>
          <Text style={tw`text-gray-500 text-lg text-center`}>
            Нет данных для выбранного периода и категорий
          </Text>
        </View>
      )}

      {/* Детальная статистика */}
      {filteredAnalysis.length > 0 && (
        <View style={tw`bg-white m-4 rounded-xl p-4 shadow-lg`}>
          <Text style={tw`text-lg font-semibold mb-3 text-gray-800`}>
            Детализация по категориям:
          </Text>
          {filteredAnalysis.map((item, index) => (
            <View
              key={index}
              style={tw`flex-row items-center py-2 border-b border-gray-200`}
            >
              <View
                style={[
                  tw`w-3 h-3 rounded-full mr-2`,
                  { backgroundColor: categoryColors.get(item.category) },
                ]}
              />
              <Text style={tw`flex-1 text-base text-gray-800`}>
                {item.category || 'Без категории'}
              </Text>
              <Text style={tw`text-base font-medium text-gray-600`}>
                {item.formattedTime}
              </Text>
            </View>
          ))}

          {/* Общая статистика */}
          <View style={tw`mt-4 pt-4 border-t border-gray-300`}>
            <Text style={tw`text-base font-semibold text-gray-800 my-1`}>
              Всего интервалов: {totalFilteredIntervals}
            </Text>
            <Text style={tw`text-base font-semibold text-gray-800 my-1`}>
              Общее время:{' '}
              {secondsToTimeString(
                filteredAnalysis.reduce(
                  (total, item) => total + item.totalSeconds,
                  0,
                ),
              )}
            </Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

export default AnalysisBody;