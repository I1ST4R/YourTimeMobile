import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { CategoryType, CategoryStorage } from './categoryStorage';

interface CategoryState {
  categories: CategoryType[];
  loading: boolean;
  error: string | null;
}

const initialState: CategoryState = {
  categories: [],
  loading: false,
  error: null,
};

export const loadCategories = createAsyncThunk(
  'categories/loadCategories',
  async () => {
    const categories = await CategoryStorage.getAllCategories();
    return categories;
  }
);

export const addCategory = createAsyncThunk(
  'categories/addCategory',
  async (categoryData: Omit<CategoryType, 'id'>, { dispatch }) => {
    const success = await CategoryStorage.addCategory(categoryData);
    if (success) {
      await dispatch(loadCategories());
      return;
    }
    throw new Error('Failed to add category');
  }
);

export const updateCategory = createAsyncThunk(
  'categories/updateCategory',
  async ({ id, category }: { id: string; category: Partial<Omit<CategoryType, 'id'>> }, { dispatch }) => {
    const success = await CategoryStorage.updateCategory(id, category);
    if (success) {
      await dispatch(loadCategories());
      return;
    }
    throw new Error('Failed to update category');
  }
);

export const deleteCategory = createAsyncThunk(
  'categories/deleteCategory',
  async (id: string, { dispatch }) => {
    const success = await CategoryStorage.deleteCategory(id);
    if (success) {
      await dispatch(loadCategories());
      return;
    }
    throw new Error('Failed to delete category');
  }
);

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  selectors: {
    selectCategories: (state) => state.categories,
    selectCategoriesLoading: (state) => state.loading,
    selectCategoriesError: (state) => state.error,
    selectCategoriesCount: (state) => state.categories.length,
    selectCategoryById: (state, categoryId: string) => 
      state.categories.find(category => category.id === categoryId),
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(loadCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load categories';
      })
      .addCase(addCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCategory.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to add category';
      })
      .addCase(updateCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCategory.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update category';
      })
      .addCase(deleteCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete category';
      });
  },
});

export const { clearError } = categorySlice.actions;
export const { 
  selectCategories, 
  selectCategoriesLoading, 
  selectCategoriesError, 
  selectCategoriesCount,
  selectCategoryById
} = categorySlice.selectors;

export default categorySlice.reducer;