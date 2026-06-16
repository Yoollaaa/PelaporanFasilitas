import React, { useState } from 'react';
import { 
  Text, View, TextInput, TouchableOpacity, Alert, 
  ScrollView, KeyboardAvoidingView, Platform, Image 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { globalStyles, authStyles, COLORS } from '../styles/GlobalStyles'; 

export default function AdminRegisterScreen({ navigation }) {
  const [form, setForm] = useState({ nama: '', npm: '', email: '', password: '', adminKey: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!form.nama || !form.npm || !form.email || !form.password || !form.adminKey) {
      return Alert.alert('Perhatian', 'Semua kolom wajib diisi!');
    }

    setLoading(true);
    try {
      const response = await axios.post('http://152.42.243.179:5000/api/auth/register-admin', {
        nama: form.nama,
        nip: form.npm, 
        email: form.email.trim().toLowerCase(),
        password: form.password,
        secretCode: form.adminKey 
      });
      
      Alert.alert('Sukses', 'Akun Staf Sarpras Berhasil Dibuat!', [
        { text: 'Lanjut Login', onPress: () => navigation.navigate('Login') }
      ]);

    } catch (error) {
      console.error(error);
      if (error.response) {
        const pesanDariServer = error.response.data.message || error.response.data.error || 'Terjadi kesalahan pada data yang dikirim.';
        Alert.alert('Pendaftaran Ditolak', pesanDariServer);
      } else if (error.request) {
        Alert.alert('Gagal Terhubung', 'Server tidak merespon. Pastikan koneksi internet lancar atau server sedang aktif.');
      } else {
        Alert.alert('Error Sistem', error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={globalStyles.mainWrapper} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={globalStyles.topOrnament} />

      <ScrollView 
        contentContainerStyle={authStyles.scrollContainer} 
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={authStyles.headerContainer}>
          <View style={globalStyles.mainLogoWrapper}>
            <Image 
              source={require('../assets/Logo_UnivLampung.png')} 
              style={globalStyles.mainLogo}
              resizeMode="contain"
            />
          </View>

          <Text style={globalStyles.pageTitle}>Registrasi Staf</Text>
          <Text style={globalStyles.pageSubtitle}>Portal Pendaftaran Sarpras Universitas Lampung</Text>
        </View>

        <View style={globalStyles.card}>
          <Text style={globalStyles.label}>NAMA LENGKAP</Text>
          <View style={globalStyles.inputContainer}>
            <Ionicons name="person-outline" size={20} color={COLORS.textGray} style={globalStyles.inputIcon} />
            <TextInput 
              style={globalStyles.input} 
              placeholder="Contoh: Dr. Budi Santoso" 
              placeholderTextColor="#94A3B8" 
              onChangeText={(t) => setForm({...form, nama: t})} 
            />
          </View>

          <Text style={globalStyles.label}>NIP / ID STAF</Text>
          <View style={globalStyles.inputContainer}>
            <Ionicons name="card-outline" size={20} color={COLORS.textGray} style={globalStyles.inputIcon} />
            <TextInput 
              style={globalStyles.input} 
              placeholder="Masukkan NIP" 
              keyboardType="numeric" 
              placeholderTextColor="#94A3B8" 
              onChangeText={(t) => setForm({...form, npm: t})} 
            />
          </View>

          <Text style={globalStyles.label}>EMAIL INSTITUSI</Text>
          <View style={globalStyles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color={COLORS.textGray} style={globalStyles.inputIcon} />
            <TextInput 
              style={globalStyles.input} 
              placeholder="staff@unila.ac.id" 
              autoCapitalize="none" 
              keyboardType="email-address" 
              placeholderTextColor="#94A3B8" 
              onChangeText={(t) => setForm({...form, email: t})} 
            />
          </View>

          <Text style={globalStyles.label}>KATA SANDI</Text>
          <View style={globalStyles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color={COLORS.textGray} style={globalStyles.inputIcon} />
            <TextInput 
              style={globalStyles.input} 
              placeholder="Minimal 6 karakter" 
              secureTextEntry={!showPassword} 
              placeholderTextColor="#94A3B8" 
              onChangeText={(t) => setForm({...form, password: t})} 
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={authStyles.eyeIcon}>
              <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color={COLORS.textGray} />
            </TouchableOpacity>
          </View>

          <Text style={globalStyles.label}>KODE RAHASIA ADMIN</Text>
          <View style={[globalStyles.inputContainer, authStyles.secretInput]}>
            <Ionicons name="key-outline" size={20} color={COLORS.unilaGold} style={globalStyles.inputIcon} />
            <TextInput 
              style={globalStyles.input} 
              placeholder="Kode verifikasi khusus staf" 
              secureTextEntry 
              placeholderTextColor="#94A3B8" 
              onChangeText={(t) => setForm({...form, adminKey: t})} 
            />
          </View>
          
          <TouchableOpacity 
            style={[globalStyles.btnPrimary, authStyles.btnGold]} 
            onPress={handleRegister} 
            activeOpacity={0.8}
            disabled={loading}
          >
            <Text style={authStyles.btnGoldText}>DAFTARKAN AKUN ADMIN</Text>
            <Ionicons name="arrow-forward" size={20} color={COLORS.primary} style={{ marginLeft: 8 }} />
          </TouchableOpacity>

          <View style={authStyles.footer}>
            <Text style={authStyles.footerText}>Sudah punya akun staf? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={authStyles.loginLink}>Masuk di sini</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}