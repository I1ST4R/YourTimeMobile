import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList
} from 'react-native';
import tw from 'twrnc';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../app/store';
import { addCategory, loadCategories, selectCategories } from './category/category.slice';
import { CategoryItem } from '../../screens/CategoryItem';

const CategoryList = () => {
  const dispatch = useAppDispatch()
  const [newCategoryName, setNewCategoryName] = useState('')
  
  useEffect(() => {
    dispatch(loadCategories())
  },[dispatch])
  
  const categories = useSelector(selectCategories)

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

      {categories.length > 0 ? (
        <FlatList
          data={categories}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <CategoryItem category={item} />}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={tw`flex-1 justify-center items-center`}>
          <Text style={tw`text-gray-500 text-lg`}>Нет категорий</Text>
          <Text style={tw`text-gray-400 text-center mt-2`}>
            Создайте первую категорию, используя поле выше
          </Text>
        </View>
      )}
    </View>
  )
}

export default CategoryList