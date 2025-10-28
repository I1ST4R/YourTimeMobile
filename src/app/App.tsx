import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider } from 'react-redux';
import { store } from './store'; // или путь к твоему store файлу
import tw from 'twrnc';

import Interval from '../screens/Interval';

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
        </Tab.Navigator>
      </NavigationContainer>
    </Provider>
  );
}