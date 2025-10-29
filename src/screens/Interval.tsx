import {
  View,
  TouchableOpacity,
  Text,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import tw from 'twrnc';
import { useAppDispatch } from '../app/store';
import { changeTypeOnCreate, openForm } from '../modules/IntervalForm/form.slice';
import { useSelector } from 'react-redux';
import { selectIntervalsCount } from '../modules/IntervalList/slices/interval/interval.slice';
import IntervalList from '../modules/IntervalList/IntervalList';

const Interval = () => {
  const dispatch = useAppDispatch()
  
  const intervalsLength = useSelector(selectIntervalsCount)


  const handleAddInterval = (): void => {
    dispatch(changeTypeOnCreate())
    dispatch(openForm())
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-100`}>
      
      <StatusBar barStyle="dark-content" />
      
      <View style={tw`bg-white px-5 pt-2.5 pb-5 border-b border-gray-300`}>
        <Text style={tw`text-2xl font-bold text-gray-800`}>Тайм-трекер</Text>
        <Text style={tw`text-sm text-gray-600 mt-1`}>Управление временными интервалами</Text>
        <View style={tw`mt-2 pt-2 border-t border-gray-200`}>
          <Text style={tw`text-xs text-gray-500`}>
            Всего интервалов: {intervalsLength}
          </Text>
        </View>
      </View>

      <View style={tw`flex-1`}><IntervalList/></View>

      <TouchableOpacity
        style={tw`absolute right-5 bottom-5 w-14 h-14 rounded-full bg-blue-500 justify-center items-center shadow-lg shadow-black/25 elevation-4`}
        onPress={handleAddInterval}
      >
        <Text style={tw`text-2xl text-white font-bold`}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Interval;