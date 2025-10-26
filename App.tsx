import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import tw from 'twrnc';
import ButtonScreen from './screens/ButtonScreen/ButtonScreen';
import ListScreen from './screens/ListScreen/ListScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

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
      </Tab.Navigator>
    </NavigationContainer>
  );
}