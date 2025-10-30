import React, { useState, useEffect,  useCallback, useRef } from 'react';
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
const VISIBLE_ITEMS = 3; 
const BUFFER_ITEMS = 1; 

type TimePickerModalProps = {
  isOpen: boolean;
  onClose: () => void;
  initialTime: string;
  timeChange: (time: string) => void
};

// Вынес генерацию списков за компонент чтобы не пересчитывать при каждом рендере
const generateTimeLists = () => {
  const generateNumbers = (max: number) => {
    return Array.from({ length: max }, (_, i) => i.toString().padStart(2, '0'));
  };

  const baseHours = generateNumbers(24);
  const baseMinutes = generateNumbers(60);
  const baseSeconds = generateNumbers(60);

  return {
    hoursList: [...baseHours, ...baseHours.slice(0, BUFFER_ITEMS)],
    minutesList: [...baseMinutes, ...baseMinutes.slice(0, BUFFER_ITEMS)],
    secondsList: [...baseSeconds, ...baseSeconds.slice(0, BUFFER_ITEMS)],
  };
};

const { hoursList, minutesList, secondsList } = generateTimeLists();

const TimePickerModal = ({
  isOpen,
  onClose,
  initialTime,
  timeChange
}: TimePickerModalProps) => {
  const [hours, setHours] = useState('00');
  const [minutes, setMinutes] = useState('00');
  const [seconds, setSeconds] = useState('00');

  const hoursScrollRef = useRef<ScrollView>(null!);
  const minutesScrollRef = useRef<ScrollView>(null!);
  const secondsScrollRef = useRef<ScrollView>(null!);

  // Упростил scrollToInitialValues
  const scrollToInitialValues = useCallback(() => {
    if (!initialTime) return;
    
    const [h = '00', m = '00', s = '00'] = initialTime.split(':');
    const newHours = h.padStart(2, '0');
    const newMinutes = m.padStart(2, '0');
    const newSeconds = s.padStart(2, '0');
    
    setHours(newHours);
    setMinutes(newMinutes);
    setSeconds(newSeconds);

    // Убрал setTimeout - скроллим сразу
    requestAnimationFrame(() => {
      const hoursIndex = hoursList.indexOf(newHours);
      const minutesIndex = minutesList.indexOf(newMinutes);
      const secondsIndex = secondsList.indexOf(newSeconds);

      hoursScrollRef.current?.scrollTo({ y: hoursIndex * ITEM_HEIGHT, animated: false });
      minutesScrollRef.current?.scrollTo({ y: minutesIndex * ITEM_HEIGHT, animated: false });
      secondsScrollRef.current?.scrollTo({ y: secondsIndex * ITEM_HEIGHT, animated: false });
    });
  }, [initialTime]);

  useEffect(() => {
    if (isOpen) {
      scrollToInitialValues();
    }
  }, [isOpen, scrollToInitialValues]);

  // Упростил handleScroll с debounce
  const handleScroll = useCallback((
    event: NativeSyntheticEvent<NativeScrollEvent>,
    setValue: (value: string) => void,
    data: string[],
    max: number
  ) => {
    const y = event.nativeEvent.contentOffset.y;
    const index = Math.round(y / ITEM_HEIGHT) % max;
    const value = data[index];
    setValue(value);
  }, []);

  const handleConfirm = useCallback(() => {
    const selectedTime = `${hours}:${minutes}:${seconds}`;
    timeChange(selectedTime);
    onClose();
  }, [hours, minutes, seconds, onClose, timeChange]);

  const handleCancel = useCallback(() => {
    onClose();
  }, [onClose]);

  // Упростил renderPickerColumn - убрал лишние вычисления
  const renderPickerColumn = useCallback((
    data: string[],
    selectedValue: string,
    onValueChange: (value: string) => void,
    max: number,
    label: string,
    scrollRef: React.RefObject<ScrollView>
  ) => {
    const renderItem = (item: string, index: number) => (
      <View
        key={`${label}-${index}-${item}`} // ← label + index + item
        style={{ height: ITEM_HEIGHT, justifyContent: 'center', alignItems: 'center' }}
      >
        <Text
          style={[
            tw`text-lg`,
            selectedValue === item ? tw`text-blue-600 font-bold` : tw`text-gray-400`,
          ]}
        >
          {item}
        </Text>
      </View>
    );

    return (
      <View style={tw`flex-1 items-center`}>
        <Text style={tw`text-gray-500 text-xs mb-2`}>{label}</Text>
        <View style={[tw`overflow-hidden`, { height: ITEM_HEIGHT * VISIBLE_ITEMS }]}>
          <ScrollView
            ref={scrollRef}
            showsVerticalScrollIndicator={false}
            snapToInterval={ITEM_HEIGHT}
            decelerationRate="fast"
            onScroll={(e) => handleScroll(e, onValueChange, data, max)}
            scrollEventThrottle={32}
          >
            <View style={{ height: ITEM_HEIGHT }} />
            {data.map(renderItem)}
            <View style={{ height: ITEM_HEIGHT }} />
          </ScrollView>
          
          <View
            style={[
              tw`absolute left-0 right-0 bg-blue-100/30 border-t border-b border-blue-400`,
              { height: ITEM_HEIGHT, top: '50%', transform: [{ translateY: -ITEM_HEIGHT / 2 }] }
            ]}
            pointerEvents="none"
          />
        </View>
      </View>
    );
  }, [handleScroll]);

  if (!isOpen) return null;

  return (
    <Modal
      visible={isOpen}
      transparent={true}
      animationType="fade"
      onRequestClose={handleCancel}
    >
      <View style={tw`flex-1 justify-end bg-black/50`}>
        <View style={tw`bg-white rounded-t-3xl p-4 max-h-3/4`}>
          <View style={tw`flex-row justify-between items-center mb-4`}>
            <TouchableOpacity onPress={handleCancel}>
              <Text style={tw`text-red-500 text-base font-semibold`}>Отмена</Text>
            </TouchableOpacity>
            <Text style={tw`text-base font-bold text-gray-800`}>Выберите время</Text>
            <TouchableOpacity onPress={handleConfirm}>
              <Text style={tw`text-green-500 text-base font-semibold`}>✓</Text>
            </TouchableOpacity>
          </View>

          <View style={tw`items-center mb-4`}>
            <Text style={tw`text-xl font-bold text-gray-800`}>
              {hours}:{minutes}:{seconds}
            </Text>
          </View>

          <View style={[tw`flex-row justify-between`, { height: ITEM_HEIGHT * VISIBLE_ITEMS + 30 }]}>
            {renderPickerColumn(hoursList, hours, setHours, 24, 'Часы', hoursScrollRef)}
            <View style={[tw`justify-center`, { paddingVertical: ITEM_HEIGHT }]}>
              <Text style={tw`text-lg font-bold text-gray-800`}>:</Text>
            </View>
            {renderPickerColumn(minutesList, minutes, setMinutes, 60, 'Мин', minutesScrollRef)}
            <View style={[tw`justify-center`, { paddingVertical: ITEM_HEIGHT }]}>
              <Text style={tw`text-lg font-bold text-gray-800`}>:</Text>
            </View>
            {renderPickerColumn(secondsList, seconds, setSeconds, 60, 'Сек', secondsScrollRef)}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default TimePickerModal;