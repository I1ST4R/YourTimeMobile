import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { addCategory, loadCategories, selectCategories } from "../CategoryList/category/category.slice";
import tw from 'twrnc';
import { FlatList, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useAppDispatch } from "../../app/store";

export const CategorySelector = ({ 
  onSelectCategory,
  onClose 
}: { 
  onSelectCategory: (category: string) => void;
  onClose: () => void;
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCategories, setFilteredCategories] = useState<string[]>([]);
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(loadCategories())
  }, [dispatch])
  const categories = useSelector(selectCategories);
  const categoryNames = categories.map(cat => cat.name);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim() === '') {
        setFilteredCategories(categoryNames);
      } else {
        const filtered = categoryNames.filter(catName =>
          catName.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredCategories(filtered);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, categoryNames]);

  const handleCreateCategory = () => {
    onSelectCategory(searchQuery.trim());
    dispatch(addCategory({name: searchQuery.trim()}))
    onClose();
  };

  return (
    <View style={tw`absolute top-0 left-0 right-0 bottom-0 bg-white rounded-lg p-4 z-10`}>
      <Text style={tw`text-lg font-bold mb-3`}>Выберите категорию</Text>
      
      <TextInput
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Создать/найти категории"
        style={tw`border border-gray-300 rounded-lg px-3 py-2 mb-3`}
        placeholderTextColor="#666"
        autoFocus
      />

      {searchQuery.trim() !== '' && filteredCategories.length === 0 ? (
        <TouchableOpacity
          onPress={handleCreateCategory}
          style={tw`bg-green-500 rounded-lg p-3 items-center mb-2`}
        >
          <Text style={tw`text-white font-bold`}>
            Создать "{searchQuery.trim()}"
          </Text>
        </TouchableOpacity>
      ) : (
        <FlatList
          data={filteredCategories}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                onSelectCategory(item);
                onClose();
              }}
              style={tw`p-3 border-b border-gray-200`}
            >
              <Text style={tw`text-base`}>{item}</Text>
            </TouchableOpacity>
          )}
          style={tw`max-h-40`}
        />
      )}

      <TouchableOpacity
        onPress={onClose}
        style={tw`bg-gray-500 rounded-lg p-3 mt-3 items-center`}
      >
        <Text style={tw`text-white font-bold`}>Отмена</Text>
      </TouchableOpacity>
    </View>
  );
};