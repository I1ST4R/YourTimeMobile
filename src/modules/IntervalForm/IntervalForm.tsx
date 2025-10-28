import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from 'react-native';

import { FormIntervalType } from '../../shared/storage';
import { useSelector } from 'react-redux';
import {
  closeForm,
  selectCurrentInterval,
  selectFormType,
  selectIsOpen,
} from './form.slice';
import { useAppDispatch } from '../../app/store';
import {
  addInterval,
  deleteInterval,
  updateInterval,
} from '../IntervalList/interval.slice';
import { getCurrentDate } from '../IntervalList/timeHelpers';
import DateTimePicker from '@react-native-community/datetimepicker';

const IntervalForm = () => {
  const dispatch = useAppDispatch();
  const [name, setName] = useState<string>('');
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date>(getCurrentDate());
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);

  const curInterval = useSelector(selectCurrentInterval);
  const isOpen = useSelector(selectIsOpen);
  const formType = useSelector(selectFormType);

  useEffect(() => {
    if (curInterval) {
      setName(curInterval.name || '');
      setStartTime(curInterval.startTime || '');
      setEndTime(curInterval.endTime || '');
      setCategory(curInterval.category || '');
      setSelectedDate(curInterval.date);
    } else {
      resetForm();
    }
  }, [curInterval]);

  const resetForm = (): void => {
    setName('');
    setStartTime('');
    setEndTime('');
    setCategory('');
    setSelectedDate(new Date());
  };

  const handleDateChange = (event: any, date?: Date): void => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleSave = (): void => {
    const intervalData: FormIntervalType = {
      name: name.trim(),
      startTime,
      date: selectedDate, // Используем выбранную дату
      endTime,
      category,
    };

    switch (formType) {
      case 'delete':
        dispatch(deleteInterval(curInterval?.id ?? ''));
        break;
      case 'create':
        dispatch(addInterval(intervalData));
        break;
      case 'update':
        dispatch(
          updateInterval({ id: curInterval?.id ?? '', interval: intervalData }),
        );
        break;
    }
    resetForm();
    dispatch(closeForm());
  };

  const handleCancel = (): void => {
    resetForm();
    dispatch(closeForm());
  };

  const showDatepicker = (): void => {
    setShowDatePicker(true);
  };

  return (
    <Modal
      visible={isOpen}
      animationType="slide"
      transparent={true}
      onRequestClose={handleCancel}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>
            {formType === 'update'
              ? 'Редактировать интервал'
              : 'Добавить интервал'}
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Название"
            placeholderTextColor="#666"
            value={name}
            onChangeText={setName}
          />

          {/* Поле выбора даты */}
          <TouchableOpacity style={styles.dateButton} onPress={showDatepicker}>
            <Text style={styles.dateButtonText}>
              Дата: {selectedDate.toLocaleDateString('ru-RU')}
            </Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}

          <TextInput
            style={styles.input}
            placeholder="Начало"
            placeholderTextColor="#666"
            value={startTime}
            onChangeText={setStartTime}
          />

          <TextInput
            style={styles.input}
            placeholder="Конец"
            placeholderTextColor="#666"
            value={endTime}
            onChangeText={setEndTime}
          />

          <TextInput
            style={styles.input}
            placeholder="Категория"
            placeholderTextColor="#666"
            value={category}
            onChangeText={setCategory}
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleCancel}
            >
              <Text style={styles.buttonText}>Отмена</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={handleSave}
            >
              <Text style={styles.buttonText}>Сохранить</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Стили остаются теми же...
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    maxWidth: 400,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },
  dateButtonText: {
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    padding: 12,
    borderRadius: 5,
    minWidth: 100,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#007AFF',
  },
  cancelButton: {
    backgroundColor: '#8E8E93',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default IntervalForm;