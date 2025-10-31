// screens/Analysis.tsx
import React, { useState } from 'react';
import {
  View,
  Dimensions,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useFocusEffect } from '@react-navigation/native';
import tw from 'twrnc';

import {
  analyzeIntervalsByCategory,
  generateCategoryColors,
  dateToString,
  timeStringToSeconds,
} from '../IntervalList/timeHelpers';
import { useGetAllIntervalsQuery } from './intervalsAnalysisApi';
import { IntervalType } from '../IntervalList/slices/interval/intervalStorage';
import { PeriodPicker } from './components/PeriodPicker';
import { CategoryPicker as CategorySelect } from './components/CategoryPicker';
import { CircleDiagram } from './components/CircleDiagram';
import { ModeSwitcher } from './components/ModeSwitcher';
import { Statistics } from './components/Statistics';

export type ChartConfig = {
  backgroundColor: string;
  backgroundGradientFrom: string;
  backgroundGradientTo: string;
  decimalPlaces: number;
  color: (opacity?: number) => string;
  style: {
    borderRadius: number;
  };
  propsForLabels: {
    fontSize: number;
  };
};

export type FilterAnalysis = Array<{
  category: string;
  totalSeconds: number;
  formattedTime: string;
}>;

export type FilteredIntervals = Array<{
  category: string;
  name: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: string;
  isDifDays: boolean;
}>

const AnalysisBody = () => {
  const screenWidth = Dimensions.get('window').width;
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
  const [selectedSingleCategory, setSelectedSingleCategory] = useState<string>('');
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [analysisMode, setAnalysisMode] = useState<'category' | 'single'>('category');
  const {data: intervals = [], isLoading, error, refetch } = useGetAllIntervalsQuery();

  useFocusEffect(
    React.useCallback(() => {
      refetch();
    }, [refetch]),
  );

  const filterIntervalsByDate = (
    intervals: IntervalType[],
    start: Date,
    end: Date,
  ): IntervalType[] => {
    const startStr = dateToString(start);
    const endStr = dateToString(end);

    return intervals.filter(interval => {
      const intervalDate = interval.date;
      return intervalDate >= startStr && intervalDate <= endStr;
    });
  };

  const filteredIntervals : FilteredIntervals = filterIntervalsByDate(
    intervals,
    startDate,
    endDate,
  );
  const categoryAnalysis = analyzeIntervalsByCategory(filteredIntervals);

  const analyzeSingleCategoryByDate = (category: string) => {
    const categoryIntervals = filteredIntervals.filter(
      interval =>
        interval.category === category ||
        (category === 'Без категории' && !interval.category),
    );

    const dateMap = new Map<string, number>();

    categoryIntervals.forEach(interval => {
      const durationSeconds = timeStringToSeconds(interval.duration);
      const currentTotal = dateMap.get(interval.date) || 0;
      dateMap.set(interval.date, currentTotal + durationSeconds);
    });

    const sortedDates = Array.from(dateMap.keys()).sort();

    return {
      labels: sortedDates.map(date => {
        const dateObj = new Date(date + 'T00:00:00');
        return dateObj.toLocaleDateString('ru-RU', {
          day: '2-digit',
          month: '2-digit',
        });
      }),
      datasets: [
        {
          data: sortedDates.map(date => dateMap.get(date) || 0),
        },
      ],
      rawDates: sortedDates,
    };
  };

  const categoryColors = generateCategoryColors(
    categoryAnalysis.map(item => item.category),
  );

  const filteredAnalysis : FilterAnalysis=
    selectedCategories.size > 0
      ? categoryAnalysis.filter(item =>
          selectedCategories.has(item.category || 'Без категории'),
        )
      : categoryAnalysis;

  const lineChartData = selectedSingleCategory
    ? analyzeSingleCategoryByDate(selectedSingleCategory)
    : { labels: [], datasets: [{ data: [] }], rawDates: [] };

  const selectSingleCategory = (category: string) => {
    setSelectedSingleCategory(category);
  };

  const chartConfig: ChartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForLabels: {
      fontSize: 10,
    },
  };

  if (isLoading) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <Text style={tw`text-gray-600 text-lg`}>Загрузка данных...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <Text style={tw`text-red-500 text-lg`}>Ошибка загрузки данных</Text>
      </View>
    );
  }

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
      <ModeSwitcher
        analysisMode={analysisMode}
        setAnalysisMode={setAnalysisMode}
      />
      <PeriodPicker
        setStartDate={setStartDate}
        startDate={startDate}
        setEndDate={setEndDate}
        endDate={endDate}
      />
      {analysisMode === 'category' && (
        <>
          <CategorySelect
            setSelectedCategories={setSelectedCategories}
            selectedCategories={selectedCategories}
            categoryAnalysis={categoryAnalysis}
            categoryColors={categoryColors}
          />
          <CircleDiagram
            filteredAnalysis={filteredAnalysis}
            categoryColors={categoryColors}
            chartConfig={chartConfig}
          />
          <Statistics 
            filteredAnalysis={filteredAnalysis}
            categoryColors={categoryColors}
            filteredIntervals={filteredIntervals}
            selectedCategories={selectedCategories}
          />
        </>
      )}
      {analysisMode === 'single' && (
        <>
          {/* Выбор одной категории */}
          <View style={tw`bg-white mx-4 rounded-xl p-4 shadow-lg mb-4`}>
            <Text style={tw`text-lg font-semibold mb-3 text-gray-800`}>
              Выберите категорию для детального анализа:
            </Text>

            {/* Список категорий для выбора */}
            <View style={tw`flex-row flex-wrap`}>
              {categoryAnalysis.map((item, index) => {
                const categoryName = item.category || 'Без категории';
                const isSelected = selectedSingleCategory === categoryName;

                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      tw`flex-row items-center px-3 py-2 m-1 rounded-lg border`,
                      isSelected
                        ? tw`bg-blue-100 border-blue-500`
                        : tw`bg-gray-100 border-gray-300`,
                    ]}
                    onPress={() => selectSingleCategory(categoryName)}
                  >
                    <View
                      style={[
                        tw`w-3 h-3 rounded-full mr-2`,
                        { backgroundColor: categoryColors.get(item.category) },
                      ]}
                    />
                    <Text
                      style={
                        isSelected
                          ? tw`text-blue-700 font-medium`
                          : tw`text-gray-700`
                      }
                    >
                      {categoryName}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {selectedSingleCategory && (
              <Text style={tw`text-sm text-gray-600 mt-3`}>
                Выбрана категория:{' '}
                <Text style={tw`font-semibold`}>{selectedSingleCategory}</Text>
              </Text>
            )}
          </View>

          {/* Линейный график */}
          {selectedSingleCategory && lineChartData.labels.length > 0 ? (
            <View style={tw`bg-white mx-4 rounded-xl p-4 shadow-lg mb-4`}>
              <Text
                style={tw`text-lg font-semibold mb-3 text-gray-800 text-center`}
              >
                {selectedSingleCategory} - динамика по дням
              </Text>
              <LineChart
                data={lineChartData}
                width={screenWidth - 40}
                height={220}
                chartConfig={{
                  ...chartConfig,
                  color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
                }}
                bezier
                style={{
                  marginVertical: 8,
                  borderRadius: 16,
                }}
                verticalLabelRotation={30}
                formatYLabel={value => {
                  const seconds = parseInt(value);
                  const hours = Math.floor(seconds / 3600);
                  const minutes = Math.floor((seconds % 3600) / 60);
                  return hours > 0 ? `${hours}ч` : `${minutes}м`;
                }}
              />
            </View>
          ) : selectedSingleCategory ? (
            <View
              style={tw`bg-white mx-4 rounded-xl p-8 shadow-lg items-center`}
            >
              <Text style={tw`text-gray-500 text-lg text-center`}>
                Нет данных для категории "{selectedSingleCategory}" в выбранном
                периоде
              </Text>
            </View>
          ) : (
            <View
              style={tw`bg-white mx-4 rounded-xl p-8 shadow-lg items-center`}
            >
              <Text style={tw`text-gray-500 text-lg text-center`}>
                Выберите категорию для просмотра графика
              </Text>
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
};

export default AnalysisBody;
