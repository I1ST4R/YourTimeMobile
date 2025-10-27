import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
} from 'react-native';

import { validateInterval } from '../IntervalList/timeHelpers';
import { FormIntervalType } from '../../shared/storage';
import { useSelector } from 'react-redux';
import { selectCurrentInterval } from './form.slice';

const IntervalForm = () => {
  const [name, setName] = useState<string>('');
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const curInterval = useSelector(selectCurrentInterval);

  const resetForm = (): void => {
    setName('');
    setStartTime('');
    setEndTime('');
    setDescription('');
  };

  if (curInterval) {
    setName(curInterval.name || '');
    setStartTime(curInterval.startTime || '');
    setEndTime(curInterval.endTime || '');
    setDescription(curInterval.description || '');
  } else {
    resetForm();
  }

  const handleSave = (): void => {
    const validation = validateInterval(startTime, endTime);
    if (!validation.isValid) {
      Alert.alert('Ошибка', validation.error || 'Неизвестная ошибка');
      return;
    }

    const intervalData: FormIntervalType = {
      name: name.trim() || `Интервал ${formatTime(new Date())}`,
      startTime,
      endTime,
      description: description.trim(),
    };

    onSave(intervalData);
    resetForm();
    onClose();
  };

  const handleCancel = (): void => {
    resetForm();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleCancel}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>
            {editingInterval ? 'Редактировать интервал' : 'Добавить интервал'}
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Название интервала "
            placeholderTextColor="#666"
            value={name}
            onChangeText={setName}
          />

          <TextInput
            style={styles.input}
            placeholder="Время начала "
            placeholderTextColor="#666"
            value={startTime}
            onChangeText={setStartTime}
          />

          <TextInput
            style={styles.input}
            placeholder="Время окончания"
            placeholderTextColor="#666"
            value={endTime}
            onChangeText={setEndTime}
          />

          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Описание"
            placeholderTextColor="#666"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
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
