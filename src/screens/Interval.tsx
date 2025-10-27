import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';

import IntervalForm from '../modules/IntervalForm/IntervalForm';
import { useAppDispatch } from '../app/store';
import { changeTypeOnCreate, openForm } from '../modules/IntervalForm/form.slice';
import { useSelector } from 'react-redux';
import { selectIntervalsCount } from '../modules/IntervalList/interval.slice';
import IntervalList from '../modules/IntervalList/IntervalList';

const Interval = () => {
  const dispatch = useAppDispatch()
  
  const intervalsLength = useSelector(selectIntervalsCount)

  const handleAddInterval = (): void => {
    dispatch(changeTypeOnCreate())
    dispatch(openForm())
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Тайм-трекер</Text>
        <Text style={styles.subtitle}>Управление временными интервалами</Text>
        
        <View style={styles.stats}>
          <Text style={styles.statsText}>
            Всего интервалов: {intervalsLength}
          </Text>
        </View>
      </View>

      <View style={styles.content}><IntervalList/></View>

      <TouchableOpacity
        style={styles.fab}
        onPress={handleAddInterval}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <IntervalForm/>
    </SafeAreaView>
  );
};

// Стили остаются без изменений
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: 'white',
    padding: 20,
    paddingTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  stats: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  statsText: {
    fontSize: 12,
    color: '#888',
  },
  content: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  fabText: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Interval;