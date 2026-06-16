import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Text, View, FlatList, ActivityIndicator, Image, RefreshControl, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { globalStyles, adminStyles, historyStyles, COLORS } from '../styles/GlobalStyles';

const API_URL = 'http://152.42.243.179:5000/api/laporan';
const BASE_URL = 'http://152.42.243.179:5000/'; 

export default function RiwayatScreen() {
  const { width, height } = useWindowDimensions(); 
  const [riwayat, setRiwayat] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userData, setUserData] = useState(null);

  useFocusEffect(
    useCallback(() => {
      const fetchAwal = async () => {
        const data = await AsyncStorage.getItem('user');
        if (data) {
          const user = JSON.parse(data);
          setUserData(user);
          fetchRiwayat(user.id); 
        }
      };
      fetchAwal();
    }, [])
  );

  const fetchRiwayat = async (userId) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(`${API_URL}/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRiwayat(response.data.data || response.data);
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
    let statusColor = COLORS.warning; 
    let statusBg = COLORS.warningBg;
    let statusIcon = 'time-outline';

    if (item.status === 'Diproses') { 
      statusColor = COLORS.info; 
      statusBg = COLORS.infoBg; 
      statusIcon = 'construct-outline';
    }
    if (item.status === 'Selesai') { 
      statusColor = COLORS.success; 
      statusBg = COLORS.successBg; 
      statusIcon = 'checkmark-circle-outline';
    }

    let imageUrl = item.foto ? (item.foto.startsWith('http') ? item.foto : `${BASE_URL}uploads/${item.foto.replace(/\\/g, '/').replace(/^uploads\//, '')}`) : null;

    return (
      <View style={historyStyles.historyCard}>
        <View style={historyStyles.historyCardHeader}>
          <View style={historyStyles.idContainer}>
            <Ionicons name="receipt-outline" size={16} color={COLORS.textGray} style={{ marginRight: 6 }} />
            <Text style={historyStyles.historyId}>Laporan #{riwayat.length - index}</Text>
          </View>

          <View style={[historyStyles.statusBadge, { backgroundColor: statusBg, borderColor: statusColor }]}>
            <Ionicons name={statusIcon} size={12} color={statusColor} style={{ marginRight: 4 }} />
            <Text style={[historyStyles.statusBadgeText, { color: statusColor }]}>{item.status || 'Pending'}</Text>
          </View>
        </View>

        <View style={globalStyles.divider} />

        {item.ruangan && (
          <View style={adminStyles.ruanganContainer}>
            <Ionicons name="business" size={14} color={COLORS.info} style={{ marginRight: 4 }} />
            <Text style={adminStyles.ruanganText}>Ruangan: {item.ruangan}</Text>
          </View>
        )}

        <Text style={historyStyles.historyDesc}>{item.deskripsi}</Text>

        {imageUrl && <Image source={{ uri: imageUrl }} style={historyStyles.historyImage} resizeMode="cover" />}
      </View>
    );
  };

  return (
    <View style={globalStyles.mainWrapper}>
      <View style={[globalStyles.topOrnament, { width: width * 1.2, height: height * 0.35, top: -height * 0.15, left: -width * 0.1 }]} />
      
      <View style={globalStyles.container}>
        <View style={globalStyles.mainLogoWrapper}>
          <Image 
            source={require('../assets/Logo_UnivLampung.png')} 
            style={globalStyles.mainLogo}
            resizeMode="contain"
          />
        </View>
        
        <View style={{ marginBottom: 20 }}>
          <Text style={globalStyles.pageTitle}>Riwayatku</Text>
          <Text style={globalStyles.pageSubtitle}>Pantau status perbaikan fasilitasmu.</Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={COLORS.white} style={{ flex: 1 }} />
        ) : (
          <FlatList
            data={riwayat}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
            style={{ width: '100%' }}
            contentContainerStyle={historyStyles.listContainer}
            showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />}
            ListEmptyComponent={
              <View style={historyStyles.emptyHistory}>
                <Ionicons name="document-text-outline" size={60} color={COLORS.border} />
                <Text style={historyStyles.emptyHistoryText}>Belum ada riwayat laporan.</Text>
              </View>
            }
          />
        )}
      </View>
    </View>
  );
}