import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList
} from 'react-native';
import tw from 'twrnc';
import { useGetAllCategoriesQuery, useAddCategoryMutation } from './category/categoriesApi';
import { CategoryItem } from './CategoryItem';

const CategoryList = () => {
  const [newCategoryName, setNewCategoryName] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  
  const { data: categories = [], isLoading, error } = useGetAllCategoriesQuery();
  
  const [addCategory, { isLoading: isAdding }] = useAddCategoryMutation();

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;
    
    return categories.filter(category =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, categories]);

  const handleAddCategory = () => {
    if (newCategoryName.trim() !== '') {
      addCategory({ name: newCategoryName.trim() })
        .then(() => {
          setNewCategoryName('');
        });
    }
  }

  if (error) {
    return (
      <View style={tw`flex-1 justify-center items-center p-4`}>
        <Text style={tw`text-red-500 text-lg`}>Ошибка загрузки категорий</Text>
      </View>
    );
  }

  return(
    <View style={tw`flex-1 p-4`}>
      <Text style={tw`text-2xl font-bold mb-4 text-center`}>Категории</Text>
      
      <View style={tw`flex-row mb-4`}>
        <TextInput
          value={newCategoryName}
          onChangeText={setNewCategoryName}
          placeholder="Название новой категории"
          style={tw`flex-1 border border-gray-300 rounded-lg px-3 py-2 mr-2`}
          onSubmitEditing={handleAddCategory} 
          placeholderTextColor="#808080"
        />
        <TouchableOpacity 
          onPress={handleAddCategory}
          style={tw`bg-green-500 rounded-lg px-4 justify-center ${
            !newCategoryName.trim() || isAdding ? 'opacity-50' : ''
          }`}
          disabled={!newCategoryName.trim() || isAdding} 
        >
          <Text style={tw`text-white font-bold`}>
            {isAdding ? 'Создание...' : 'Создать'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={tw`mb-4`}>
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Поиск категорий..."
          style={tw`border border-gray-300 rounded-lg px-3 py-2`}
          placeholderTextColor="#808080"
        />
      </View>

      {isLoading ? (
        <View style={tw`flex-1 justify-center items-center`}>
          <Text style={tw`text-gray-500 text-lg`}>Загрузка...</Text>
        </View>
      ) : filteredCategories.length > 0 ? (
        <FlatList
          data={filteredCategories}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => <CategoryItem category={item}/>}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={tw`flex-1 justify-center items-center`}>
          <Text style={tw`text-gray-500 text-lg`}>
            {searchQuery ? 'Категории не найдены' : 'Нет категорий'}
          </Text>
          <Text style={tw`text-gray-400 text-center mt-2`}>
            {searchQuery 
              ? 'Попробуйте изменить поисковый запрос'
              : 'Создайте первую категорию, используя поле выше'
            }
          </Text>
        </View>
      )}
    </View>
  )
}

export default CategoryList