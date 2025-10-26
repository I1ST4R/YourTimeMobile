import React, { useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';

import IntervalList from './components/IntervalList';
import IntervalForm from './components/IntervalForm';
import { TimeIntervalStorage, IntervalFormDataType, TimeIntervalType } from '../../app/storage';

// ДОБАВЬ ЭТУ ПРОВЕРКУ
console.log('TimeIntervalStorage imported:', TimeIntervalStorage);
console.log('All imports:', { TimeIntervalStorage });

interface TimeIntervalsPageProps {}

const Interval: React.FC<TimeIntervalsPageProps> = () => {
  const [intervals, setIntervals] = useState<TimeIntervalType[]>([]);
  const [isFormVisible, setIsFormVisible] = useState<boolean>(false);
  const [editingInterval, setEditingInterval] = useState<TimeIntervalType | null>(null);

  useEffect(() => {
    // ДОБАВЬ ЭТУ ПРОВЕРКУ
    console.log('In useEffect - TimeIntervalStorage:', TimeIntervalStorage);
    loadIntervals();
  }, []);

  const loadIntervals = (): void => {
    // ДОБАВЬ ЭТУ ПРОВЕРКУ
    console.log('In loadIntervals - TimeIntervalStorage:', TimeIntervalStorage);
    const loadedIntervals = TimeIntervalStorage.getAllIntervals();
    setIntervals(loadedIntervals);
  };

  const handleAddInterval = (): void => {
    setEditingInterval(null);
    setIsFormVisible(true);
  };

  const handleEditInterval = (interval: TimeIntervalType): void => {
    setEditingInterval(interval);
    setIsFormVisible(true);
  };

  const handleDeleteInterval = (id: string): void => {
    const success = TimeIntervalStorage.deleteInterval(id);
    if (success) {
      loadIntervals();
    }
  };

  const handleSaveInterval = (intervalData: IntervalFormDataType): void => {
    let success: boolean;
    
    if (editingInterval) {
      // Редактирование существующего интервала
      success = TimeIntervalStorage.updateInterval(editingInterval.id, intervalData);
    } else {
      // Добавление нового интервала
      success = TimeIntervalStorage.addInterval(intervalData);
    }

    if (success) {
      loadIntervals();
    }
  };

  const handleFormClose = (): void => {
    setIsFormVisible(false);
    setEditingInterval(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Тайм-трекер</Text>
        <Text style={styles.subtitle}>Управление временными интервалами</Text>
        
        <View style={styles.stats}>
          <Text style={styles.statsText}>
            Всего интервалов: {intervals.length}
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <IntervalList
          intervals={intervals}
          onEditInterval={handleEditInterval}
          onDeleteInterval={handleDeleteInterval}
        />
      </View>

      <TouchableOpacity
        style={styles.fab}
        onPress={handleAddInterval}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <IntervalForm
        visible={isFormVisible}
        onClose={handleFormClose}
        onSave={handleSaveInterval}
        editingInterval={editingInterval}
      />
    </SafeAreaView>
  );
};

export default Interval;

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