import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList
} from 'react-native';
import tw from 'twrnc';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../app/store';
import { addCategory, loadCategories, selectCategories } from './category/category.slice';
import { CategoryItem } from '../../screens/CategoryItem';
import { CategoryType } from './category/categoryStorage'; 

const CategoryList = () => {
  const dispatch = useAppDispatch()
  const [newCategoryName, setNewCategoryName] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredCategories, setFilteredCategories] = useState<CategoryType[]>([]) 
  
  const categories = useSelector(selectCategories)

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const filtered = categories.filter(category =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredCategories(filtered)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchQuery, categories])

  useEffect(() => {
    dispatch(loadCategories())
  }, [dispatch])

  const handleAddCategory = () => {
    if (newCategoryName.trim() !== '') {
      dispatch(addCategory({ name: newCategoryName.trim() }))
      setNewCategoryName('') 
    }
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
          style={tw`bg-green-500 rounded-lg px-4 justify-center`}
          disabled={!newCategoryName.trim()} 
        >
          <Text style={tw`text-white font-bold`}>Создать</Text>
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

      {/* Список категорий */}
      {filteredCategories.length > 0 ? (
        <FlatList
          data={filteredCategories}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <CategoryItem category={item} />}
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