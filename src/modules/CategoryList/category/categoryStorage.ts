import AsyncStorage from '@react-native-async-storage/async-storage';
import z from 'zod';
import { validateArray, validateData } from '../../../shared/helpers/validation';

const categorySchema = z.object({
  id: z.string(),
  name: z.string().max(40, "категория слишком длинная")
});

export type CategoryType = z.infer<typeof categorySchema>;

const STORAGE_CATEGORIES_KEY = 'categories'

export const CategoryStorage = {
  getAllCategories: async (): Promise<CategoryType[]> => {
    try {
      const categories = await AsyncStorage.getItem(STORAGE_CATEGORIES_KEY);
      const parsedData = categories ? JSON.parse(categories) : [];
      return validateArray(parsedData, categorySchema);
    } catch (error) {
      console.error('Error getting categories:', error);
      return [];
    }
  },

  saveAllCategories: async (
    categories: CategoryType[],
  ): Promise<boolean> => {
    try {
      const validatedCategories = validateArray(categories, categorySchema);
      if (validatedCategories.length !== categories.length) {
        throw new Error('Some categories failed validation');
      }

      await AsyncStorage.setItem(
        STORAGE_CATEGORIES_KEY,
        JSON.stringify(validatedCategories),
      );
      return true;
    } catch (error) {
      console.error('Error saving categories:', error);
      return false;
    }
  },

  addCategory: async (category: Omit<CategoryType, 'id'>): Promise<boolean> => {
    try {
      const categories = await CategoryStorage.getAllCategories();
      const newCategory: CategoryType = {
        ...category,
        id: Date.now().toString(),
      };
      const validatedCategory = validateData(newCategory, categorySchema);
      if (!validatedCategory) {
        throw new Error('Category validation failed');
      }

      categories.push(validatedCategory);
      return await CategoryStorage.saveAllCategories(categories);
    } catch (error) {
      console.error('Error adding category:', error);
      return false;
    }
  },

  updateCategory: async (
    id: string,
    updatedCategory: Partial<Omit<CategoryType, 'id'>>,
  ): Promise<boolean> => {
    try {
      const categories = await CategoryStorage.getAllCategories();
      const index = categories.findIndex(category => category.id === id);
      if (index !== -1) {
        const mergedCategory = {
          ...categories[index],
          ...updatedCategory,
        };
        
        const validatedCategory = validateData(mergedCategory, categorySchema);
        if (!validatedCategory) {
          throw new Error('Updated category validation failed');
        }

        categories[index] = validatedCategory;
        return await CategoryStorage.saveAllCategories(categories);
      }
      return false;
    } catch (error) {
      console.error('Error updating category:', error);
      return false;
    }
  },

  deleteCategory: async (id: string): Promise<boolean> => {
    try {
      const categories = await CategoryStorage.getAllCategories();
      const filteredCategories = categories.filter(
        category => category.id !== id,
      );
      return await CategoryStorage.saveAllCategories(filteredCategories);
    } catch (error) {
      console.error('Error deleting category:', error);
      return false;
    }
  },

  getCategoryById: async (
    id: string,
  ): Promise<CategoryType | undefined> => {
    try {
      const categories = await CategoryStorage.getAllCategories();
      const category = categories.find(cat => cat.id === id);
      return category ? validateData(category, categorySchema) || undefined : undefined;
    } catch (error) {
      console.error('Error getting category by id:', error);
      return undefined;
    }
  },
};