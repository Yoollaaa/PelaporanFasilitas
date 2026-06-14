import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';

const API_URL = 'http://192.168.2.242:5000/api/laporan'; 

export default function AdminDashboardScreen() {
  const [laporan, setLaporan] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLaporan = async () => {
    try {
      const response = await axios.get(API_URL);
      setLaporan(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Gagal mengambil data laporan');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLaporan();
  }, []);

  const updateStatus = async (id, statusBaru) => {
    try {
      await axios.patch(`${API_URL}/${id}/status`, { status: statusBaru });
      Alert.alert('Sukses', `Status berhasil diubah menjadi ${statusBaru}`);
      fetchLaporan(); 
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Gagal mengubah status');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>Pelapor: {item.nama_pelapor}</Text>
      <Text style={styles.desc}>{item.deskripsi}</Text>
      <Text style={styles.status}>Status Saat Ini: {item.status}</Text>
      
      <View style={styles.buttonContainer}>
        {item.status === 'Pending' && (
          <TouchableOpacity style={[styles.button, styles.btnProses]} onPress={() => updateStatus(item.id, 'Diproses')}>
            <Text style={styles.buttonText}>Proses Perbaikan</Text>
          </TouchableOpacity>
        )}
        {item.status === 'Diproses' && (
          <TouchableOpacity style={[styles.button, styles.btnSelesai]} onPress={() => updateStatus(item.id, 'Selesai')}>
            <Text style={styles.buttonText}>Tandai Selesai</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={{ flex: 1 }} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Dashboard Sarpras Unila</Text>
      <FlatList
        data={laporan}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f4f4', padding: 15 },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 15, textAlign: 'center', color: '#333' },
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 15, elevation: 3 },
  title: { fontSize: 16, fontWeight: 'bold', color: '#222' },
  desc: { fontSize: 14, color: '#555', marginVertical: 5 },
  status: { fontSize: 14, fontWeight: 'bold', color: '#d9534f', marginBottom: 10 },
  buttonContainer: { flexDirection: 'row', justifyContent: 'flex-start' },
  button: { padding: 10, borderRadius: 5, marginTop: 5 },
  btnProses: { backgroundColor: '#f0ad4e' },
  btnSelesai: { backgroundColor: '#5cb85c' },
  buttonText: { color: '#fff', fontWeight: 'bold', textAlign: 'center' }
});