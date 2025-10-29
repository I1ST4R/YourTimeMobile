import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider } from 'react-redux';
import { store } from './store'; 
import tw from 'twrnc';

import Interval from '../screens/Interval';
import Category from '../screens/Category';

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
            name="Interval" 
            component={Interval}
            options={{ tabBarLabel: 'Интервал' }}
          />
          <Tab.Screen 
            name="Category" 
            component={Category}
            options={{ tabBarLabel: '=Категории' }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </Provider>
  );
}