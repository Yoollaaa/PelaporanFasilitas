import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert, Image } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.2.242:5000/api/laporan';

export default function RiwayatScreen() {
  const [riwayat, setRiwayat] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRiwayat = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (!userData) {
        Alert.alert('Sesi Habis', 'Silakan login ulang untuk melihat riwayat.');
        setLoading(false);
        return;
      }
      
      const user = JSON.parse(userData);

      const response = await axios.get(`${API_URL}/user/${user.id}`);
      setRiwayat(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Gagal mengambil riwayat laporan');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRiwayat();
  }, []);

  const getStatusColor = (status) => {
    if (status === 'Pending') return '#d9534f'; // Merah
    if (status === 'Diproses') return '#f0ad4e'; // Kuning
    if (status === 'Selesai') return '#5cb85c'; // Hijau
    return '#333';
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.contentRow}>
        {/* Jika ada foto, tampilkan thumbnail-nya */}
        {item.foto_url && (
          <Image source={{ uri: item.foto_url }} style={styles.thumbnail} />
        )}
        <View style={styles.textContainer}>
          <Text style={styles.desc} numberOfLines={2}>{item.deskripsi}</Text>
          <Text style={styles.date}>
            {new Date(item.created_at).toLocaleDateString('id-ID', {
              day: 'numeric', month: 'long', year: 'numeric'
            })}
          </Text>
        </View>
      </View>
      
      <View style={styles.footerCard}>
        <Text style={[styles.status, { color: getStatusColor(item.status) }]}>
          • {item.status}
        </Text>
      </View>
    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#0F172A" style={{ flex: 1, justifyContent: 'center' }} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Riwayat Laporan Saya</Text>
      
      {riwayat.length === 0 ? (
        <Text style={styles.emptyText}>Belum ada fasilitas rusak yang kamu laporkan.</Text>
      ) : (
        <FlatList
          data={riwayat}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F8FAFC', 
    padding: 15,
    paddingTop: 40 
  },
  header: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    marginBottom: 20, 
    textAlign: 'center', 
    color: '#0F172A' 
  },
  card: { 
    backgroundColor: '#fff', 
    padding: 15, 
    borderRadius: 12, 
    marginBottom: 15, 
    shadowColor: '#CBD5E1', 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.2, 
    shadowRadius: 8, 
    elevation: 3 
  },
  contentRow: { 
    flexDirection: 'row', 
    marginBottom: 12 
  },
  thumbnail: { 
    width: 65, 
    height: 65, 
    borderRadius: 8, 
    marginRight: 12, 
    backgroundColor: '#E2E8F0' 
  },
  textContainer: { 
    flex: 1, 
    justifyContent: 'center' 
  },
  desc: { 
    fontSize: 15, 
    color: '#334155', 
    fontWeight: '600', 
    marginBottom: 6,
    lineHeight: 22
  },
  date: { 
    fontSize: 12, 
    color: '#94A3B8' 
  },
  footerCard: { 
    borderTopWidth: 1, 
    borderTopColor: '#F1F5F9', 
    paddingTop: 12, 
    alignItems: 'flex-start' 
  },
  status: { 
    fontSize: 13, 
    fontWeight: 'bold' 
  },
  emptyText: { 
    textAlign: 'center', 
    fontSize: 15, 
    color: '#64748B', 
    marginTop: 40 
  }
});