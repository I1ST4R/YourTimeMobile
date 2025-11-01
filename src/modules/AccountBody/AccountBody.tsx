import React, { useState} from 'react';
import {
  View,
  TextInput,
  Button,
  Text,
  TouchableOpacity,
  Modal,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useGetCurrentUserQuery,
  useSaveUserDataMutation,
  useGetUserDataMutation,
  useCheckUserDataQuery,
} from './user/userApi';
import { userSchema, UserInput } from './user/userApi';
import tw from 'twrnc';

export const AccountBody = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [modalMode, setModalMode] = useState<'save' | 'load'>('save');
  const [encryptionKey, setEncryptionKey] = useState('');

  const [register] = useRegisterMutation();
  const [login] = useLoginMutation();
  const [logout] = useLogoutMutation();
  const [saveUserData, { isLoading: isSaving }] = useSaveUserDataMutation();
  const [getUserData, { isLoading: isLoading }] = useGetUserDataMutation();

  const { data: currentUser, isLoading: isUserLoading, refetch } = useGetCurrentUserQuery();

  const { data: userDataInfo } = useCheckUserDataQuery(undefined, {
    pollingInterval: 30000,
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UserInput>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      login: '',
      password: '',
    },
  });

  const onSubmit = (data: UserInput) => {
    if (isLogin) {
      login(data)
        .unwrap()
        .then(() => {
          reset();
          refetch();
        })
        .catch(() => {
          Alert.alert('Ошибка', 'Не удалось выполнить вход');
        });
    } else {
      register(data)
        .unwrap()
        .then(() => {
          reset();
          refetch();
        })
        .catch(() => {
          Alert.alert('Ошибка', 'Не удалось выполнить регистрацию');
        });
    }
  };

  const handleLogout = () => {
    logout()
      .unwrap()
      .then(() => {
        setEncryptionKey('');
        refetch();
      });
  };

  const handleSaveData = () => {
    setModalMode('save');
    setShowKeyModal(true);
    setEncryptionKey('');
  };

  const handleLoadData = () => {
    setModalMode('load');
    setShowKeyModal(true);
    setEncryptionKey('');
  };

  const handleKeySubmit = () => {
    if (!encryptionKey.trim()) {
      Alert.alert('Ошибка', 'Введите ключ шифрования');
      return;
    }
  
    if (modalMode === 'save') {
      saveUserData({ encryptionKey })
        .unwrap()
        .then(result => {
          Alert.alert('Успех', result.message || 'Данные успешно сохранены на сервер');
          setShowKeyModal(false);
          setEncryptionKey('');
        })
        .catch((error: any) => {
          Alert.alert('Ошибка', error.error || 'Произошла ошибка при сохранении данных');
        });
    } else {
      getUserData({ encryptionKey })
        .unwrap()
        .then(result => {
          let message = '';
          if (result.intervals.length > 0 && result.categories.length > 0) {
            message = `Загружено ${result.intervals.length} интервалов и ${result.categories.length} категорий`;
          } else if (result.intervals.length > 0) {
            message = `Загружено ${result.intervals.length} интервалов`;
          } else if (result.categories.length > 0) {
            message = `Загружено ${result.categories.length} категорий`;
          } else {
            message = 'Нет данных для загрузки';
          }
          
          Alert.alert('Успех', message);
          setShowKeyModal(false);
          setEncryptionKey('');
        })
        .catch((error: any) => {
          Alert.alert('Ошибка', error.error || 'Произошла ошибка при загрузке данных');
        });
    }
  };

  const handleCloseModal = () => {
    setShowKeyModal(false);
    setEncryptionKey('');
  };

  if (isUserLoading) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={tw`mt-4 text-gray-600`}>Загрузка...</Text>
      </View>
    );
  }

  if (currentUser) {
    return (
      <View style={tw`p-5`}>
        {showKeyModal && (
          <Modal
            visible={showKeyModal}
            animationType="slide"
            transparent={true}
            onRequestClose={handleCloseModal}
          >
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}
            >
              <View style={tw`bg-white p-6 rounded-lg w-80`}>
                <Text style={tw`text-lg font-bold mb-4 text-center`}>
                  {modalMode === 'save' ? 'Сохранение данных' : 'Загрузка данных'}
                </Text>

                <Text style={tw`text-sm text-gray-600 mb-4 text-center`}>
                  {modalMode === 'save'
                    ? 'Введите ключ для шифрования данных. Запомните его для восстановления на другом устройстве.'
                    : 'Введите ключ для расшифровки данных.'}
                </Text>

                <TextInput
                  placeholder="Ключ шифрования"
                  placeholderTextColor="#6b7280"
                  secureTextEntry
                  style={tw`border border-gray-300 mb-4 p-3 rounded bg-white`}
                  value={encryptionKey}
                  onChangeText={setEncryptionKey}
                  autoFocus
                  returnKeyType="done"
                  onSubmitEditing={handleKeySubmit}
                />

                <View style={tw`flex-row justify-between`}>
                  <TouchableOpacity
                    style={tw`flex-1 bg-gray-300 py-3 rounded mr-2`}
                    onPress={handleCloseModal}
                  >
                    <Text style={tw`text-center font-semibold`}>Отмена</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={tw`flex-1 bg-blue-500 py-3 rounded ml-2`}
                    onPress={handleKeySubmit}
                    disabled={isSaving || isLoading}
                  >
                    {isSaving || isLoading ? (
                      <ActivityIndicator color="white" />
                    ) : (
                      <Text style={tw`text-white text-center font-semibold`}>
                        {modalMode === 'save' ? 'Сохранить' : 'Загрузить'}
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </KeyboardAvoidingView>
          </Modal>
        )}

        <Text style={tw`text-center text-lg font-bold mb-2`}>
          Добро пожаловать, {currentUser.login}!
        </Text>

        {userDataInfo?.hasData && (
          <Text style={tw`text-center text-green-600 mb-4`}>
            ✓ На сервере есть сохраненные данные
          </Text>
        )}

        <TouchableOpacity
          style={tw`bg-green-500 py-3 rounded mb-4 ${isSaving ? 'opacity-50' : ''}`}
          onPress={handleSaveData}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={tw`text-white text-center font-semibold`}>
              Сохранить данные на сервер
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={tw`bg-blue-500 py-3 rounded mb-4 ${isLoading ? 'opacity-50' : ''}`}
          onPress={handleLoadData}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={tw`text-white text-center font-semibold`}>
              Загрузить данные с сервера
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={tw`bg-red-500 py-3 rounded`}
          onPress={handleLogout}
        >
          <Text style={tw`text-white text-center font-semibold`}>Выйти</Text>
        </TouchableOpacity>

        <Text style={tw`text-xs text-gray-500 mt-6 text-center`}>
          При сохранении данные шифруются вашим ключом.{'\n'}
          Сервер хранит только зашифрованную информацию.
        </Text>
      </View>
    );
  }

  return (
    <View style={tw`p-5`}>
      <View style={tw`flex-row justify-center mb-6`}>
        <TouchableOpacity
          style={tw`flex-1 py-3 ${isLogin ? 'bg-blue-500' : 'bg-gray-300'} rounded-l`}
          onPress={() => setIsLogin(true)}
        >
          <Text style={tw`text-center font-semibold ${isLogin ? 'text-white' : 'text-gray-600'}`}>
            Вход
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={tw`flex-1 py-3 ${!isLogin ? 'bg-blue-500' : 'bg-gray-300'} rounded-r`}
          onPress={() => setIsLogin(false)}
        >
          <Text style={tw`text-center font-semibold ${!isLogin ? 'text-white' : 'text-gray-600'}`}>
            Регистрация
          </Text>
        </TouchableOpacity>
      </View>

      <Controller
        control={control}
        name="login"
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="Логин"
            placeholderTextColor="#6b7280"
            style={tw`border border-gray-300 mb-2 p-3 rounded bg-white`}
            value={value}
            onChangeText={onChange}
          />
        )}
      />
      {errors.login && (
        <Text style={tw`text-red-500 mb-2`}>{errors.login.message}</Text>
      )}

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="Пароль"
            placeholderTextColor="#6b7280"
            secureTextEntry
            style={tw`border border-gray-300 mb-2 p-3 rounded bg-white text-black`}
            value={value}
            onChangeText={onChange}
          />
        )}
      />
      {errors.password && (
        <Text style={tw`text-red-500 mb-4`}>{errors.password.message}</Text>
      )}

      <Button
        title={isLogin ? 'Войти' : 'Зарегистрироваться'}
        onPress={handleSubmit(onSubmit)}
      />
    </View>
  );
}