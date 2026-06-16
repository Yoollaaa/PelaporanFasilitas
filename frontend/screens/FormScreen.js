import React, { useState, useEffect } from 'react';
import { 
  Text, View, TextInput, TouchableOpacity, Image, 
  ScrollView, Alert, ActivityIndicator, Platform, KeyboardAvoidingView, useWindowDimensions 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { globalStyles, formStyles, COLORS } from '../styles/GlobalStyles';

const API_URL = 'http://152.42.243.179:5000/api/laporan';

export default function FormScreen({ navigation }) {
  const { width, height } = useWindowDimensions(); 

  const [ruangan, setRuangan] = useState(''); 
  const [deskripsi, setDeskripsi] = useState('');
  const [foto, setFoto] = useState(null);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const loadUserData = async () => {
      const data = await AsyncStorage.getItem('user');
      if (data) setUserData(JSON.parse(data));
    };
    loadUserData();
  }, []);

  const handleLogout = () => {
    Alert.alert('Konfirmasi Keluar', 'Apakah kamu yakin ingin keluar?', [
      { text: 'Batal', style: 'cancel' },
      { 
        text: 'Keluar', style: 'destructive',
        onPress: async () => {
          await AsyncStorage.clear();
          navigation.replace('Login');
        }
      }
    ]);
  };

  const ambilFoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') return Alert.alert('Error', 'Izin kamera dibutuhkan.');
    
    let result = await ImagePicker.launchCameraAsync({ 
      allowsEditing: false, 
      aspect: [4, 3], 
      quality: 0.7 
    });
    
    if (!result.canceled) setFoto(result.assets[0].uri);
  };

  const ambilLokasi = async () => {
    setLoading(true);
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setLoading(false);
      return Alert.alert('Error', 'Izin lokasi dibutuhkan.');
    }
    let loc = await Location.getCurrentPositionAsync({});
    setLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
    setLoading(false);
  };

  const kirimLaporan = async () => {
    if (!ruangan || !deskripsi || !foto || !location) {
      return Alert.alert('Perhatian', 'Isi semua data termasuk ruangan, foto, dan lokasi.');
    }
    
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('user_id', userData?.id || ''); 
      formData.append('ruangan', ruangan);
      formData.append('deskripsi', deskripsi);
      formData.append('latitude', location.latitude.toString());
      formData.append('longitude', location.longitude.toString());
      
      const namaFile = foto.split('/').pop();
      const match = /\.(\w+)$/.exec(namaFile);
      const tipeFile = match ? `image/${match[1]}` : `image/jpeg`;
      formData.append('foto', { uri: foto, name: namaFile, type: tipeFile });

      const token = await AsyncStorage.getItem('token');
      const response = await axios.post(API_URL, formData, { 
        headers: { 
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}` 
        }
      });

      if (response.status === 201) {
        Alert.alert('Sukses', 'Laporan berhasil dikirim!');
        setRuangan(''); 
        setDeskripsi(''); 
        setFoto(null); 
        setLocation(null);
        navigation.navigate('Riwayat Laporan'); 
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Gagal', 'Terjadi kesalahan saat mengirim.');
    } finally {
      setLoading(false);
    }
  };

  const userName = userData?.nama || 'Mahasiswa';
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=FFFFFF&color=0A2540&bold=true`;

  return (
    <View style={globalStyles.mainWrapper}>
      <View style={[
        globalStyles.topOrnament, 
        { width: width * 1.2, height: height * 0.38, top: -height * 0.1, left: -width * 0.1 }
      ]} />
      
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
      >
        <ScrollView 
          contentContainerStyle={formStyles.scrollContainer} 
          showsVerticalScrollIndicator={false} 
          keyboardShouldPersistTaps="handled"
        >
          
          <View style={formStyles.topBar}>
            <View style={formStyles.profileSection}>
              <View style={globalStyles.headerLogoWrapper}>
            <Image 
              source={require('../assets/Logo_UnivLampung.png')} 
              style={globalStyles.mainLogo}
              resizeMode="contain"
            />
              </View>
              <Image source={{ uri: avatarUrl }} style={formStyles.avatarMini} />
              <View>
                <Text style={formStyles.greetingText}>Halo,</Text>
                <Text style={formStyles.userNameText}>{userName}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={24} color={COLORS.danger} />
            </TouchableOpacity>
          </View>

          <View style={formStyles.pageTitleContainer}>
            <Text style={formStyles.title}>Lapor Fasilitas</Text>
            <Text style={formStyles.subtitle}>Bantu kampus menjadi lebih baik.</Text>
          </View>
          
          <View style={globalStyles.card}>
            
            <Text style={globalStyles.label}>NAMA RUANGAN / AREA</Text>
            <View style={globalStyles.inputContainer}>
              <Ionicons name="business-outline" size={20} color={COLORS.textGray} style={globalStyles.inputIcon} />
              <TextInput 
                style={globalStyles.input} 
                placeholder="Contoh: Ruangan H5" 
                placeholderTextColor="#94A3B8" 
                value={ruangan} 
                onChangeText={setRuangan} 
              />
            </View>

            <Text style={globalStyles.label}>DETAIL KERUSAKAN</Text>
            <View style={[globalStyles.inputContainer, formStyles.inputContainerMultiline]}>
              <Ionicons name="create-outline" size={20} color={COLORS.textGray} style={formStyles.inputIconTop} />
              <TextInput 
                style={formStyles.inputMultiline} 
                placeholder="Ceritakan detail kerusakan..." 
                placeholderTextColor="#94A3B8" 
                value={deskripsi} 
                onChangeText={setDeskripsi} 
                multiline 
              />
            </View>

            <Text style={globalStyles.label}>BUKTI FOTO</Text>
            <TouchableOpacity 
              style={[formStyles.actionButton, foto && formStyles.actionButtonActiveFoto]} 
              onPress={ambilFoto} 
              activeOpacity={0.7}
            >
              <Ionicons name={foto ? "checkmark-circle" : "camera-outline"} size={22} color={foto ? COLORS.success : COLORS.textGray} style={globalStyles.inputIcon} />
              <Text style={[formStyles.actionButtonText, foto && formStyles.actionButtonTextActiveFoto]}>
                {foto ? 'Ubah Foto' : 'Ambil Foto'}
              </Text>
            </TouchableOpacity>
            
            {foto && (
              <Image source={{ uri: foto }} style={formStyles.previewImage} resizeMode="cover" />
            )}

            <Text style={globalStyles.label}>LOKASI GPS</Text>
            <TouchableOpacity 
              style={[formStyles.actionButton, location && formStyles.actionButtonActiveLocation]} 
              onPress={ambilLokasi} 
              activeOpacity={0.7}
            >
              <Ionicons name={location ? "location" : "location-outline"} size={22} color={location ? "#C026D3" : COLORS.textGray} style={globalStyles.inputIcon} />
              <Text style={[formStyles.actionButtonText, location && formStyles.actionButtonTextActiveLocation]}>
                {location ? `${location.latitude.toFixed(5)}, ${location.longitude.toFixed(5)}` : 'Deteksi Lokasi Otomatis'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={formStyles.btnKirim} onPress={kirimLaporan} disabled={loading} activeOpacity={0.8}>
              {loading ? <ActivityIndicator color={COLORS.white} size="small" /> : (
                <View style={formStyles.btnKirimContent}>
                  <Text style={formStyles.btnKirimText}>KIRIM LAPORAN</Text>
                  <Ionicons name="paper-plane" size={18} color={COLORS.white} style={{ marginLeft: 8 }} />
                </View>
              )}
            </TouchableOpacity>
          </View>

          <View style={{ height: 60 }} />

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}