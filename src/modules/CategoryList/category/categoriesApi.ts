import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { CategoryType, CategoryStorage } from './categoryStorage';

export const categoriesApi = createApi({
  reducerPath: 'categoriesApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Category'],
  endpoints: (builder) => ({
    getAllCategories: builder.query<CategoryType[], void>({
      queryFn: async () => {
        try {
          const categories = await CategoryStorage.getAllCategories();
          return { data: categories };
        } catch (error) {
          return { error: error instanceof Error ? error.message : 'Failed to load categories' };
        }
      },
      providesTags: ['Category'],
    }),

    getCategoryById: builder.query<CategoryType, string>({
      queryFn: async (id) => {
        try {
          const category = await CategoryStorage.getCategoryById(id);
          if (!category) {
            return { error: 'Category not found' };
          }
          return { data: category };
        } catch (error) {
          return { error: error instanceof Error ? error.message : 'Failed to get category' };
        }
      },
      providesTags: (result, error, id) => [{ type: 'Category', id }],
    }),

    addCategory: builder.mutation<{ success: boolean }, CategoryType>({
      queryFn: async (categoryData) => {
        try {
          const success = await CategoryStorage.addCategory(categoryData);
          return { data: { success } };
        } catch (error) {
          return { error: error instanceof Error ? error.message : 'Failed to add category' };
        }
      },
      invalidatesTags: ['Category'],
    }),

    updateCategory: builder.mutation<{ success: boolean }, { id: string; category: Partial<CategoryType> }>({
      queryFn: async ({ id, category }) => {
        try {
          const success = await CategoryStorage.updateCategory(id, category);
          return { data: { success } };
        } catch (error) {
          return { error: error instanceof Error ? error.message : 'Failed to update category' };
        }
      },
      invalidatesTags: (result, error, { id }) => [{ type: 'Category', id }],
    }),

    deleteCategory: builder.mutation<{ success: boolean }, string>({
      queryFn: async (id) => {
        try {
          const success = await CategoryStorage.deleteCategory(id);
          return { data: { success } };
        } catch (error) {
          return { error: error instanceof Error ? error.message : 'Failed to delete category' };
        }
      },
      invalidatesTags: ['Category'],
    }),
  }),
});

export const {
  useGetAllCategoriesQuery,
  useGetCategoryByIdQuery,
  useAddCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoriesApi;