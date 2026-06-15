import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, Text, View, FlatList, ActivityIndicator, Image, 
  RefreshControl, useWindowDimensions 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://167.172.66.214:5000/api/laporan';
const BASE_URL = 'http://167.172.66.214:5000/'; 

export default function RiwayatScreen() {
  const { width, height } = useWindowDimensions(); 
  const [riwayat, setRiwayat] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchAwal = async () => {
      const data = await AsyncStorage.getItem('user');
      if (data) {
        const user = JSON.parse(data);
        setUserData(user);
        fetchRiwayat(user.id);
      }
    };
    fetchAwal();
  }, []);

  const fetchRiwayat = async (userId) => {
    try {
      const token = await AsyncStorage.getItem('token');

      const response = await axios.get(`${API_URL}/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const laporanku = response.data.data || response.data;
      setRiwayat(laporanku);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    if (userData) {
      setRefreshing(true);
      fetchRiwayat(userData.id);
    }
  };

  const renderItem = ({ item, index }) => {
    let statusColor = '#EAB308'; 
    let statusBg = '#FEF9C3';
    let statusIcon = 'time-outline';

    if (item.status === 'Diproses') { 
      statusColor = '#3B82F6'; 
      statusBg = '#DBEAFE'; 
      statusIcon = 'construct-outline';
    }
    if (item.status === 'Selesai') { 
      statusColor = '#10B981'; 
      statusBg = '#D1FAE5'; 
      statusIcon = 'checkmark-circle-outline';
    }

    let imageUrl = null;
    if (item.foto) {
      imageUrl = item.foto.startsWith('http') 
        ? item.foto 
        : `${BASE_URL}${item.foto.replace(/\\/g, '/')}`;
    }

    return (
      <View style={styles.historyCard}>
        {/* Header Kartu */}
        <View style={styles.historyCardHeader}>
          <View style={styles.idContainer}>
            <Ionicons name="receipt-outline" size={16} color="#64748B" style={{ marginRight: 6 }} />
            <Text style={styles.historyId}>Laporan #{index + 1}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusBg, borderColor: statusColor }]}>
            <Ionicons name={statusIcon} size={12} color={statusColor} style={{ marginRight: 4 }} />
            <Text style={[styles.statusBadgeText, { color: statusColor }]}>{item.status || 'Pending'}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <Text style={styles.historyDesc}>{item.deskripsi}</Text>

        {imageUrl && (
          <Image 
            source={{ uri: imageUrl }} 
            style={styles.historyImage} 
            resizeMode="cover"
          />
        )}

        {(item.latitude && item.longitude) && (
          <View style={styles.locationContainer}>
            <Ionicons name="location" size={14} color="#C026D3" style={{ marginRight: 4 }} />
            <Text style={styles.locationText}>{item.latitude}, {item.longitude}</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={[styles.mainWrapper, { overflow: 'hidden' }]}>
      <View style={[
        styles.topOrnament, 
        { 
          width: width * 1.2, 
          height: height * 0.35, 
          top: -height * 0.15, 
          left: -width * 0.1 
        }
      ]} />
      
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Riwayatku</Text>
        <Text style={styles.subtitle}>Pantau status perbaikan fasilitasmu.</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#FFFFFF" style={{ flex: 1 }} />
      ) : (
        <FlatList
          data={riwayat}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          style={{ width: '100%' }}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#0A2540']} />}
          ListEmptyComponent={
            <View style={styles.emptyHistory}>
              <Ionicons name="document-text-outline" size={60} color="#CBD5E1" />
              <Text style={styles.emptyHistoryText}>Belum ada riwayat laporan.</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mainWrapper: { flex: 1, backgroundColor: '#F4F7FC' },
  topOrnament: { 
    position: 'absolute', backgroundColor: '#0A2540', 
    transform: [{ rotate: '-5deg' }], borderBottomLeftRadius: 60, borderBottomRightRadius: 120 
  },
  headerContainer: { paddingHorizontal: 24, paddingTop: 60, paddingBottom: 20 },
  title: { fontSize: 28, fontWeight: '900', color: '#FFFFFF', marginBottom: 6 },
  subtitle: { fontSize: 14, color: '#D1D5DB' },
  
  listContainer: { paddingVertical: 10, paddingBottom: 120 },
  
  historyCard: { 
    backgroundColor: '#FFFFFF', padding: 20, borderRadius: 20, 
    marginBottom: 16, marginHorizontal: '6%', 
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, 
    shadowOffset: { width: 0, height: 4 }, elevation: 4 
  },
  
  historyCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  idContainer: { flexDirection: 'row', alignItems: 'center' },
  historyId: { fontSize: 14, fontWeight: '800', color: '#475569' },
  
  statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, borderWidth: 1, marginLeft: 10 },
  statusBadgeText: { fontSize: 11, fontWeight: '800', textTransform: 'uppercase' },
  
  divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 14 },
  historyDesc: { fontSize: 15, color: '#334155', lineHeight: 22, fontWeight: '500' },

  historyImage: { 
    width: '100%', height: 160, borderRadius: 12, 
    marginTop: 14, backgroundColor: '#F1F5F9', borderWidth: 1, borderColor: '#E2E8F0' 
  },
  locationContainer: { 
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FDF4FF', 
    paddingVertical: 6, paddingHorizontal: 10, borderRadius: 8, 
    alignSelf: 'flex-start', marginTop: 12 
  },
  locationText: { fontSize: 11, fontWeight: '700', color: '#A21CAF' },
  
  emptyHistory: { alignItems: 'center', marginTop: 100 },
  emptyHistoryText: { marginTop: 16, color: '#94A3B8', fontWeight: '500', fontSize: 15 }
});