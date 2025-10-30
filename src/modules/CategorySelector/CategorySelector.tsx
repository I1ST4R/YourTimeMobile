import { useState, useMemo } from 'react';
import tw from 'twrnc';
import {
  FlatList,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  useGetAllCategoriesQuery,
  useAddCategoryMutation,
} from '../CategoryList/category/categoriesApi';
import { categorySchema } from '../CategoryList/category/categoryStorage';

type CategorySelectorProps = {
  onCategoryChange: (value: string) => void;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isOpen: boolean;
};

export const CategorySelector = ({
  onCategoryChange,
  setIsOpen,
  isOpen,
}: CategorySelectorProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [validationError, setValidationError] = useState('');
  const [isTouched, setIsTouched] = useState(false);

  const { data: categories = [], isLoading } = useGetAllCategoriesQuery();
  const [addCategory, { isLoading: isAdding }] = useAddCategoryMutation();

  const categoryNames = categories.map(cat => cat.name);

  const filteredCategories = useMemo(() => {
    return categoryNames.filter(catName =>
      catName.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [categoryNames, searchQuery]);

  const handleBlur = () => {
    setIsTouched(true);
    if (!searchQuery.trim()) return setValidationError('');

    const result = categorySchema.safeParse({ name: searchQuery.trim() });
    setValidationError(
      result.success
        ? ''
        : result.error.errors[0]?.message || 'Ошибка валидации',
    );
  };

  const handleChangeText = (text: string) => {
    setSearchQuery(text);
    if (validationError && isTouched) {
      const result = categorySchema.safeParse({ name: text.trim() });
      if (result.success) setValidationError('');
    }
  };

  const resetForm = () => {
    setSearchQuery('');
    setValidationError('');
    setIsTouched(false);
  };

  const handleCreateCategory = () => {
    const categoryName = searchQuery.trim();
    const validationResult = categorySchema.safeParse({ name: categoryName });

    if (!validationResult.success) {
      setValidationError(
        validationResult.error.errors[0]?.message || 'Ошибка валидации',
      );
      return;
    }

    addCategory({ name: categoryName }).then(() => {
      onCategoryChange(categoryName);
      setIsOpen(false);
    });
  };

  const handleSelectCategory = (categoryName: string) => {
    onCategoryChange(categoryName);
    setIsOpen(false);
    resetForm();
  };

  const handleClose = () => {
    setIsOpen(false);
    resetForm();
  };

  const canCreateCategory = 
    searchQuery.trim() && 
    !categoryNames.includes(searchQuery.trim()) && 
    !validationError && 
    !isAdding;

  return (
    <Modal
      visible={isOpen}
      animationType="fade"
      transparent
      onRequestClose={handleClose}
    >
      <View style={tw`flex-1 justify-center items-center bg-black/50`}>
        <View style={tw`bg-white rounded-xl w-11/12 h-3/4`}>
          <View style={tw`px-4`}>
            <Text style={tw`text-lg font-bold mb-3`}>Выберите категорию</Text>
            <TextInput
              value={searchQuery}
              onChangeText={handleChangeText}
              onBlur={handleBlur}
              placeholder="Создать/найти категории"
              style={tw`border border-gray-300 rounded-lg px-3 py-2 ${
                validationError ? 'border-red-500' : ''
              }`}
              placeholderTextColor="#666"
              autoFocus
            />
            {validationError && (
              <Text style={tw`text-red-500 text-sm mt-1`}>
                {validationError}
              </Text>
            )}
          </View>

          <View style={tw`flex-1`}>
            {isLoading ? (
              <View style={tw`flex-1 justify-center items-center`}>
                <Text>Загрузка...</Text>
              </View>
            ) : (
              <>
                {canCreateCategory && (
                  <View style={tw`px-4 py-2 border-b border-gray-200`}>
                    <TouchableOpacity
                      onPress={handleCreateCategory}
                      style={tw`bg-green-500 rounded-lg p-3 items-center ${
                        isAdding ? 'opacity-50' : ''
                      }`}
                      disabled={isAdding}
                    >
                      <Text style={tw`text-white font-bold`}>
                        {isAdding
                          ? 'Создание...'
                          : `Создать "${searchQuery.trim()}"`}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
                
                <FlatList
                  data={filteredCategories}
                  keyExtractor={item => item}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => handleSelectCategory(item)}
                      style={tw`p-3 border-b border-gray-200`}
                    >
                      <Text style={tw`text-base`}>{item}</Text>
                    </TouchableOpacity>
                  )}
                  ListEmptyComponent={
                    <View style={tw`p-4 items-center`}>
                      <Text style={tw`text-gray-500`}>
                        {searchQuery
                          ? 'Категории не найдены'
                          : 'Категории отсутствуют'}
                      </Text>
                    </View>
                  }
                />
              </>
            )}
          </View>

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