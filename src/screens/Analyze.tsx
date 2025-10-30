// screens/Analyze.tsx
import React from 'react';
import { View, Dimensions, Text, ScrollView, StyleSheet } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { useSelector } from 'react-redux';

import { selectIntervals } from '../modules/IntervalList/slices/interval/interval.slice';
import { analyzeIntervalsByCategory, generateCategoryColors, secondsToTimeString } from '../modules/IntervalList/timeHelpers';

interface ChartData {
  name: string;
  time: number;
  color: string;
  legendFontColor: string;
  legendFontSize: number;
}

const Analyze = () => {
  const intervals = useSelector(selectIntervals);
  const screenWidth = Dimensions.get('window').width;

  // Анализируем интервалы
  const categoryAnalysis = analyzeIntervalsByCategory(intervals);
  
  // Генерируем цвета для категорий
  const categoryColors = generateCategoryColors(categoryAnalysis.map(item => item.category));

  // Преобразуем данные для диаграммы
  const chartData: ChartData[] = categoryAnalysis.map(item => ({
    name: item.category || 'Без категории',
    time: item.totalSeconds, // Используем секунды для диаграммы
    color: categoryColors.get(item.category) || '#CCCCCC',
    legendFontColor: '#7F7F7F',
    legendFontSize: 12
  }));

  // Если нет данных, показываем сообщение
  if (intervals.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.noDataText}>Нет данных для анализа</Text>
        <Text style={styles.noDataSubtext}>Добавьте интервалы на главной странице</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Анализ по категориям</Text>
      
      {/* Круговая диаграмма */}
      <View style={styles.chartContainer}>
        <PieChart
          data={chartData}
          width={screenWidth - 32}
          height={220}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
            },
          }}
          accessor="time"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      </View>

      {/* Детальная статистика */}
      <View style={styles.statsContainer}>
        <Text style={styles.statsTitle}>Детализация по категориям:</Text>
        {categoryAnalysis.map((item, index) => (
          <View key={index} style={styles.categoryItem}>
            <View style={[styles.colorDot, { backgroundColor: categoryColors.get(item.category) }]} />
            <Text style={styles.categoryName}>{item.category || 'Без категории'}</Text>
            <Text style={styles.categoryTime}>{item.formattedTime}</Text>
          </View>
        ))}
        
        {/* Общая статистика */}
        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>
            Всего интервалов: {intervals.length}
          </Text>
          <Text style={styles.totalText}>
            Общее время: {secondsToTimeString(
              categoryAnalysis.reduce((total, item) => total + item.totalSeconds, 0)
            )}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
    color: '#333',
  },
  chartContainer: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statsContainer: {
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  categoryName: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  categoryTime: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  totalContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  totalText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginVertical: 4,
  },
  noDataText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
    color: '#666',
  },
  noDataSubtext: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    color: '#999',
  },
});

export default Analyze;