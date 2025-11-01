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

    addCategory: builder.mutation<boolean, CategoryType>({
      queryFn: async (categoryData) => {
        try {
          const success = await CategoryStorage.addCategory(categoryData);
          return { data: success };
        } catch (error) {
          return { error: error instanceof Error ? error.message : 'Failed to add category' };
        }
      },
      invalidatesTags: ['Category'],
    }),

    deleteCategory: builder.mutation<boolean, string>({
      queryFn: async (name) => {
        try {
          const success = await CategoryStorage.deleteCategory(name);
          return { data: success };
        } catch (error) {
          return { error: error instanceof Error ? error.message : 'Failed to delete category' };
        }
      },
      invalidatesTags: ['Category'],
    }),

    saveAllCategories: builder.mutation<boolean, CategoryType[]>({
      queryFn: async (categories) => {
        try {
          const success = await CategoryStorage.saveAllCategories(categories);
          return { data: success };
        } catch (error) {
          return { error: error instanceof Error ? error.message : 'Failed to save categories' };
        }
      },
      invalidatesTags: ['Category'],
    }),
  }),
});

export const {
  useGetAllCategoriesQuery,
  useAddCategoryMutation,
  useDeleteCategoryMutation,
  useSaveAllCategoriesMutation,
} = categoriesApi;