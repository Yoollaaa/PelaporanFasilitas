import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, ScrollView, Alert, ActivityIndicator, Platform } from 'react-native';import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import axios from 'axios';

export default function App() {
  const [deskripsi, setDeskripsi] = useState('');
  const [foto, setFoto] = useState(null);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);

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

    setLoading(true);

    const formData = new FormData();
    formData.append('user_id', '29fa34da-fe65-4668-aa9c-2ea5ddefba63'); 
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
      // Ingat: Ganti IP ini dengan IPv4 laptopmu jika belum
      const response = await axios.post('http://192.168.110.194:5000/api/laporan', formData, {
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
      {/* Header Section */}
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Lapor Fasilitas</Text>
        <Text style={styles.subtitle}>Bantu Unila menjadi lebih baik dengan melaporkan fasilitas yang rusak di sekitarmu.</Text>
      </View>
      
      {/* Card Form */}
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

      {/* Submit Button */}
      <TouchableOpacity style={styles.btnKirim} onPress={kirimLaporan} disabled={loading} activeOpacity={0.8}>
        {loading ? <ActivityIndicator color="#fff" size="small" /> : <Text style={styles.btnKirimText}>KIRIM LAPORAN</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flexGrow: 1, 
    backgroundColor: '#F8FAFC', // Abu-abu sangat terang untuk background
    padding: 24, 
    paddingTop: 70 
  },
  headerContainer: { 
    marginBottom: 28 
  },
  title: { 
    fontSize: 28, 
    fontWeight: '800', 
    color: '#0F172A', 
    letterSpacing: -0.5 
  },
  subtitle: { 
    fontSize: 15, 
    color: '#64748B', 
    marginTop: 6,
    lineHeight: 22
  },
  card: { 
    backgroundColor: '#FFFFFF', 
    borderRadius: 20, 
    padding: 20, 
    shadowColor: '#CBD5E1', 
    shadowOffset: { width: 0, height: 8 }, 
    shadowOpacity: 0.3, 
    shadowRadius: 12, 
    elevation: 4, 
    marginBottom: 24 
  },
  label: { 
    fontSize: 14, 
    fontWeight: '700', 
    color: '#334155', 
    marginBottom: 10,
    marginTop: 10
  },
  input: { 
    backgroundColor: '#F1F5F9', 
    borderRadius: 14, 
    padding: 16, 
    fontSize: 15, 
    color: '#0F172A', 
    minHeight: 110, 
    textAlignVertical: 'top', 
    borderWidth: 1, 
    borderColor: '#E2E8F0',
    marginBottom: 10
  },
  btnMedia: { 
    backgroundColor: '#EFF6FF', 
    padding: 16, 
    borderRadius: 14, 
    borderWidth: 1.5, 
    borderColor: '#BFDBFE', 
    alignItems: 'center', 
    marginBottom: 8 
  },
  btnText: { 
    color: '#2563EB', 
    fontWeight: '700', 
    fontSize: 15 
  },
  btnMediaLocation: {
    backgroundColor: '#FDF4FF', 
    padding: 16, 
    borderRadius: 14, 
    borderWidth: 1.5, 
    borderColor: '#F5D0FE', 
    alignItems: 'center', 
    marginBottom: 8 
  },
  btnTextLocation: {
    color: '#C026D3', 
    fontWeight: '700', 
    fontSize: 15 
  },
  previewImage: { 
    width: '100%', 
    height: 220, 
    borderRadius: 14, 
    marginTop: 8, 
    marginBottom: 16,
    borderWidth: 1, 
    borderColor: '#E2E8F0' 
  },
  locationBox: { 
    backgroundColor: '#F0FDF4', 
    padding: 14, 
    borderRadius: 12, 
    borderWidth: 1, 
    borderColor: '#BBF7D0', 
    marginTop: 4,
    marginBottom: 8
  },
  locationText: { 
    color: '#166534', 
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', 
    fontSize: 13, 
    lineHeight: 22 
  },
  btnKirim: { 
    backgroundColor: '#0F172A', 
    borderRadius: 16, 
    alignItems: 'center', 
    shadowColor: '#0F172A', 
    shadowOffset: { width: 0, height: 6 }, 
    shadowOpacity: 0.25, 
    shadowRadius: 8, 
    elevation: 5, 
    marginBottom: 40 
  },
  btnKirimText: { 
    color: '#FFFFFF', 
    fontSize: 16, 
    fontWeight: 'bold', 
    letterSpacing: 1 
  },
});