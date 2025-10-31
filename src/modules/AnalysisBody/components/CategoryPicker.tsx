import { Text, TouchableOpacity, View } from 'react-native';
import tw from 'twrnc';

type CategoryPickerProps = {
  setSelectedCategories: React.Dispatch<React.SetStateAction<Set<string>>>
  selectedCategories: Set<string>
  categoryAnalysis: Array<{category: string,totalSeconds: number,formattedTime: string}>
  categoryColors: Map<string, string>
}

export const CategoryPicker = ({
  setSelectedCategories,
  selectedCategories,
  categoryAnalysis,
  categoryColors
} : CategoryPickerProps) => {

  const toggleCategory = (category: string) => {
    const newSelected = new Set(selectedCategories);
    if (newSelected.has(category)) {
      newSelected.delete(category);
    } else {
      newSelected.add(category);
    }
    setSelectedCategories(newSelected);
  };

  const selectAllCategories = () => {
    const allCategories = new Set(categoryAnalysis.map(item => item.category || 'Без категории'));
    setSelectedCategories(allCategories);
  };

    // Очистить выбор
    const clearSelection = () => {
      setSelectedCategories(new Set());
    };

  return (
    <View style={tw`bg-white mx-4 rounded-xl p-4 shadow-lg mb-4`}>
      <Text style={tw`text-lg font-semibold mb-3 text-gray-800`}>
        Выберите категории для анализа:
      </Text>

      {/* Кнопки управления */}
      <View style={tw`flex-row justify-between mb-3`}>
        <TouchableOpacity
          style={tw`px-4 py-2 bg-blue-500 rounded-lg`}
          onPress={selectAllCategories}
        >
          <Text style={tw`text-white font-medium`}>Выбрать все</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={tw`px-4 py-2 bg-gray-300 rounded-lg`}
          onPress={clearSelection}
        >
          <Text style={tw`text-gray-700 font-medium`}>Очистить</Text>
        </TouchableOpacity>
      </View>

      {/* Список категорий для выбора */}
      <View style={tw`flex-row flex-wrap`}>
        {categoryAnalysis.map((item, index) => {
          const categoryName = item.category || 'Без категории';
          const isSelected = selectedCategories.has(categoryName);

          return (
            <TouchableOpacity
              key={index}
              style={[
                tw`flex-row items-center px-3 py-2 m-1 rounded-lg border`,
                isSelected
                  ? tw`bg-blue-100 border-blue-500`
                  : tw`bg-gray-100 border-gray-300`,
              ]}
              onPress={() => toggleCategory(categoryName)}
            >
              <View
                style={[
                  tw`w-3 h-3 rounded-full mr-2`,
                  { backgroundColor: categoryColors.get(item.category) },
                ]}
              />
              <Text
                style={
                  isSelected ? tw`text-blue-700 font-medium` : tw`text-gray-700`
                }
              >
                {categoryName}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Статус выбора */}
      <Text style={tw`text-sm text-gray-600 mt-3`}>
        {selectedCategories.size === 0
          ? 'Выбраны все категории'
          : `Выбрано категорий: ${selectedCategories.size} из ${categoryAnalysis.length}`}
      </Text>
    </View>
  );
};
