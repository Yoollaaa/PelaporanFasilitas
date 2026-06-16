import React, { useState, useEffect } from 'react';
import { 
  Text, View, FlatList, TouchableOpacity, Image,
  Alert, ActivityIndicator, Dimensions, RefreshControl, TextInput, ScrollView, Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { globalStyles, adminStyles, COLORS } from '../styles/GlobalStyles';

const API_URL = 'http://152.42.243.179:5000/api/laporan';
const BASE_URL = 'http://152.42.243.179:5000/'; 

export default function AdminDashboardScreen({ navigation }) {
  const [laporan, setLaporan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('Semua');

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [catatanAdmin, setCatatanAdmin] = useState('');

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

  const openModal = (id, statusBaru) => {
    setSelectedId(id);
    setSelectedStatus(statusBaru);
    setCatatanAdmin(''); 
    setModalVisible(true);
  };

  const submitUpdateStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      
      await axios.patch(`${API_URL}/${selectedId}/status`, 
        { 
          status: selectedStatus,
          catatan_admin: catatanAdmin 
        }, 
        { headers: { Authorization: `Bearer ${token}` } } 
      );
      
      setModalVisible(false);
      Alert.alert('Sukses', `Status laporan berhasil diperbarui menjadi: ${selectedStatus}`);
      fetchLaporan(); 
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Gagal mengubah status laporan ke server.');
    }
  };

  const renderItem = ({ item }) => {
    let statusColor = COLORS.warning || '#F59E0B'; 
    let statusBg = COLORS.warningBg || '#FEF9C3';
    
    if (item.status === 'Diproses') { 
      statusColor = COLORS.info || '#3B82F6'; 
      statusBg = COLORS.infoBg || '#DBEAFE'; 
    }
    if (item.status === 'Selesai') { 
      statusColor = COLORS.success || '#10B981'; 
      statusBg = COLORS.successBg || '#D1FAE5'; 
    }

    let imageUrl = null;
    if (item.foto) {
      if (item.foto.startsWith('http')) {
        imageUrl = item.foto;
      } else {
        const cleanPath = item.foto.replace(/\\/g, '/').replace(/^uploads\//, '');
        imageUrl = `${BASE_URL}uploads/${cleanPath}`;
      }
    }

    return (
      <View style={adminStyles.card}>
        <View style={adminStyles.cardHeader}>
          <View style={adminStyles.reporterInfo}>
            <Ionicons name="person-circle" size={36} color="#94A3B8" />
            <View style={{ marginLeft: 10 }}>
              <Text style={adminStyles.reporterName}>{item.nama_pelapor || 'Mahasiswa Anonim'}</Text>
              <Text style={adminStyles.ticketId}>ID Laporan: #{item.id}</Text>
            </View>
          </View>
          <View style={[adminStyles.badge, { backgroundColor: statusBg, borderColor: statusColor }]}>
            <Text style={[adminStyles.badgeText, { color: statusColor }]}>{item.status || 'Pending'}</Text>
          </View>
        </View>

        {item.ruangan && (
          <View style={adminStyles.ruanganContainer}>
            <Ionicons name="business" size={14} color={COLORS.info} style={{ marginRight: 4 }} />
            <Text style={adminStyles.ruanganText}>Lokasi: {item.ruangan}</Text>
          </View>
        )}

        <Text style={adminStyles.laporanDeskripsi}>{item.deskripsi}</Text>

        {imageUrl ? (
          <Image 
            source={{ uri: imageUrl }} 
            style={adminStyles.laporanImage} 
            resizeMode="cover"
          />
        ) : (
          <View style={adminStyles.noImageContainer}>
            <Ionicons name="image-outline" size={24} color="#94A3B8" />
            <Text style={adminStyles.noImageText}>Tidak ada foto / Foto gagal dimuat</Text>
          </View>
        )}

        {(item.latitude && item.longitude) && (
          <View style={adminStyles.locationContainer}>
            <Ionicons name="location" size={14} color="#C026D3" style={{ marginRight: 4 }} />
            <Text style={adminStyles.locationText}>{item.latitude}, {item.longitude}</Text>
          </View>
        )}

        {item.catatan_admin && (
          <View style={adminStyles.catatanBox}>
            <Ionicons name="chatbox-ellipses-outline" size={16} color={COLORS.textGray} style={{ marginRight: 6 }} />
            <View style={{ flex: 1 }}>
              <Text style={adminStyles.catatanTitle}>Catatan Admin:</Text>
              <Text style={adminStyles.catatanText}>{item.catatan_admin}</Text>
            </View>
          </View>
        )}

        <View style={adminStyles.divider} />

        <View style={adminStyles.actionContainer}>
          {(!item.status || item.status === 'Pending') && (
            <TouchableOpacity style={[adminStyles.btnAction, adminStyles.btnProses]} onPress={() => openModal(item.id, 'Diproses')} activeOpacity={0.8}>
              <Ionicons name="construct-outline" size={18} color="#FFFFFF" />
              <Text style={adminStyles.btnActionText}>Proses Perbaikan</Text>
            </TouchableOpacity>
          )}
          
          {item.status === 'Diproses' && (
            <TouchableOpacity style={[adminStyles.btnAction, adminStyles.btnSelesai]} onPress={() => openModal(item.id, 'Selesai')} activeOpacity={0.8}>
              <Ionicons name="checkmark-done-outline" size={18} color="#FFFFFF" />
              <Text style={adminStyles.btnActionText}>Tandai Selesai</Text>
            </TouchableOpacity>
          )}

          {item.status === 'Selesai' && (
            <View style={adminStyles.finishedContainer}>
              <Ionicons name="shield-checkmark" size={18} color={COLORS.success} />
              <Text style={adminStyles.finishedText}>Fasilitas Telah Diperbaiki</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  const laporanTersaring = laporan.filter((item) => {
    const matchStatus = filterStatus === 'Semua' || item.status === filterStatus;    
    const kataKunci = searchQuery.toLowerCase();
    const ruanganMatch = item.ruangan?.toLowerCase().includes(kataKunci) || false;
    const deskripsiMatch = item.deskripsi?.toLowerCase().includes(kataKunci) || false;
    return matchStatus && (ruanganMatch || deskripsiMatch);
  });

  return (
    <View style={globalStyles.mainWrapper}>
      <View style={globalStyles.topOrnament} />

      <View style={globalStyles.container}>
        <View style={adminStyles.headerWrapper}>
          <View style={adminStyles.headerLeft}>
            <View style={globalStyles.headerLogoWrapper}>
              <Image 
                source={require('../assets/Logo_UnivLampung.png')} 
                style={globalStyles.mainLogo}
                resizeMode="contain"
              />
            </View>
            <View>
              <Text style={adminStyles.title}>Dashboard Sarpras</Text>
              <Text style={adminStyles.subtitle}>Kelola laporan masuk</Text>
            </View>
          </View>
          <TouchableOpacity style={adminStyles.btnLogout} onPress={handleLogout} activeOpacity={0.7}>
            <Ionicons name="log-out-outline" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={adminStyles.searchContainer}>
          <TextInput
            style={adminStyles.searchInput}
            placeholder="Cari nama ruangan atau keluhan..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <View style={adminStyles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {['Semua', 'Pending', 'Diproses', 'Selesai'].map((status) => (
              <TouchableOpacity
                key={status}
                style={[
                  adminStyles.filterButton,
                  filterStatus === status && adminStyles.filterButtonActive
                ]}
                onPress={() => setFilterStatus(status)}
              >
                <Text style={[
                  adminStyles.filterText,
                  filterStatus === status && adminStyles.filterTextActive
                ]}>
                  {status}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {loading ? (
          <View style={adminStyles.centerLoading}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        ) : (
          <FlatList
            data={laporanTersaring}
            keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={adminStyles.listContainer}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />
            }
            ListEmptyComponent={
              <View style={adminStyles.emptyContainer}>
                <Ionicons name="checkmark-done-circle-outline" size={60} color="#94A3B8" />
                <Text style={adminStyles.emptyText}>Belum ada laporan atau tidak ditemukan.</Text>
              </View>
            }
          />
        )}
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={adminStyles.modalOverlay}>
          <View style={adminStyles.modalContent}>
            <View style={adminStyles.modalHeader}>
              <Text style={adminStyles.modalTitle}>Update ke: {selectedStatus}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={COLORS.textDark} />
              </TouchableOpacity>
            </View>
            
            <Text style={adminStyles.modalSubtitle}>
              Tambahkan catatan untuk mahasiswa mengenai laporan ini (opsional).
            </Text>
            
            <TextInput
              style={adminStyles.modalInput}
              placeholder="Contoh: Suku cadang AC sedang dipesan..."
              placeholderTextColor="#94A3B8"
              multiline
              numberOfLines={3}
              value={catatanAdmin}
              onChangeText={setCatatanAdmin}
              textAlignVertical="top"
            />
            
            <TouchableOpacity style={adminStyles.btnSimpan} onPress={submitUpdateStatus}>
              <Text style={adminStyles.btnSimpanText}>Simpan & Perbarui</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}