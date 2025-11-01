import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { z } from 'zod';
import { validateData } from '../../../shared/helpers/validation';
import { TimeIntervalStorage } from '../../IntervalList/slices/interval/intervalStorage';
import { CategoryStorage } from '../../CategoryList/category/categoryStorage';
import { encryptData, decryptData } from './crypt';
import { intervalsApi } from '../../IntervalList/slices/interval/intervalsApi';
import { categoriesApi } from '../../CategoryList/category/categoriesApi';

export const userSchema = z.object({
  login: z
    .string()
    .min(3, 'Логин должен содержать минимум 3 символа')
    .max(30, 'Логин слишком длинный'),
  password: z
    .string()
    .min(6, 'Пароль должен содержать минимум 6 символов')
    .max(50, 'Пароль слишком длинный'),
});

export type UserInput = z.infer<typeof userSchema>;

export type User = {
  id: number;
  login: string;
};

export type AuthResponse = {
  user: User;
  token: string;
};

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://192.168.0.104:3001',
    prepareHeaders: async headers => {
      const token = await AsyncStorage.getItem('auth_token');
      if (token) headers.set('authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['User', 'UserData'],
  keepUnusedDataFor: 0,
  refetchOnMountOrArgChange: true,
  endpoints: builder => ({
    register: builder.mutation<AuthResponse, UserInput>({
      query: userData => {
        const validatedData = validateData(userData, userSchema);
        return {
          url: '/auth/register',
          method: 'POST',
          body: validatedData,
        };
      },
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          await AsyncStorage.setItem('auth_token', data.token);
          dispatch(userApi.util.invalidateTags(['User']));
        } catch {}
      },
      invalidatesTags: ['User'],
    }),

    login: builder.mutation<AuthResponse, UserInput>({
      query: loginData => {
        const validatedData = validateData(loginData, userSchema);
        return {
          url: '/auth/login',
          method: 'POST',
          body: validatedData,
        };
      },
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        const { data } = await queryFulfilled;
        await AsyncStorage.setItem('auth_token', data.token);
        dispatch(userApi.util.invalidateTags(['User']));
      },
      invalidatesTags: ['User'],
    }),

    getCurrentUser: builder.query<User | null, void>({
      queryFn: async () => {
        try {
          const token = await AsyncStorage.getItem('auth_token');
          if (!token) {
            return { data: null };
          }
          
          const response = await fetch('http://192.168.0.104:3001/users/me', {
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (!response.ok) {
            if (response.status === 401) {
              await AsyncStorage.removeItem('auth_token');
            }
            return { data: null };
          }
          
          const user = await response.json();
          return { data: user };
        } catch (error) {
          console.log(error)
          return { data: null };
        }
      },
      providesTags: ['User'],
    }),

    logout: builder.mutation<null, void>({
      queryFn: async () => {
        await AsyncStorage.removeItem('auth_token');
        return { data: null };
      },
      invalidatesTags: ['User', 'UserData'],
    }),

    saveUserData: builder.mutation<
      { success: boolean; message: string },
      { encryptionKey: string }
    >({
      queryFn: async ({ encryptionKey }) => {
        try {
          const intervals = await TimeIntervalStorage.getAllIntervals();
          const categories = await CategoryStorage.getAllCategories();

          if ((!intervals || intervals.length === 0) && (!categories || categories.length === 0)) {
            return {
              data: {
                success: true,
                message: 'Нет данных для сохранения',
              },
            };
          }

          const dataToSave = {
            intervals: intervals || [],
            categories: categories || []
          };

          const dataJSON = JSON.stringify(dataToSave);
          const encryptedIntervals = encryptData(dataJSON, encryptionKey);
          const encryptedCategories = encryptData(dataJSON, encryptionKey);

          const intervalsResponse = await fetch('http://192.168.0.104:3001/user/intervals', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${await AsyncStorage.getItem('auth_token')}`,
            },
            body: JSON.stringify({ data: encryptedIntervals }),
          });

          const categoriesResponse = await fetch('http://192.168.0.104:3001/user/categories', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${await AsyncStorage.getItem('auth_token')}`,
            },
            body: JSON.stringify({ data: encryptedCategories }),
          });

          if (!intervalsResponse.ok || !categoriesResponse.ok) {
            throw new Error('Ошибка при сохранении данных на сервере');
          }

          return { 
            data: { 
              success: true, 
              message: 'Данные успешно сохранены' 
            } 
          };
        } catch (error: any) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: error.message,
            },
          };
        }
      },
      invalidatesTags: ['UserData'],
    }),

    getUserData: builder.mutation<
      { success: boolean; intervals: any[]; categories: any[]; message: string },
      { encryptionKey: string }
    >({
      queryFn: async ({ encryptionKey }, _api) => {
        try {
          const token = await AsyncStorage.getItem('auth_token');

          const intervalsResponse = await fetch('http://192.168.0.104:3001/user/intervals', {
            headers: { Authorization: `Bearer ${token}` },
          });

          const categoriesResponse = await fetch('http://192.168.0.104:3001/user/categories', {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (!intervalsResponse.ok || !categoriesResponse.ok) {
            throw new Error('Ошибка при получении данных с сервера');
          }

          const intervalsData = await intervalsResponse.json();
          const categoriesData = await categoriesResponse.json();

          const encryptedIntervals = intervalsData.data;
          const encryptedCategories = categoriesData.data;

          if (!encryptedIntervals && !encryptedCategories) {
            return {
              data: {
                success: true,
                intervals: [],
                categories: [],
                message: 'На сервере нет сохраненных данных',
              },
            };
          }

          let decryptedIntervals = [];
          let decryptedCategories = [];

          if (encryptedIntervals) {
            const decryptedDataString = decryptData(encryptedIntervals, encryptionKey);
            const unescapedString = JSON.parse(decryptedDataString);
            const parsedData = JSON.parse(unescapedString);
            decryptedIntervals = parsedData.intervals || [];
          }

          if (encryptedCategories) {
            const decryptedDataString = decryptData(encryptedCategories, encryptionKey);
            const unescapedString = JSON.parse(decryptedDataString);
            const parsedData = JSON.parse(unescapedString);
            decryptedCategories = parsedData.categories || [];
          }

          if (decryptedIntervals.length > 0) {
            const saveIntervalsResult = await TimeIntervalStorage.addIntervals(decryptedIntervals);
            if (!saveIntervalsResult) {
              throw new Error('Ошибка при сохранении интервалов локально');
            }
            _api.dispatch(intervalsApi.util.invalidateTags(['Interval']));
          }

          if (decryptedCategories.length > 0) {
            const saveCategoriesResult = await CategoryStorage.saveAllCategories(decryptedCategories);
            if (!saveCategoriesResult) {
              throw new Error('Ошибка при сохранении категорий локально');
            }
            _api.dispatch(categoriesApi.util.invalidateTags(['Category']));
          }

          await fetch('http://192.168.0.104:3001/user/intervals', {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
          });

          await fetch('http://192.168.0.104:3001/user/categories', {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
          });

          return {
            data: {
              success: true,
              intervals: decryptedIntervals,
              categories: decryptedCategories,
              message: 'Данные успешно загружены и удалены с сервера',
            },
          };
        } catch (error: any) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: error.message,
            },
          };
        }
      },
      invalidatesTags: ['UserData'],
    }),

    checkUserData: builder.query<{ hasData: boolean }, void>({
      query: () => '/user/intervals',
      transformResponse: (response: { data: string | null }) => ({
        hasData: !!response.data,
      }),
      providesTags: ['UserData'],
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useGetCurrentUserQuery,
  useLogoutMutation,
  useSaveUserDataMutation,
  useGetUserDataMutation,
  useCheckUserDataQuery,
} = userApi;