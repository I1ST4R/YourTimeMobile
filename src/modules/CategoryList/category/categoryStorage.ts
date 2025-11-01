import AsyncStorage from '@react-native-async-storage/async-storage';
import z from 'zod';
import { validateArray, validateData } from '../../../shared/helpers/validation';

export const categorySchema = z.object({
  name: z.string().max(40, "категория слишком длинная")
});

export type CategoryType = z.infer<typeof categorySchema>;

const CATEGORIES_LIST_KEY = "categories_list"

export const CategoryStorage = {

  getAllCategories: async (): Promise<CategoryType[]> => {
    try {
      const categoriesJson = await AsyncStorage.getItem(CATEGORIES_LIST_KEY);
      
      // Добавляем парсинг JSON
      if (!categoriesJson) {
        return [];
      }
      
      const parsedCategories = JSON.parse(categoriesJson);
      const validatedCategories = validateArray(parsedCategories, categorySchema)
      
      if (!validatedCategories || !Array.isArray(validatedCategories) || validatedCategories.length === 0) {
        return [];
      }
      
      return validatedCategories
    } catch (error) {
      console.error('Error getting all categories:', error);
      return [];
    }
  },

  saveAllCategories: async (categories: CategoryType[]): Promise<boolean> => {
    try {
      const validatedCategories = validateArray(categories, categorySchema)
      if (!validatedCategories || !Array.isArray(validatedCategories)) {
        console.error('No valid categories to save');
        return false;
      }
      
      await AsyncStorage.setItem(CATEGORIES_LIST_KEY, JSON.stringify(validatedCategories))
      return true
    } catch (error) {
      console.error('Error saving all categories:', error);
      return false;
    }
  },

  addCategory: async (category: CategoryType): Promise<boolean> => {
    try {
      const validatedCategory = validateData(category, categorySchema);
      if (!validatedCategory) {
        return false;
      }
      
      const existingCategories = await CategoryStorage.getAllCategories();
      
      // Проверка на дубликаты
      const categoryExists = existingCategories.some(
        cat => cat.name.toLowerCase() === validatedCategory.name.toLowerCase()
      );
      
      if (categoryExists) {
        console.error('Category already exists');
        return false;
      }
      
      const updatedCategories = [...existingCategories, validatedCategory];
      await AsyncStorage.setItem(CATEGORIES_LIST_KEY, JSON.stringify(updatedCategories));
      
      return true;
    } catch (error) {
      console.error('Error adding category:', error);
      return false;
    }
  },

  deleteCategory: async (name: string): Promise<boolean> => {
    try {
      const existingCategories = await CategoryStorage.getAllCategories();
      const updatedCategories = existingCategories.filter(category => category.name !== name);
      await AsyncStorage.setItem(CATEGORIES_LIST_KEY, JSON.stringify(updatedCategories));
      return true;
    } catch (error) {
      console.error('Error deleting category:', error);
      return false;
    }
  }
};