import React, { useState } from 'react';
import { 
  Text, View, TextInput, TouchableOpacity, Alert, 
  ScrollView, KeyboardAvoidingView, Platform, Image 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { globalStyles, authStyles, COLORS } from '../styles/GlobalStyles';

export default function RegisterScreen({ navigation }) {
  const [nama, setNama] = useState('');
  const [npm, setNpm] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async () => {
    if (!nama || !npm || !email || !password) {
      return Alert.alert('Perhatian', 'Semua kolom wajib diisi!');
    }

    const emailAman = email.trim().toLowerCase();
    
    if (!emailAman.endsWith('@students.unila.ac.id')) {
      return Alert.alert(
        'Email Ditolak ❌', 
        'Pendaftaran mahasiswa wajib menggunakan email resmi institusi!'
      );
    }

    try {
      const response = await axios.post('http://152.42.243.179:5000/api/auth/register', {
        nama: nama,
        npm: npm,
        email: emailAman, 
        password: password,
      });
      
      Alert.alert('Sukses', 'Akun Mahasiswa Berhasil Dibuat!');
      navigation.navigate('Login');

    } catch (error) {
      console.log("🔴 ERROR SERVER:", error.response?.data);

      if (error.response) {
        let pesanDariServer = error.response.data.message || error.response.data.error;
        
        if (!pesanDariServer) {
          pesanDariServer = JSON.stringify(error.response.data);
        }

        Alert.alert('Pendaftaran Ditolak 🛑', `Alasan: ${pesanDariServer}`);
      } else if (error.request) {
        Alert.alert('Gagal Terhubung', 'Server tidak merespon. Pastikan PM2 di DigitalOcean sedang berjalan aktif.');
      } else {
        Alert.alert('Error Sistem', error.message);
      }
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
          <Text style={globalStyles.pageTitle}>Buat Akun</Text>
          <Text style={globalStyles.pageSubtitle}>Bergabunglah untuk mulai melaporkan fasilitas kampus.</Text>
        </View>

        <View style={globalStyles.card}>
          
          <Text style={globalStyles.label}>NAMA LENGKAP</Text>
          <View style={globalStyles.inputContainer}>
            <Ionicons name="person-outline" size={20} color={COLORS.textGray} style={globalStyles.inputIcon} />
            <TextInput 
              style={globalStyles.input} 
              placeholder="Masukkan nama" 
              placeholderTextColor="#94A3B8" 
              value={nama} 
              onChangeText={setNama} 
            />
          </View>

          <Text style={globalStyles.label}>NPM (NOMOR POKOK MAHASISWA)</Text>
          <View style={globalStyles.inputContainer}>
            <Ionicons name="id-card-outline" size={20} color={COLORS.textGray} style={globalStyles.inputIcon} />
            <TextInput 
              style={globalStyles.input} 
              placeholder="Contoh: 2315061000" 
              placeholderTextColor="#94A3B8" 
              value={npm} 
              onChangeText={setNpm} 
              keyboardType="numeric" 
            />
          </View>

          <Text style={globalStyles.label}>EMAIL</Text>
          <View style={globalStyles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color={COLORS.textGray} style={globalStyles.inputIcon} />
            <TextInput 
              style={globalStyles.input} 
              placeholder="NPM@students.unila.ac.id" 
              placeholderTextColor="#94A3B8" 
              value={email} 
              onChangeText={setEmail} 
              keyboardType="email-address" 
              autoCapitalize="none" 
              autoCorrect={false} 
            />
          </View>

          <Text style={globalStyles.label}>KATA SANDI</Text>
          <View style={globalStyles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color={COLORS.textGray} style={globalStyles.inputIcon} />
            <TextInput 
              style={globalStyles.input} 
              placeholder="Buat kata sandi" 
              placeholderTextColor="#94A3B8" 
              value={password} 
              onChangeText={setPassword} 
              secureTextEntry={!showPassword} 
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={authStyles.eyeIcon}>
              <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color={COLORS.textGray} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={globalStyles.btnPrimary} onPress={handleRegister} activeOpacity={0.8}>
            <Text style={globalStyles.btnPrimaryText}>DAFTAR SEKARANG</Text>
            <Ionicons name="arrow-forward" size={20} color={COLORS.white} style={{ marginLeft: 8 }} />
          </TouchableOpacity>
        </View>

        <View style={authStyles.footer}>
          <Text style={authStyles.footerText}>Sudah punya akun? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={authStyles.loginLink}>Masuk di sini</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}