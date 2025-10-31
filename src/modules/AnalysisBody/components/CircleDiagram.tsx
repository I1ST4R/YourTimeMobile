import { Text, View } from 'react-native';
import tw from 'twrnc';
import { PieChart } from 'react-native-chart-kit';
import { ChartConfig, FilterAnalysis } from '../AnalysisBody';

type ChartData = {
  name: string;
  time: number;
  color: string;
  legendFontColor: string;
  legendFontSize: number;
};

type CircleDiagramProps = {
  filteredAnalysis: FilterAnalysis
  categoryColors: Map<string, string>
  chartConfig: ChartConfig
}

export const CircleDiagram = ({
  filteredAnalysis,
  categoryColors,
  chartConfig
} : CircleDiagramProps) => {

  const chartData: ChartData[] = filteredAnalysis.map(item => ({
    name: item.category || 'Без категории',
    time: item.totalSeconds,
    color: categoryColors.get(item.category) || '#CCCCCC',
    legendFontColor: '#7F7F7F',
    legendFontSize: 16,
  }));

  if (filteredAnalysis.length === 0)
    return (
      <View style={tw`bg-white mx-4 rounded-xl p-8 shadow-lg items-center`}>
        <Text style={tw`text-gray-500 text-lg text-center`}>
          Нет данных для выбранного периода и категорий
        </Text>
      </View>
    );

  return (
    <View style={tw`pl-15 mx-4`}>
      <PieChart
        data={chartData}
        width={400}
        height={280}
        chartConfig={chartConfig}
        accessor="time"
        backgroundColor="transparent"
        paddingLeft="0"
        hasLegend={false}
      />
    </View>
  );
};
