import { Text, View } from 'react-native';
import { secondsToTimeString } from '../../IntervalList/timeHelpers';
import tw from 'twrnc';
import { FilterAnalysis, FilteredIntervals } from '../AnalysisBody';

type StatisticsProps = {
  filteredAnalysis: FilterAnalysis;
  categoryColors: Map<string, string>
  filteredIntervals: FilteredIntervals
  selectedCategories: Set<string>
};

export const Statistics = ({ 
  filteredAnalysis,
  categoryColors,
  filteredIntervals,
  selectedCategories
}: StatisticsProps) => {

  const totalFilteredIntervals =
    filteredAnalysis.length > 0
      ? filteredIntervals.filter(
          interval =>
            selectedCategories.size === 0 ||
            selectedCategories.has(interval.category || 'Без категории'),
        ).length
      : 0;

  if (filteredAnalysis.length > 0)
    return (
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
    );
};
