import { Text, TouchableOpacity, View } from 'react-native';
import tw from 'twrnc';
import { useState } from 'react';
import { CategorySelector } from '../../CategorySelector/CategorySelector';
import { useUpdateIntervalMutation } from '../slices/interval/intervalsApi';

type CategoryFieldProps = {
  value: string,
  intervalId: string
}

export const CategoryField = ({ value, intervalId }: CategoryFieldProps) => {
  const [updateInterval] = useUpdateIntervalMutation();
  const [category, setCategory] = useState(value);
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  const handleChangeCategory = (newCategory: string) => {
    setCategory(newCategory);
    updateInterval({
      id: intervalId,
      interval: { category: newCategory }
    });
    setIsSelectOpen(false);
  };

  return (
    <View style={tw`mb-2`}>
      <TouchableOpacity
        onPress={() => setIsSelectOpen(true)}
        style={tw`w-full bg-gray-100 rounded-lg px-3 py-2`}
      >
        <Text style={tw`text-sm text-gray-600 text-left`}>
          {category || 'Категория'}
        </Text>
      </TouchableOpacity>

      <CategorySelector
        onCategoryChange={handleChangeCategory}
        setIsOpen={setIsSelectOpen}
        isOpen={isSelectOpen}
      />
    </View>
  );
};