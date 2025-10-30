import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import tw from 'twrnc';
import { useAppDispatch } from '../app/store';
import {
  deleteCategory,
  updateCategory,
} from '../modules/CategoryList/category/categoriesApi';
import { CategoryType } from '../modules/CategoryList/category/categoryStorage';

export const CategoryItem = ({ category }: { category: CategoryType }) => {
  const dispatch = useAppDispatch();
  const [categoryName, setCategoryName] = useState(category.name);
  const [isEditing, setIsEditing] = useState(false);

  const handleUpdate = () => {
    if (categoryName.trim() !== '' && categoryName !== category.name) {
      dispatch(
        updateCategory({
          id: category.id,
          category: { ...category, name: categoryName.trim() },
        }),
      );
    }
    setIsEditing(false);
  };

  const handleInputChange = (text: string) => {
    setCategoryName(text);
    if (!isEditing) {
      setIsEditing(true);
    }
  };

  return (
    <View
      style={tw`flex-row items-center border-b border-gray-200 min-h-16`}
    >
      <TextInput
        value={categoryName}
        onChangeText={handleInputChange}
        style={tw`flex-1 border border-gray-300 rounded-lg px-3 py-3 mr-2`}
        placeholder="Название категории"
        placeholderTextColor="#808080"
      />

      {isEditing && (
        <TouchableOpacity
          onPress={handleUpdate}
          style={tw`bg-green-500 rounded-lg p-3 mr-4 w-12 h-12 justify-center items-center`}
        >
          <Text style={tw`text-white font-bold text-lg`}>✓</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        onPress={() => dispatch(deleteCategory(category.id))}
        style={tw`bg-red-500 rounded-lg p-3 w-12 h-12 justify-center items-center`}
      >
        <Text style={tw`text-white font-bold text-lg`}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );
};
