import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import tw from 'twrnc';
import IntervalList from '../modules/IntervalList/IntervalList';
import { useGetIntervalIdsQuery } from '../modules/IntervalList/slices/interval/intervalsApi';

const Interval = () => {
  const { data: intervalIds = [] } = useGetIntervalIdsQuery();
  const intervalsLength = intervalIds.length;

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-100`}>
      
      <StatusBar barStyle="dark-content" />
      
      <View style={tw`bg-white px-5 pt-2.5 pb-5 border-b border-gray-300`}>
        <View style={tw`mt-2 pt-2 border-gray-200`}>
          <Text style={tw`text-xs text-gray-500`}>
            Всего интервалов: {intervalsLength}
          </Text>
        </View>
      </View>

      <View style={tw`flex-1`}><IntervalList/></View>

    </SafeAreaView>
  );
};

export default Interval;