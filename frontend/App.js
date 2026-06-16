import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider } from 'react-native-safe-area-context'; 

import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import AdminRegisterScreen from './screens/AdminRegisterScreen';
import AdminDashboardScreen from './screens/AdminDashboardScreen';
import FormScreen from './screens/FormScreen'; 
import RiwayatScreen from './screens/RiwayatScreen'; 

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MahasiswaTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Buat Laporan') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          } else if (route.name === 'Riwayat Laporan') {
            iconName = focused ? 'time' : 'time-outline';
          }
          return <Ionicons name={iconName} size={size + 4} color={color} />;
        },
        tabBarActiveTintColor: '#0A2540', 
        tabBarInactiveTintColor: '#94A3B8',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E2E8F0',
          
          elevation: 10,
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowRadius: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '700',
          marginBottom: 5
        }
      })}
    >
      <Tab.Screen name="Buat Laporan" component={FormScreen} />
      <Tab.Screen name="Riwayat Laporan" component={RiwayatScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="AdminRegister" component={AdminRegisterScreen} />
          <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
          <Stack.Screen name="FormLaporan" component={MahasiswaTabs} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}