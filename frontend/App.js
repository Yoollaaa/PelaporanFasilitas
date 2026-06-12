import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import semua layar dari folder screens
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import FormScreen from './screens/FormScreen'; 

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      {/* initialRouteName menentukan halaman mana yang pertama kali muncul */}
      <Stack.Navigator initialRouteName="Login">
        
        {/* Halaman Login */}
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }} // Sembunyikan header atas
        />
        
        {/* Halaman Register */}
        <Stack.Screen 
          name="Register" 
          component={RegisterScreen} 
          options={{ headerShown: false }} 
        />
        
        {/* Halaman Form Laporan Utama */}
        <Stack.Screen 
          name="FormLaporan" 
          component={FormScreen} 
          options={{ 
            title: 'Kembali', // Teks tombol back
            headerStyle: { backgroundColor: '#F8FAFC' },
            headerShadowVisible: false, // Hilangkan garis bawah header
          }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}