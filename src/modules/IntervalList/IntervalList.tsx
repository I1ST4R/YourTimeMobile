import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
} from 'react-native';
import { useAppDispatch } from '../../app/store';
import { loadIntervals, selectIntervals } from './interval.slice';
import { useSelector } from 'react-redux';
import IntervalItem from './IntervalItem';

const IntervalList = () => {
  const dispatch = useAppDispatch()
  dispatch(loadIntervals())
  const intervals = useSelector(selectIntervals)

  if (intervals.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Нет добавленных интервалов</Text>
        <Text style={styles.emptySubtext}>Нажмите "+" чтобы добавить первый интервал</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={intervals}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <IntervalItem interval={item}/>
      )}
      style={styles.list}
      contentContainerStyle={styles.listContent}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  listContent: {
    paddingVertical: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});

export default IntervalList;