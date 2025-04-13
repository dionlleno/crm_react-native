import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { InicioScreen } from '../screens/InicioScreen';
import { ClientesScreen } from '../screens/ClientesScreen';
import { ImoveisScreen } from '../screens/ImoveisScreen';
import { MainTabParamList } from '../types/navigation';

const Tab = createBottomTabNavigator<MainTabParamList>();

export const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      }}
    >
      <Tab.Screen 
        name="Inicio" 
        component={InicioScreen}
        options={{
          tabBarLabel: 'Início',
        }}
      />
      <Tab.Screen 
        name="Clientes" 
        component={ClientesScreen}
        options={{
          tabBarLabel: 'Clientes',
        }}
      />
      <Tab.Screen 
        name="Imoveis" 
        component={ImoveisScreen}
        options={{
          tabBarLabel: 'Imóveis',
        }}
      />
    </Tab.Navigator>
  );
}; 