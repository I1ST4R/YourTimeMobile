// screens/Analysis.tsx
import React, { useState } from 'react';
import { View, Dimensions, Text, ScrollView, TouchableOpacity } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { useFocusEffect } from '@react-navigation/native';
import tw from 'twrnc';
import {
  analyzeIntervalsByCategory,
  generateCategoryColors,
  secondsToTimeString,
} from '../IntervalList/timeHelpers';
import { useGetAllIntervalsQuery } from './intervalsAnalysisApi';

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

  // Анализируем интервалы
  const categoryAnalysis = analyzeIntervalsByCategory(intervals);

  // Генерируем цвета для категорий
  const categoryColors = generateCategoryColors(
    categoryAnalysis.map(item => item.category),
  );

  // Фильтруем данные по выбранным категориям
  const filteredAnalysis = selectedCategories.size > 0
    ? categoryAnalysis.filter(item => selectedCategories.has(item.category || 'Без категории'))
    : categoryAnalysis;

  // Подсчитываем общее количество интервалов в отфильтрованных данных
  const totalFilteredIntervals = filteredAnalysis.reduce((total, item) => {
    // Находим соответствующий элемент в исходном анализе чтобы получить количество интервалов
    const originalItem = categoryAnalysis.find(origItem => 
      origItem.category === item.category
    );
    // Если у нас есть доступ к количеству интервалов, используем его, иначе считаем по времени
    return total + (originalItem ? (originalItem as any).count || 1 : 1);
  }, 0);

  // Преобразуем данные для диаграммы
  const chartData: ChartData[] = filteredAnalysis.map(item => ({
    name: item.category || 'Без категории',
    time: item.totalSeconds,
    color: categoryColors.get(item.category) || '#CCCCCC',
    legendFontColor: '#7F7F7F',
    legendFontSize: 16,
  }));

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

      {/* Детальная статистика */}
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
    </ScrollView>
  );
};

export default AnalysisBody;