import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider } from 'react-redux';
import { store } from './store'; 
import { Image } from 'react-native';
import tw from 'twrnc';

import Interval from '../screens/Interval';
import Category from '../screens/Category';
import Analysis from '../screens/Analysis';
import { Account } from '../screens/Account';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            tabBarStyle: tw`bg-white border-t border-gray-200`,
            tabBarActiveTintColor: '#8B5CF6',
            tabBarInactiveTintColor: '#9CA3AF',
          }}
        >
          <Tab.Screen 
            name="Интервалы" 
            component={Interval}
            options={{ 
              tabBarLabel: 'Интервал',
              tabBarIcon: ({ focused, color, size }) => (
                <Image 
                  source={require('./icons/timer.png')}
                  style={{ 
                    width: size, 
                    height: size,
                    tintColor: color 
                  }}
                />
              )
            }}
          />
          <Tab.Screen 
            name="Категории" 
            component={Category}
            options={{ 
              tabBarLabel: 'Категории',
              tabBarIcon: ({ focused, color, size }) => (
                <Image 
                  source={require('./icons/category.png')}
                  style={{ 
                    width: size, 
                    height: size,
                    tintColor: color 
                  }}
                />
              )
            }}
          />
          <Tab.Screen 
            name="Анализ" 
            component={Analysis}
            options={{ 
              tabBarLabel: 'Анализ',
              tabBarIcon: ({ focused, color, size }) => (
                <Image 
                  source={require('./icons/analysis.png')}
                  style={{ 
                    width: size, 
                    height: size,
                    tintColor: color 
                  }}
                />
              )
            }}
          />
          <Tab.Screen 
            name="Аккаунт" 
            component={Account}
            options={{ 
              tabBarLabel: 'Аккаунт',
              tabBarIcon: ({ focused, color, size }) => (
                <Image 
                  source={require('./icons/account.png')}
                  style={{ 
                    width: size, 
                    height: size,
                    tintColor: color 
                  }}
                />
              )
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </Provider>
  );
}