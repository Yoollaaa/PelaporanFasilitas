import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, Text, View, FlatList, TouchableOpacity, Image,
  Alert, ActivityIndicator, Dimensions, RefreshControl
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');
const API_URL = 'http://167.172.66.214:5000/api/laporan';
const BASE_URL = 'http://167.172.66.214:5000/'; 

export default function AdminDashboardScreen({ navigation }) {
  const [laporan, setLaporan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchLaporan = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setLaporan(response.data.data || response.data);
    } catch (error) {
      console.error(error);
      Alert.alert('Gagal', 'Tidak dapat mengambil data laporan dari server.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLaporan();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchLaporan();
  };

  const handleLogout = () => {
    Alert.alert(
      'Konfirmasi Keluar',
      'Apakah kamu yakin ingin keluar dari portal Admin?',
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

  const updateStatus = async (id, statusBaru) => {
    try {
      const token = await AsyncStorage.getItem('token');
      
      await axios.patch(`${API_URL}/${id}/status`, 
        { status: statusBaru }, 
        { headers: { Authorization: `Bearer ${token}` } } 
      );
      
      Alert.alert('Sukses ', `Status laporan berhasil diperbarui menjadi: ${statusBaru}`);
      fetchLaporan(); 
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Gagal mengubah status laporan ke server.');
    }
  };

  const renderItem = ({ item }) => {
    let statusColor = '#EAB308'; 
    let statusBg = '#FEF9C3';
    if (item.status === 'Diproses') { statusColor = '#3B82F6'; statusBg = '#DBEAFE'; }
    if (item.status === 'Selesai') { statusColor = '#10B981'; statusBg = '#D1FAE5'; }

    let imageUrl = null;
    if (item.foto) {
      imageUrl = item.foto.startsWith('http') 
        ? item.foto 
        : `${BASE_URL}${item.foto.replace(/\\/g, '/')}`;
      
      console.log(`[Cek Foto #${item.id}]:`, imageUrl);
    }

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.reporterInfo}>
            <Ionicons name="person-circle" size={36} color="#94A3B8" />
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.reporterName}>{item.nama_pelapor || 'Mahasiswa Anonim'}</Text>
              <Text style={styles.ticketId}>ID Laporan: #{item.id}</Text>
            </View>
          </View>
          <View style={[styles.badge, { backgroundColor: statusBg, borderColor: statusColor }]}>
            <Text style={[styles.badgeText, { color: statusColor }]}>{item.status || 'Pending'}</Text>
          </View>
        </View>

        <Text style={styles.laporanDeskripsi}>{item.deskripsi}</Text>

        {imageUrl ? (
          <Image 
            source={{ uri: imageUrl }} 
            style={styles.laporanImage} 
            resizeMode="cover"
          />
        ) : (
          <View style={styles.noImageContainer}>
            <Ionicons name="image-outline" size={24} color="#94A3B8" />
            <Text style={styles.noImageText}>Tidak ada foto / Foto gagal dimuat</Text>
          </View>
        )}

        {(item.latitude && item.longitude) && (
          <View style={styles.locationContainer}>
            <Ionicons name="location" size={14} color="#C026D3" style={{ marginRight: 4 }} />
            <Text style={styles.locationText}>{item.latitude}, {item.longitude}</Text>
          </View>
        )}

        <View style={styles.divider} />

        <View style={styles.actionContainer}>
          {(!item.status || item.status === 'Pending') && (
            <TouchableOpacity style={[styles.btnAction, styles.btnProses]} onPress={() => updateStatus(item.id, 'Diproses')} activeOpacity={0.8}>
              <Ionicons name="construct-outline" size={18} color="#FFFFFF" />
              <Text style={styles.btnActionText}>Proses Perbaikan</Text>
            </TouchableOpacity>
          )}
          
          {item.status === 'Diproses' && (
            <TouchableOpacity style={[styles.btnAction, styles.btnSelesai]} onPress={() => updateStatus(item.id, 'Selesai')} activeOpacity={0.8}>
              <Ionicons name="checkmark-done-outline" size={18} color="#FFFFFF" />
              <Text style={styles.btnActionText}>Tandai Selesai</Text>
            </TouchableOpacity>
          )}

          {item.status === 'Selesai' && (
            <View style={styles.finishedContainer}>
              <Ionicons name="shield-checkmark" size={18} color="#10B981" />
              <Text style={styles.finishedText}>Fasilitas Telah Diperbaiki</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.mainWrapper}>
      <View style={styles.topOrnament} />

      <View style={styles.container}>
        <View style={styles.headerWrapper}>
          <View style={styles.headerLeft}>
            <View style={styles.logoContainer}>
              <Ionicons name="folder-open" size={28} color="#FFFFFF" />
            </View>
            <View>
              <Text style={styles.title}>Dashboard Sarpras</Text>
              <Text style={styles.subtitle}>Kelola laporan masuk</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.btnLogout} onPress={handleLogout} activeOpacity={0.7}>
            <Ionicons name="log-out-outline" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.centerLoading}>
            <ActivityIndicator size="large" color="#0A2540" />
          </View>
        ) : (
          <FlatList
            data={laporan}
            keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#0A2540']} />
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="checkmark-done-circle-outline" size={60} color="#94A3B8" />
                <Text style={styles.emptyText}>Belum ada laporan kerusakan.</Text>
              </View>
            }
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainWrapper: { flex: 1, backgroundColor: '#F4F7FC' },
  topOrnament: {
    position: 'absolute', top: -height * 0.15, left: -width * 0.1,
    width: width * 1.2, height: height * 0.35, backgroundColor: '#0A2540',
    transform: [{ rotate: '-5deg' }], borderBottomLeftRadius: 60, borderBottomRightRadius: 120,
  },
  container: { flex: 1, paddingTop: 60 },
  headerWrapper: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, marginBottom: 20 },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  logoContainer: { backgroundColor: 'rgba(255, 255, 255, 0.2)', padding: 12, borderRadius: 16, marginRight: 14, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.3)' },
  title: { fontSize: 22, fontWeight: '900', color: '#FFFFFF' },
  subtitle: { fontSize: 13, color: '#D1D5DB' },
  btnLogout: { backgroundColor: 'rgba(255, 255, 255, 0.15)', padding: 10, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.3)' },
  
  listContainer: { paddingVertical: 10, paddingBottom: 40 },
  
  card: { 
    backgroundColor: '#FFFFFF', 
    borderRadius: 20, 
    padding: 20, 
    marginHorizontal: 24, 
    marginBottom: 20,
    shadowColor: '#000', 
    shadowOpacity: 0.08, 
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4, 
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  reporterInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  reporterName: { fontSize: 15, fontWeight: '800', color: '#0F172A' },
  ticketId: { fontSize: 12, color: '#64748B', fontWeight: '600', marginTop: 2 },
  badge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, borderWidth: 1, marginLeft: 10 },
  badgeText: { fontSize: 11, fontWeight: '800', textTransform: 'uppercase' },
  
  laporanDeskripsi: { fontSize: 15, color: '#334155', lineHeight: 22, fontWeight: '500', marginBottom: 12 },
  
  laporanImage: { width: '100%', height: 180, borderRadius: 12, marginBottom: 12, backgroundColor: '#F1F5F9', borderWidth: 1, borderColor: '#E2E8F0' },
  noImageContainer: { width: '100%', height: 100, borderRadius: 12, marginBottom: 12, backgroundColor: '#F1F5F9', borderWidth: 1, borderColor: '#E2E8F0', justifyContent: 'center', alignItems: 'center', borderStyle: 'dashed' },
  noImageText: { fontSize: 13, color: '#94A3B8', marginTop: 8, fontWeight: '500' },
  
  locationContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FDF4FF', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 8, alignSelf: 'flex-start' },
  locationText: { fontSize: 11, fontWeight: '700', color: '#A21CAF' },
  
  divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 16 },
  
  actionContainer: { flexDirection: 'row', justifyContent: 'flex-end' },
  btnAction: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 12, elevation: 2 },
  btnProses: { backgroundColor: '#F59E0B' },
  btnSelesai: { backgroundColor: '#10B981' },
  btnActionText: { color: '#FFFFFF', fontWeight: '800', fontSize: 14, marginLeft: 8 },
  
  finishedContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0FDF4', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 12, borderWidth: 1, borderColor: '#A7F3D0' },
  finishedText: { color: '#10B981', fontWeight: '800', fontSize: 13, marginLeft: 6 },
  
  centerLoading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyContainer: { alignItems: 'center', marginTop: 80 },
  emptyText: { marginTop: 16, fontSize: 15, color: '#94A3B8', fontWeight: '500' }
});