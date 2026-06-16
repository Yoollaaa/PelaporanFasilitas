import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, Text, View, TextInput, TouchableOpacity, Image, 
  ScrollView, Alert, ActivityIndicator, Platform, KeyboardAvoidingView, useWindowDimensions 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
    let result = await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [4, 3], quality: 0.7 });
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
        Alert.alert('Sukses ', 'Laporan berhasil dikirim!');
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
    <View style={[styles.mainWrapper, { overflow: 'hidden' }]}>
      <View style={[
        styles.topOrnament, 
        { 
          width: width * 1.2, 
          height: height * 0.38, 
          top: -height * 0.1, 
          left: -width * 0.1 
        }
      ]} />
      
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView 
          contentContainerStyle={styles.container} 
          showsVerticalScrollIndicator={false} 
          keyboardShouldPersistTaps="handled"
        >
          
          <View style={styles.topBar}>
            <View style={styles.profileSection}>
              <Image source={{ uri: avatarUrl }} style={styles.avatarMini} />
              <View>
                <Text style={styles.greetingText}>Halo,</Text>
                <Text style={styles.userNameText}>{userName}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={24} color="#EF4444" />
            </TouchableOpacity>
          </View>

          <View style={styles.pageTitleContainer}>
            <Text style={styles.title}>Lapor Fasilitas</Text>
            <Text style={styles.subtitle}>Bantu kampus menjadi lebih baik.</Text>
          </View>
          
          <View style={styles.card}>
            
            <Text style={styles.label}>Nama Ruangan / Area</Text>
            <View style={[styles.inputContainer, { height: 50 }]}>
              <Ionicons name="business-outline" size={20} color="#94A3B8" style={styles.inputIcon} />
              <TextInput 
                style={styles.input} 
                placeholder="Contoh: Ruangan H5" 
                placeholderTextColor="#94A3B8" 
                value={ruangan} 
                onChangeText={setRuangan} 
              />
            </View>

            <Text style={styles.label}>Detail Kerusakan</Text>
            <View style={[styles.inputContainer, styles.inputContainerMultiline]}>
              <Ionicons name="create-outline" size={20} color="#94A3B8" style={styles.inputIconTop} />
              <TextInput 
                style={styles.inputMultiline} 
                placeholder="Ceritakan detail kerusakan..." 
                placeholderTextColor="#94A3B8" 
                value={deskripsi} 
                onChangeText={setDeskripsi} 
                multiline 
              />
            </View>

            <Text style={styles.label}>Bukti Foto</Text>
            <TouchableOpacity style={[styles.actionButton, foto && styles.actionButtonActiveFoto]} onPress={ambilFoto} activeOpacity={0.7}>
              <Ionicons name={foto ? "checkmark-circle" : "camera-outline"} size={22} color={foto ? "#10B981" : "#94A3B8"} style={styles.inputIcon} />
              <Text style={[styles.actionButtonText, foto && styles.actionButtonTextActiveFoto]}>{foto ? 'Ubah Foto' : 'Ambil Foto'}</Text>
            </TouchableOpacity>
            
            {foto && (
              <Image source={{ uri: foto }} style={styles.previewImage} resizeMode="cover" />
            )}

            <Text style={styles.label}>Lokasi GPS</Text>
            <TouchableOpacity style={[styles.actionButton, location && styles.actionButtonActiveLocation]} onPress={ambilLokasi} activeOpacity={0.7}>
              <Ionicons name={location ? "location" : "location-outline"} size={22} color={location ? "#C026D3" : "#94A3B8"} style={styles.inputIcon} />
              <Text style={[styles.actionButtonText, location && styles.actionButtonTextActiveLocation]}>
                {location ? `${location.latitude}, ${location.longitude}` : 'Deteksi Lokasi Otomatis'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btnKirim} onPress={kirimLaporan} disabled={loading} activeOpacity={0.8}>
              {loading ? <ActivityIndicator color="#fff" size="small" /> : (
                <View style={styles.btnKirimContent}>
                  <Text style={styles.btnKirimText}>KIRIM LAPORAN</Text>
                  <Ionicons name="paper-plane" size={18} color="#FFFFFF" style={{ marginLeft: 8 }} />
                </View>
              )}
            </TouchableOpacity>
          </View>

          <View style={{ height: 120, width: '100%' }} />

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainWrapper: { flex: 1, backgroundColor: '#F4F7FC' },
  
  topOrnament: { 
    position: 'absolute', 
    backgroundColor: '#0A2540', 
    transform: [{ rotate: '-5deg' }], 
    borderBottomLeftRadius: 60, 
    borderBottomRightRadius: 120 
  },
  
  container: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 60, paddingBottom: 20 },
  
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 },
  profileSection: { flexDirection: 'row', alignItems: 'center' },
  avatarMini: { width: 44, height: 44, borderRadius: 22, marginRight: 12, borderWidth: 2, borderColor: 'rgba(255, 255, 255, 0.8)' },
  greetingText: { fontSize: 13, color: '#93C5FD', fontWeight: '600' },
  userNameText: { fontSize: 16, color: '#FFFFFF', fontWeight: '800' },
  
  pageTitleContainer: { marginBottom: 32 },
  title: { fontSize: 28, fontWeight: '900', color: '#FFFFFF', marginBottom: 6 },
  subtitle: { fontSize: 14, color: '#D1D5DB' },
  
  card: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 24, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 20, elevation: 8, marginBottom: 10 },
  label: { fontSize: 12, fontWeight: '800', color: '#475569', marginBottom: 8, marginTop: 16, textTransform: 'uppercase' },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', borderWidth: 1.5, borderColor: '#E2E8F0', borderRadius: 16, paddingHorizontal: 16 },
  inputContainerMultiline: { height: 100, alignItems: 'flex-start', paddingVertical: 12 },
  inputIconTop: { marginRight: 10, marginTop: 4 },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, color: '#0F172A', height: '100%' },
  inputMultiline: { flex: 1, fontSize: 15, color: '#0F172A', textAlignVertical: 'top' },
  
  actionButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', borderWidth: 1.5, borderColor: '#E2E8F0', borderRadius: 16, paddingHorizontal: 16, height: 54, marginBottom: 8 },
  actionButtonActiveFoto: { backgroundColor: '#ECFDF5', borderColor: '#A7F3D0' },
  actionButtonActiveLocation: { backgroundColor: '#FDF4FF', borderColor: '#F5D0FE' },
  actionButtonText: { fontSize: 14, color: '#94A3B8', fontWeight: '600', flex: 1 },
  actionButtonTextActiveFoto: { color: '#059669' },
  actionButtonTextActiveLocation: { color: '#A21CAF' },
  
  previewImage: { width: '100%', height: 180, borderRadius: 16, marginTop: 4, marginBottom: 12, borderWidth: 1.5, borderColor: '#E2E8F0' },

  btnKirim: { backgroundColor: '#0A2540', height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginTop: 24, shadowColor: '#0A2540', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 6 },
  btnKirimContent: { flexDirection: 'row', alignItems: 'center' },
  btnKirimText: { color: '#FFFFFF', fontSize: 15, fontWeight: '900', letterSpacing: 0.5 }
});