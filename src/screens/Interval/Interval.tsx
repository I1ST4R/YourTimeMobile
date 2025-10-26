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

interface TimeIntervalsPageProps {}

const Interval: React.FC<TimeIntervalsPageProps> = () => {
  const [intervals, setIntervals] = useState<TimeIntervalType[]>([]);
  const [isFormVisible, setIsFormVisible] = useState<boolean>(false);
  const [editingInterval, setEditingInterval] = useState<TimeIntervalType | null>(null);

  useEffect(() => {
    loadIntervals();
  }, []);

  // ИЗМЕНИЛ - добавил async
  const loadIntervals = async (): Promise<void> => {
    try {
      const loadedIntervals = await TimeIntervalStorage.getAllIntervals();
      setIntervals(loadedIntervals);
    } catch (error) {
      console.error('Error loading intervals:', error);
    }
  };

  const handleAddInterval = (): void => {
    setEditingInterval(null);
    setIsFormVisible(true);
  };

  const handleEditInterval = (interval: TimeIntervalType): void => {
    setEditingInterval(interval);
    setIsFormVisible(true);
  };

  // ИЗМЕНИЛ - добавил async
  const handleDeleteInterval = async (id: string): Promise<void> => {
    try {
      const success = await TimeIntervalStorage.deleteInterval(id);
      if (success) {
        await loadIntervals(); // перезагружаем список
      }
    } catch (error) {
      console.error('Error deleting interval:', error);
    }
  };

  // ИЗМЕНИЛ - добавил async
  const handleSaveInterval = async (intervalData: IntervalFormDataType): Promise<void> => {
    try {
      let success: boolean;
      
      if (editingInterval) {
        // Редактирование существующего интервала
        success = await TimeIntervalStorage.updateInterval(editingInterval.id, intervalData);
      } else {
        // Добавление нового интервала
        success = await TimeIntervalStorage.addInterval(intervalData);
      }

      if (success) {
        await loadIntervals(); // перезагружаем список
      }
    } catch (error) {
      console.error('Error saving interval:', error);
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