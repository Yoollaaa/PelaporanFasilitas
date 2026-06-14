import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import FormScreen from './screens/FormScreen'; 
import RiwayatScreen from './screens/RiwayatScreen'; 
import AdminDashboardScreen from './screens/AdminDashboardScreen'; 
import AdminRegisterScreen from './screens/AdminRegisterScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Register" 
          component={RegisterScreen} 
          options={{ title: 'Daftar Akun Baru' }} 
        />
        <Stack.Screen 
          name="AdminRegister" 
          component={AdminRegisterScreen} 
          options={{ title: 'Registrasi Staf Sarpras' }} 
        />
        <Stack.Screen 
          name="FormLaporan" 
          component={FormScreen} 
          options={{ title: 'Lapor Kerusakan' }} 
        />
        <Stack.Screen 
          name="Riwayat" 
          component={RiwayatScreen} 
          options={{ title: 'Riwayat Saya' }} 
        />
        <Stack.Screen 
          name="AdminDashboard" 
          component={AdminDashboardScreen} 
          options={{ title: 'Dashboard Sarpras' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}