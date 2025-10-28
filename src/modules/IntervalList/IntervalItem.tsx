import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';

import { useAppDispatch } from '../../app/store';
import { deleteInterval } from './interval.slice';
import { changeCurrentInterval, openForm } from '../IntervalForm/form.slice';
import { StoreIntervalType } from '../../shared/storage';
import { calculateDuration } from './timeHelpers';

const IntervalItem = ({ interval } : {interval: StoreIntervalType}) => {
  const dispatch = useAppDispatch()

  const handleEditInterval = () => {
    dispatch(changeCurrentInterval(interval));
    dispatch(openForm())
  };

  const handleDelete = () => {
    Alert.alert(
      'Удаление интервала',
      'Вы уверены, что хотите удалить этот интервал?',
      [
        { text: 'Отмена', style: 'cancel' },
        { 
          text: 'Удалить', 
          style: 'destructive',
          onPress: () => dispatch(deleteInterval(interval.id))
        },
      ]
    );
  };

  const [duration, isDifDays] = calculateDuration(interval.startTime, interval.endTime)

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.name}>{interval.name}</Text>
        <Text style={styles.date}>дата</Text>
        <View style={styles.timeContainer}>
          <Text style={styles.time}>
            {interval.startTime} - {interval.endTime}
          </Text>
          <Text style={styles.duration}>
            Длительность: {duration}
          </Text>
          {
            isDifDays ? <Text style={styles.duration}> переход через день</Text>
            : <></>
          }
        </View>
        {interval.category && (
          <Text style={styles.description}>{interval.category}</Text>
        )}
      </View>
      
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.button, styles.editButton]}
          onPress={() => handleEditInterval()}
        >
          <Text style={styles.buttonText}>✏️</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          onPress={handleDelete}
        >
          <Text style={styles.buttonText}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 15,
    marginVertical: 4,
    marginHorizontal: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  timeContainer: {
    marginBottom: 4,
  },
  time: {
    fontSize: 14,
    color: '#333',
  },
  duration: {
    fontSize: 12,
    color: '#007AFF',
    marginTop: 2,
  },
  description: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  button: {
    padding: 8,
    borderRadius: 4,
    minWidth: 36,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#FFA500',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: 'white',
    fontSize: 12,
  },
});

export default IntervalItem;