import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import tw from 'twrnc';
import { useDeleteCategoryMutation } from './category/categoriesApi';
import { CategoryType } from './category/categoryStorage';


export const CategoryItem = ({ category }: { category: CategoryType }) => {
  const [categoryName, setCategoryName] = useState(category.name);
  const [isEditing, setIsEditing] = useState(false);
  
  const [deleteCategory] = useDeleteCategoryMutation();

  const handleInputChange = (text: string) => {
    setCategoryName(text);
    if (!isEditing) {
      setIsEditing(true);
    }
  };

  return (
    <View style={tw`flex-row items-center border-b border-gray-200 min-h-16`}>
      <TextInput
        value={categoryName}
        onChangeText={handleInputChange}
        style={tw`flex-1 border border-gray-300 rounded-lg px-3 py-3 mr-2`}
        placeholder="Название категории"
        placeholderTextColor="#808080"
      />

      <TouchableOpacity
        onPress={() => deleteCategory(category.name)}
        style={tw`bg-red-500 rounded-lg p-3 w-12 h-12 justify-center items-center`}
      >
        <Text style={tw`text-white font-bold text-lg`}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );
};