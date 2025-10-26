import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import tw from 'twrnc';

import ButtonScreen from '../screens/ButtonScreen/ButtonScreen';
import ListScreen from '../screens/ListScreen/ListScreen';
import Interval from '../screens/Interval/Interval';


const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: tw`bg-white border-t border-gray-200`,
          tabBarActiveTintColor: '#8B5CF6',
          tabBarInactiveTintColor: '#9CA3AF',
        }}
      >
        <Tab.Screen 
          name="Buttons" 
          component={ButtonScreen}
          options={{ tabBarLabel: 'Кнопки' }}
        />
        <Tab.Screen 
          name="List" 
          component={ListScreen}
          options={{ tabBarLabel: 'Список' }}
        />
        <Tab.Screen 
          name="Interval" 
          component={Interval}
          options={{ tabBarLabel: 'Интервал' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}