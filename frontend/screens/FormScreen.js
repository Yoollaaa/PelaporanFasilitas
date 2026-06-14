import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ScrollView, Image, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function FormScreen({ navigation }) { 
  const [deskripsi, setDeskripsi] = useState('');
  const [foto, setFoto] = useState(null);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          const user = JSON.parse(userData);
          setUserId(user.id);
        }
      } catch (e) {
        console.error('Gagal memuat data user:', e);
      }
    };
    fetchUser();
  }, []);

  const ambilFoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Izin Ditolak', 'Aplikasi membutuhkan izin kamera.');
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7, 
    });

    if (!result.canceled) {
      setFoto(result.assets[0].uri);
    }
  };

  const ambilLokasi = async () => {
    setLoading(true);
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setLoading(false);
      Alert.alert('Izin Ditolak', 'Aplikasi membutuhkan izin lokasi.');
      return;
    }

    let currentPosition = await Location.getCurrentPositionAsync({});
    setLocation({
      latitude: currentPosition.coords.latitude,
      longitude: currentPosition.coords.longitude,
    });
    setLoading(false);
  };

  const kirimLaporan = async () => {
    if (!deskripsi || !foto || !location) {
      Alert.alert('Data Belum Lengkap', 'Pastikan deskripsi, foto fasilitas, dan lokasi GPS sudah terisi.');
      return;
    }

    if (!userId) {
      Alert.alert('Sesi Berakhir', 'Gagal mengenali user. Silakan login ulang.');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('user_id', userId); 
    formData.append('deskripsi', deskripsi);
    formData.append('latitude', location.latitude.toString());
    formData.append('longitude', location.longitude.toString());
    
    const namaFile = foto.split('/').pop();
    const match = /\.(\w+)$/.exec(namaFile);
    const tipeFile = match ? `image/${match[1]}` : `image/jpeg`;
    
    formData.append('foto', {
      uri: foto,
      name: namaFile,
      type: tipeFile,
    });

    try {
      const response = await axios.post('http://192.168.2.242:5000/api/laporan', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.status === 201) {
        Alert.alert('Sukses 🎉', 'Laporan kerusakan fasilitas berhasil dikirim!');
        setDeskripsi('');
        setFoto(null);
        setLocation(null);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Gagal', 'Terjadi kesalahan saat mengirim laporan ke server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Lapor Fasilitas</Text>
        <Text style={styles.subtitle}>Bantu Unila menjadi lebih baik dengan melaporkan fasilitas yang rusak di sekitarmu.</Text>
      </View>
      
      <View style={styles.card}>
        <Text style={styles.label}>Apa yang rusak?</Text>
        <TextInput
          style={styles.input}
          placeholder="Contoh: AC Ruang Kuliah 3.1 Gedung H meneteskan air..."
          placeholderTextColor="#94A3B8"
          value={deskripsi}
          onChangeText={setDeskripsi}
          multiline
        />

        <Text style={styles.label}>Bukti Foto</Text>
        <TouchableOpacity style={styles.btnMedia} onPress={ambilFoto} activeOpacity={0.7}>
          <Text style={styles.btnText}>{foto ? '📸 Ganti Foto' : '📸 Ambil Foto Kamera'}</Text>
        </TouchableOpacity>
        {foto && <Image source={{ uri: foto }} style={styles.previewImage} />}

        <Text style={styles.label}>Lokasi Saat Ini</Text>
        <TouchableOpacity style={styles.btnMediaLocation} onPress={ambilLokasi} activeOpacity={0.7}>
          <Text style={styles.btnTextLocation}>📍 Deteksi Titik GPS</Text>
        </TouchableOpacity>
        
        {location && (
          <View style={styles.locationBox}>
            <Text style={styles.locationText}>Lat:  {location.latitude}</Text>
            <Text style={styles.locationText}>Long: {location.longitude}</Text>
          </View>
        )}
      </View>

      <TouchableOpacity style={styles.btnKirim} onPress={kirimLaporan} disabled={loading} activeOpacity={0.8}>
        {loading ? <ActivityIndicator color="#fff" size="small" /> : <Text style={styles.btnKirimText}>KIRIM LAPORAN</Text>}
      </TouchableOpacity>

      <TouchableOpacity style={styles.btnRiwayat} onPress={() => navigation.navigate('Riwayat')} activeOpacity={0.8}>
        <Text style={styles.btnRiwayatText}>📄 Lihat Riwayat Saya</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#F8FAFC', padding: 24, paddingBottom: 40 },
  headerContainer: { marginBottom: 24, marginTop: 40 },
  title: { fontSize: 32, fontWeight: '800', color: '#0F172A', letterSpacing: -0.5 },
  subtitle: { fontSize: 15, color: '#64748B', marginTop: 8, lineHeight: 22 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 24, shadowColor: '#CBD5E1', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 4, marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '700', color: '#334155', marginBottom: 8, marginTop: 12 },
  input: { backgroundColor: '#F1F5F9', borderRadius: 14, padding: 16, fontSize: 15, color: '#0F172A', borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 12, minHeight: 100, textAlignVertical: 'top' },
  btnMedia: { backgroundColor: '#E2E8F0', padding: 16, borderRadius: 12, alignItems: 'center', marginBottom: 12 },
  btnText: { color: '#334155', fontWeight: 'bold' },
  previewImage: { width: '100%', height: 200, borderRadius: 12, marginBottom: 12, resizeMode: 'cover' },
  btnMediaLocation: { backgroundColor: '#DBEAFE', padding: 16, borderRadius: 12, alignItems: 'center', marginBottom: 12 },
  btnTextLocation: { color: '#1D4ED8', fontWeight: 'bold' },
  locationBox: { backgroundColor: '#F8FAFC', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#E2E8F0', marginTop: 8 },
  locationText: { color: '#64748B', fontSize: 13, fontFamily: 'monospace' },
  btnKirim: { backgroundColor: '#0F172A', padding: 18, borderRadius: 16, alignItems: 'center', elevation: 3 },
  btnKirimText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold', letterSpacing: 1 },
  btnRiwayat: { backgroundColor: '#E2E8F0', padding: 18, borderRadius: 16, alignItems: 'center', marginTop: 12 },
  btnRiwayatText: { color: '#0F172A', fontSize: 16, fontWeight: 'bold' }
});