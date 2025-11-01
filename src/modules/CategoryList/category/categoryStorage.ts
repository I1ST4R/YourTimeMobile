import AsyncStorage from '@react-native-async-storage/async-storage';
import z from 'zod';
import { validateArray, validateData } from '../../../shared/helpers/validation';

export const categorySchema = z.object({
  name: z.string().max(40, "категория слишком длинная")
});

export type CategoryType = z.infer<typeof categorySchema>;

const CATEGORY_KEY_BASE = "category_"
const LAST_CATEGORY_ID_KEY = "last_category_id"
const CATEGORIES_LIST_KEY = "categories_list"

export const CategoryStorage = {
  generateKey: async (): Promise<string> => {
    try {
      const lastKey = await AsyncStorage.getItem(LAST_CATEGORY_ID_KEY);
      
      if (lastKey === null) {
        await AsyncStorage.setItem(LAST_CATEGORY_ID_KEY, "0");
        return CATEGORY_KEY_BASE + "0";
      } else {
        const lastId = parseInt(lastKey, 10);
        if (isNaN(lastId)) {
          await AsyncStorage.setItem(LAST_CATEGORY_ID_KEY, "0");
          return CATEGORY_KEY_BASE + "0";
        }   
        const newId = lastId + 1;
        const newKey = newId.toString();
        await AsyncStorage.setItem(LAST_CATEGORY_ID_KEY, newKey);
        return CATEGORY_KEY_BASE + newKey;
      }
    } catch (error) {
      console.error('Error generating category key:', error);
      return CATEGORY_KEY_BASE + Date.now().toString();
    }
  },

  getAllCategoriesIds: async (): Promise<string[]> => {
    try {
      const categories = await AsyncStorage.getItem(CATEGORIES_LIST_KEY);
      return categories ? JSON.parse(categories) : [];
    } catch (error) {
      console.error('Error getting categories ids:', error);
      return [];
    }
  },

  getAllCategories: async (): Promise<CategoryType[]> => {
    try {
      const categoryIds = await CategoryStorage.getAllCategoriesIds();
      const categories: CategoryType[] = [];
      
      for (const id of categoryIds) {
        const category = await CategoryStorage.getCategoryById(id);
        if (category) {
          categories.push(category);
        }
      }
      
      return categories;
    } catch (error) {
      console.error('Error getting all categories:', error);
      return [];
    }
  },

  saveAllCategories: async (categories: CategoryType[]): Promise<boolean> => {
    try {
      // Очищаем существующие категории
      const existingIds = await CategoryStorage.getAllCategoriesIds();
      for (const id of existingIds) {
        await AsyncStorage.removeItem(id);
      }
      
      // Сохраняем новые категории
      const newIds: string[] = [];
      for (const category of categories) {
        const validatedCategory = validateData(category, categorySchema);
        if (!validatedCategory) {
          throw new Error('Category validation failed');
        }
        
        const newKey = await CategoryStorage.generateKey();
        await AsyncStorage.setItem(newKey, JSON.stringify(validatedCategory));
        newIds.push(newKey);
      }
      
      await AsyncStorage.setItem(CATEGORIES_LIST_KEY, JSON.stringify(newIds));
      return true;
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
      
      const newKey = await CategoryStorage.generateKey();
      await AsyncStorage.setItem(newKey, JSON.stringify(validatedCategory));
      
      const existingIds = await CategoryStorage.getAllCategoriesIds();
      const updatedIds = [...existingIds, newKey];
      await AsyncStorage.setItem(CATEGORIES_LIST_KEY, JSON.stringify(updatedIds));
      
      return true;
    } catch (error) {
      console.error('Error adding category:', error);
      return false;
    }
  },

  addAllCategories: async (categories: CategoryType[]): Promise<boolean> => {
    try {
      const validatedCategories = validateArray(categories, categorySchema);
      if (!validatedCategories || !Array.isArray(validatedCategories) || validatedCategories.length === 0) {
        console.error('No valid categories to add');
        return false;
      }
      
      const curCategoriesIds = await CategoryStorage.getAllCategoriesIds();
      
      for (const id of curCategoriesIds) {
        await CategoryStorage.deleteCategory(id);
      }
  
      await AsyncStorage.setItem(LAST_CATEGORY_ID_KEY, "0");
  
      for (const category of validatedCategories) {
        await CategoryStorage.addCategory(category);
      }
  
      return true;
    } catch (error) {
      console.error('Error in saveAllCategories:', error);
      return false;
    }
  },

  getCategoryById: async (id: string): Promise<CategoryType | undefined> => {
    try {
      const category = await AsyncStorage.getItem(id);
      if (!category) return undefined;
      
      const parsed = JSON.parse(category);
      return validateData(parsed, categorySchema) || undefined;
    } catch (error) {
      console.error('Error getting category by id:', error);
      return undefined;
    }
  },

  updateCategory: async (id: string, category: Partial<CategoryType>): Promise<boolean> => {
    try {
      const existing = await CategoryStorage.getCategoryById(id);
      if (!existing) return false;
      
      const updatedCategory = { ...existing, ...category };
      const validated = validateData(updatedCategory, categorySchema);
      if (!validated) return false;
      
      await AsyncStorage.setItem(id, JSON.stringify(validated));
      return true;
    } catch (error) {
      console.error('Error updating category:', error);
      return false;
    }
  },

  deleteCategory: async (id: string): Promise<boolean> => {
    try {
      await AsyncStorage.removeItem(id);
      
      const existingIds = await CategoryStorage.getAllCategoriesIds();
      const updatedIds = existingIds.filter(key => key !== id);
      await AsyncStorage.setItem(CATEGORIES_LIST_KEY, JSON.stringify(updatedIds));
      
      return true;
    } catch (error) {
      console.error('Error deleting category:', error);
      return false;
    }
  }
};