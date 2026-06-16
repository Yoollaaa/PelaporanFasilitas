import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, Alert, ActivityIndicator, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { globalStyles, profileStyles, COLORS } from '../styles/GlobalStyles';

export default function ProfileScreen({ navigation }) {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchProfil = async () => {
      try {
        const dataString = await AsyncStorage.getItem('user');
        if (dataString) {
          setUserData(JSON.parse(dataString));
        }
      } catch (error) {
        console.log('Gagal memuat profil', error);
      }
    };
    fetchProfil();
  }, []);

  const handleLogout = () => {
    Alert.alert(
      'Konfirmasi Keluar',
      'Apakah kamu yakin ingin keluar dari aplikasi?',
      [
        { text: 'Batal', style: 'cancel' },
        { 
          text: 'Keluar', 
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.removeItem('user');
            await AsyncStorage.removeItem('token');
            navigation.replace('Login'); 
          }
        }
      ]
    );
  };

  if (!userData) {
    return (
      <View style={globalStyles.centerLoading}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const isAdmin = userData.role === 'admin';
  const roleLabel = isAdmin ? 'Staf Sarpras Universitas Lampung' : 'Mahasiswa Universitas Lampung';
  const idLabel = isAdmin ? 'NIP / ID Staf' : 'NPM';

  
  return (
    <View style={globalStyles.mainWrapper}>
      <View style={globalStyles.topOrnament} />
      
      <View style={globalStyles.container}>
        
        <View style={globalStyles.mainLogoWrapper}>
            <Image 
              source={require('../assets/Logo_UnivLampung.png')} 
              style={globalStyles.mainLogo}
              resizeMode="contain"
            />
        </View>

        <Text style={globalStyles.pageTitle}>Profil Akun</Text>

        <View style={profileStyles.profileHeader}>
          <Ionicons name="person-circle" size={90} color={COLORS.primary} />
          <Text style={profileStyles.name}>{userData.nama || 'Pengguna Unila'}</Text>
          <Text style={profileStyles.role}>{roleLabel}</Text>
        </View>

        <View style={globalStyles.card}>
          <View style={profileStyles.infoRow}>
            <Ionicons name="id-card-outline" size={24} color={COLORS.textGray} />
            <View style={profileStyles.infoText}>
              <Text style={profileStyles.infoLabel}>{idLabel}</Text>
              <Text style={profileStyles.infoValue}>{userData.npm || userData.nip || '-'}</Text>
            </View>
          </View>
          
          <View style={globalStyles.divider} />
          
          <View style={profileStyles.infoRow}>
            <Ionicons name="mail-outline" size={24} color={COLORS.textGray} />
            <View style={profileStyles.infoText}>
              <Text style={profileStyles.infoLabel}>Email Kampus</Text>
              <Text style={profileStyles.infoValue}>{userData.email || '-'}</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={profileStyles.btnLogoutProfile} onPress={handleLogout} activeOpacity={0.8}>
          <Ionicons name="log-out-outline" size={22} color={COLORS.danger} />
          <Text style={profileStyles.btnLogoutProfileText}>Keluar dari Akun</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}