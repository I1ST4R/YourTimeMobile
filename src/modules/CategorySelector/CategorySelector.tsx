import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { addCategory, loadCategories, selectCategories } from "../CategoryList/category/category.slice";
import tw from 'twrnc';
import { FlatList, Modal, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useAppDispatch } from "../../app/store";

type CategorySelectorProps = {
  onCategoryChange: (value: string) => void
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  isOpen: boolean
}

export const CategorySelector = ({
  onCategoryChange,
  setIsOpen,
  isOpen
} : CategorySelectorProps) => {
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
    onCategoryChange(searchQuery.trim())
    dispatch(addCategory({name: searchQuery.trim()}))
    setIsOpen(false)
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Modal
      visible={isOpen}
      animationType="fade"  
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={tw`flex-1 justify-center items-center bg-black/50`}>
        <View style={tw`bg-white rounded-xl w-11/12 h-3/4`}>
          {/* Заголовок и поиск - фиксированная высота */}
          <View style={tw`p-4 border-b border-gray-200`}>
            <Text style={tw`text-lg font-bold mb-3`}>Выберите категорию</Text>
            
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Создать/найти категории"
              style={tw`border border-gray-300 rounded-lg px-3 py-2`}
              placeholderTextColor="#666"
              autoFocus
            />
          </View>
  
          {/* Основной контент - занимает все оставшееся пространство */}
          <View style={tw`flex-1`}>
            {searchQuery.trim() !== '' && filteredCategories.length === 0 ? (
              <View style={tw`p-4`}>
                <TouchableOpacity
                  onPress={handleCreateCategory}
                  style={tw`bg-green-500 rounded-lg p-3 items-center`}
                >
                  <Text style={tw`text-white font-bold`}>
                    Создать "{searchQuery.trim()}"
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <FlatList
                data={filteredCategories}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => {
                      onCategoryChange(item)
                      setIsOpen(false)
                    }}
                    style={tw`p-3 border-b border-gray-200`}
                  >
                    <Text style={tw`text-base`}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
  
          {/* Кнопка отмены - фиксированная внизу */}
          <View style={tw`p-4 border-t border-gray-200`}>
            <TouchableOpacity
              onPress={handleClose}
              style={tw`bg-gray-500 rounded-lg p-3 items-center`}
            >
              <Text style={tw`text-white font-bold`}>Отмена</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};