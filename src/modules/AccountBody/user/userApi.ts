import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { z } from 'zod';
import { validateData } from '../../../shared/helpers/validation';
import { TimeIntervalStorage } from '../../IntervalList/slices/interval/intervalStorage';
import { encryptData, decryptData } from './crypt';



export const userSchema = z.object({
  login: z.string()
    .min(3, 'Логин должен содержать минимум 3 символа')
    .max(30, 'Логин слишком длинный'),
  password: z.string()
    .min(6, 'Пароль должен содержать минимум 6 символов')
    .max(50, 'Пароль слишком длинный'),
});

// Типы
export type UserInput = z.infer<typeof userSchema>;

export type User = {
  id: number;
  login: string;
};

export type AuthResponse = {
  user: User;
  token: string;
};

export type UserDataResponse = {
  data: string | null;
};

export type SaveUserDataRequest = {
  data: string;
};

// RTK Query API
export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://192.168.0.104:3001',
    prepareHeaders: async (headers) => {
      const token = await AsyncStorage.getItem('auth_token');
      if (token) headers.set('authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['User', 'UserData'],
  endpoints: (builder) => ({
    register: builder.mutation<AuthResponse, UserInput>({
      query: (userData) => {
        const validatedData = validateData(userData, userSchema);
        return {
          url: '/auth/register',
          method: 'POST',
          body: validatedData,
        };
      },
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          await AsyncStorage.setItem('auth_token', data.token);
        } catch {
          // Токен не сохраняем если ошибка
        }
      },
      invalidatesTags: ['User'],
    }),

    login: builder.mutation<AuthResponse, UserInput>({
      query: (loginData) => {
        const validatedData = validateData(loginData, userSchema);
        return {
          url: '/auth/login', 
          method: 'POST',
          body: validatedData,
        };
      },
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          await AsyncStorage.setItem('auth_token', data.token);
        } catch {
          // Токен не сохраняем если ошибка
        }
      },
      invalidatesTags: ['User'],
    }),

    getCurrentUser: builder.query<User, void>({
      query: () => '/users/me',
      providesTags: ['User'],
    }),

    logout: builder.mutation<null, void>({
      queryFn: async () => {
        await AsyncStorage.removeItem('auth_token');
        return { data: null };
      },
      invalidatesTags: ['User'],
    }),

    // Сохранение зашифрованных данных
    saveUserData: builder.mutation<{ success: boolean; message: string }, { encryptionKey: string }>({
      queryFn: async ({ encryptionKey }) => {
        try {
          // Получаем все интервалы
          const intervals = await TimeIntervalStorage.getAllIntervals();
          
          if (!intervals || intervals.length === 0) {
            return { 
              data: { 
                success: true, 
                message: 'Нет данных для сохранения' 
              } 
            };
          }

          const intervalsJSON = JSON.stringify(intervals);
          const encryptedData = encryptData(intervalsJSON, encryptionKey);
          
          // Отправляем на сервер
          const response = await fetch('http://192.168.0.104:3001/user/data', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${await AsyncStorage.getItem('auth_token')}`
            },
            body: JSON.stringify({ data: encryptedData })
          });

          if (!response.ok) {
            throw new Error('Ошибка при сохранении данных на сервере');
          }

          const result = await response.json();
          return { data: result };
        } catch (error: any) {
          return { 
            error: { 
              status: 'CUSTOM_ERROR', 
              error: error.message 
            } 
          };
        }
      },
      invalidatesTags: ['UserData'],
    }),

    // Получение и расшифровка данных
    getUserData: builder.mutation<{ success: boolean; intervals: any[] }, { encryptionKey: string }>({
      queryFn: async ({ encryptionKey }) => {
        try {
          // Получаем данные с сервера
          const response = await fetch('http://192.168.0.104:3001/user/data', {
            headers: {
              'Authorization': `Bearer ${await AsyncStorage.getItem('auth_token')}`
            }
          });

          if (!response.ok) {
            throw new Error('Ошибка при получении данных с сервера');
          }

          const serverData: UserDataResponse = await response.json();
          
          if (!serverData.data) {
            return { 
              data: { 
                success: true, 
                intervals: [],
                message: 'На сервере нет сохраненных данных'
              } 
            };
          }

          // Расшифровываем данные используя импортированную функцию
          const decryptedIntervals = decryptData(serverData.data, encryptionKey);
          // Сохраняем интервалы
          // await TimeIntervalStorage.setAllIntervals(decryptedIntervals);
          
          return { 
            data: { 
              success: true, 
              intervals: decryptedIntervals 
            } 
          };
        } catch (error: any) {
          return { 
            error: { 
              status: 'CUSTOM_ERROR', 
              error: error.message 
            } 
          };
        }
      },
      invalidatesTags: ['UserData'],
    }),

    // Удаление данных с сервера
    deleteUserData: builder.mutation<{ success: boolean; message: string }, void>({
      query: () => ({
        url: '/user/data',
        method: 'DELETE',
      }),
      invalidatesTags: ['UserData'],
    }),

    // Проверка наличия данных на сервере
    checkUserData: builder.query<{ hasData: boolean }, void>({
      query: () => '/user/data',
      transformResponse: (response: UserDataResponse) => ({
        hasData: !!response.data
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
  useDeleteUserDataMutation,
  useCheckUserDataQuery,
} = userApi;