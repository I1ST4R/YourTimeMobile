import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import tw from 'twrnc';

const ITEM_HEIGHT = 40;
const VISIBLE_ITEMS = 5;
const BUFFER_ITEMS = 2;

type TimePickerModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onTimeSelect: (time: string) => void;
  initialTime: string;
};

const TimePickerModal = ({
  isOpen,
  onClose,
  onTimeSelect,
  initialTime
}: TimePickerModalProps) => {
  const [hours, setHours] = useState('00');
  const [minutes, setMinutes] = useState('00');
  const [seconds, setSeconds] = useState('00');

  const { hoursList, minutesList, secondsList } = useMemo(() => {
    const generateNumbers = (max: number) => {
      return Array.from({ length: max }, (_, i) =>
        i.toString().padStart(2, '0')
      );
    };

    const baseHours = generateNumbers(24);
    const baseMinutes = generateNumbers(60);
    const baseSeconds = generateNumbers(60);

    return {
      hoursList: [...baseHours, ...baseHours.slice(0, BUFFER_ITEMS)],
      minutesList: [...baseMinutes, ...baseMinutes.slice(0, BUFFER_ITEMS)],
      secondsList: [...baseSeconds, ...baseSeconds.slice(0, BUFFER_ITEMS)],
    };
  }, []);

  useEffect(() => {
    if (initialTime && isOpen) {
      const [h = '00', m = '00', s = '00'] = initialTime.split(':');
      setHours(h.padStart(2, '0'));
      setMinutes(m.padStart(2, '0'));
      setSeconds(s.padStart(2, '0'));
    }
  }, [initialTime, isOpen]);

  const handleScroll = useCallback((
    event: NativeSyntheticEvent<NativeScrollEvent>,
    setValue: (value: string) => void,
    data: string[],
    max: number
  ) => {
    const y = event.nativeEvent.contentOffset.y;
    const index = Math.round(y / ITEM_HEIGHT) % max;
    const value = data[index].padStart(2, '0');
    setValue(value);
  }, []);

  const handleConfirm = useCallback(() => {
    const selectedTime = `${hours}:${minutes}:${seconds}`;
    onTimeSelect(selectedTime);
    onClose();
  }, [hours, minutes, seconds, onTimeSelect, onClose]);

  const handleCancel = useCallback(() => {
    if (initialTime) {
      const [h = '00', m = '00', s = '00'] = initialTime.split(':');
      setHours(h.padStart(2, '0'));
      setMinutes(m.padStart(2, '0'));
      setSeconds(s.padStart(2, '0'));
    }
    onClose();
  }, [initialTime, onClose]);

  const renderPickerColumn = useCallback((
    data: string[],
    selectedValue: string,
    onValueChange: (value: string) => void,
    max: number,
    label: string
  ) => (
    <View style={tw`flex-1 items-center`}>
      <Text style={tw`text-gray-500 text-xs mb-2`}>{label}</Text>
      <View style={[tw`overflow-hidden`, { height: ITEM_HEIGHT * VISIBLE_ITEMS }]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          snapToInterval={ITEM_HEIGHT}
          decelerationRate="fast"
          onScroll={(e) => handleScroll(e, onValueChange, data, max)}
          scrollEventThrottle={32}
        >
          <View style={{ height: ITEM_HEIGHT * 2 }} />
          
          {data.map((item, index) => (
            <View
              key={`${label}-${item}-${index}`}
              style={{ 
                height: ITEM_HEIGHT, 
                justifyContent: 'center', 
                alignItems: 'center' 
              }}
            >
              <Text
                style={[
                  tw`text-lg font-medium`,
                  selectedValue === item
                    ? tw`text-blue-600 font-bold text-xl`
                    : tw`text-gray-400`,
                ]}
                numberOfLines={1}
              >
                {item}
              </Text>
            </View>
          ))}
          
          <View style={{ height: ITEM_HEIGHT * 2 }} />
        </ScrollView>
      </View>
    </View>
  ), [handleScroll]);

  return (
    <Modal
      visible={isOpen}
      transparent={true}
      animationType="slide"
      onRequestClose={handleCancel}
    >
      <View style={tw`flex-1 justify-end bg-black/50`}>
        <View style={tw`bg-white rounded-t-3xl p-6 max-h-3/4`}>
          <View style={tw`flex-row justify-between items-center mb-6`}>
            <TouchableOpacity onPress={handleCancel}>
              <Text style={tw`text-red-500 text-lg font-semibold`}>Отмена</Text>
            </TouchableOpacity>
            <Text style={tw`text-lg font-bold text-gray-800`}>
              Выберите время
            </Text>
            <TouchableOpacity onPress={handleConfirm}>
              <Text style={tw`text-green-500 text-lg font-semibold`}>✓</Text>
            </TouchableOpacity>
          </View>

          <View style={tw`items-center mb-6`}>
            <Text style={tw`text-2xl font-bold text-gray-800`}>
              {hours}:{minutes}:{seconds}
            </Text>
          </View>

          <View style={[tw`flex-row justify-between`, { height: ITEM_HEIGHT * VISIBLE_ITEMS + 40 }]}>
            {renderPickerColumn(
              hoursList,
              hours,
              setHours,
              24,
              'Часы'
            )}
            
            <View style={[tw`justify-center items-center`, { paddingVertical: ITEM_HEIGHT * 1.5 }]}>
              <Text style={tw`text-xl font-bold text-gray-800`}>:</Text>
            </View>

            {renderPickerColumn(
              minutesList,
              minutes,
              setMinutes,
              60,
              'Минуты'
            )}
            
            <View style={[tw`justify-center items-center`, { paddingVertical: ITEM_HEIGHT * 1.5 }]}>
              <Text style={tw`text-xl font-bold text-gray-800`}>:</Text>
            </View>

            {renderPickerColumn(
              secondsList,
              seconds,
              setSeconds,
              60,
              'Секунды'
            )}
          </View>

          <View
            style={[
              tw`absolute left-5 right-5 bg-blue-100/30 border-t-2 border-b-2 border-blue-400`,
              { 
                height: ITEM_HEIGHT,
                top: '50%',
                transform: [{ translateY: -ITEM_HEIGHT / 2 }]
              }
            ]}
            pointerEvents="none"
          />
        </View>
      </View>
    </Modal>
  );
};

export default TimePickerModal;