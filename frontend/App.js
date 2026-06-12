import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, ScrollView, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import axios from 'axios';

export default function App() {
  const [deskripsi, setDeskripsi] = useState('');
  const [foto, setFoto] = useState(null);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);

  // 1. Fungsi Akses Kamera HP
  const ambilFoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Izin Ditolak', 'Aplikasi membutuhkan izin kamera untuk memfoto fasilitas rusak.');
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

  // 2. Fungsi Deteksi Koordinat GPS
  const ambilLokasi = async () => {
    setLoading(true);
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setLoading(false);
      Alert.alert('Izin Ditolak', 'Aplikasi membutuhkan izin lokasi untuk menandai fasilitas.');
      return;
    }

    let currentPosition = await Location.getCurrentPositionAsync({});
    setLocation({
      latitude: currentPosition.coords.latitude,
      longitude: currentPosition.coords.longitude,
    });
    setLoading(false);
  };

  // 3. Fungsi Kirim Laporan ke Backend
  const kirimLaporan = async () => {
    if (!deskripsi || !foto || !location) {
      Alert.alert('Data Belum Lengkap', 'Pastikan deskripsi, foto fasilitas, dan lokasi GPS sudah terisi.');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('user_id', '29fa34da-fe65-4668-aa9c-2ea5ddefba63'); 
    formData.append('deskripsi', deskripsi);
    formData.append('latitude', location.latitude.toString());
    formData.append('longitude', location.longitude.toString());
    
    // Konfigurasi file gambar untuk multipart/form-data
    const namaFile = foto.split('/').pop();
    const match = /\.(\w+)$/.exec(namaFile);
    const tipeFile = match ? `image/${match[1]}` : `image/jpeg`;
    
    formData.append('foto', {
      uri: foto,
      name: namaFile,
      type: tipeFile,
    });

    try {
      // Menggunakan IP lokal dari ipconfig agar bisa ditembak oleh Expo Go di HP
      const response = await axios.post('http://192.168.110.194:5000/api/laporan', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.status === 201) {
        Alert.alert('Sukses', 'Laporan kerusakan fasilitas berhasil dikirim!');
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
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Pelaporan Fasilitas Kampus</Text>
      
      <Text style={styles.label}>Deskripsi Kerusakan</Text>
      <TextInput
        style={styles.input}
        placeholder="Contoh: Kursi di ruang kelas lantai 2 patah"
        value={deskripsi}
        onChangeText={setDeskripsi}
        multiline
      />

      <Text style={styles.label}>Bukti Foto Fasilitas</Text>
      <TouchableOpacity style={styles.btnMedia} onPress={ambilFoto}>
        <Text style={styles.btnText}>📸 Buka Kamera HP</Text>
      </TouchableOpacity>
      {foto && <Image source={{ uri: foto }} style={styles.previewImage} />}

      <Text style={styles.label}>Lokasi Fasilitas (GPS)</Text>
      <TouchableOpacity style={styles.btnMedia} onPress={ambilLokasi}>
        <Text style={styles.btnText}>📍 Deteksi Titik Koordinat</Text>
      </TouchableOpacity>
      {location && (
        <View style={styles.locationBox}>
          <Text style={styles.locationText}>Latitude: {location.latitude}</Text>
          <Text style={styles.locationText}>Longitude: {location.longitude}</Text>
        </View>
      )}

      <TouchableOpacity style={styles.btnKirim} onPress={kirimLaporan} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnKirimText}>KIRIM LAPORAN</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingTop: 60, backgroundColor: '#f5f5f5' },
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 25, color: '#333' },
  label: { fontSize: 15, fontWeight: '600', marginBottom: 8, marginTop: 15, color: '#555' },
  input: { backgroundColor: '#fff', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#ddd', height: 80, textAlignVertical: 'top' },
  btnMedia: { backgroundColor: '#e0e0e0', padding: 12, borderRadius: 8, alignItems: 'center', marginBottom: 10 },
  btnText: { color: '#333', fontWeight: 'bold' },
  previewImage: { width: '100%', height: 200, borderRadius: 8, marginTop: 5, marginBottom: 10 },
  locationBox: { backgroundColor: '#eaf4ff', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#b6d7ff', marginBottom: 10 },
  locationText: { color: '#0056b3', fontFamily: 'monospace' },
  btnKirim: { backgroundColor: '#1e88e5', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 30, elevation: 3 },
  btnKirimText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});