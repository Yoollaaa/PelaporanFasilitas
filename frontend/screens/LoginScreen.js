import React, { useState } from 'react';
import { 
  Text, View, TextInput, TouchableOpacity, Alert, 
  KeyboardAvoidingView, Platform, ScrollView, Image 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { globalStyles, authStyles, COLORS } from '../styles/GlobalStyles';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginType, setLoginType] = useState('mahasiswa'); 
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    const emailBersih = email.trim().toLowerCase();

    if (!emailBersih || !password) {
      Alert.alert('Perhatian', 'Email dan password tidak boleh kosong!');
      return;
    }

    if (
        loginType === 'mahasiswa' &&
        !emailBersih.endsWith('@students.unila.ac.id')
      ) {
        Alert.alert(
          'Email Tidak Valid',
          'Mahasiswa wajib menggunakan email kampus (@students.unila.ac.id)'
        );
        return;
      }

    try {
      const response = await fetch('http://152.42.243.179:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: emailBersih,
          password: password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        const pesanDariServer = data.error || data.message || 'Gagal login, periksa kembali email dan passwordmu.';
        Alert.alert('Gagal Login', pesanDariServer);
        return;
      }

      if (data.token) {
        const userRole = data.user.role;

        if (loginType === 'admin' && userRole !== 'admin') {
          Alert.alert('Akses Ditolak', 'Akun ini tidak terdaftar sebagai Staf/Admin Sarpras.');
          return;
        }

        if (loginType === 'mahasiswa' && userRole === 'admin') {
           Alert.alert('Perhatian', 'Kamu adalah Admin. Silakan pindah ke tab Admin Sarpras untuk masuk.');
           return;
        }

        await AsyncStorage.setItem('user', JSON.stringify(data.user));
        await AsyncStorage.setItem('token', data.token);

        Alert.alert('Sukses', 'Berhasil Login!');

        if (userRole === 'admin') {
          navigation.replace('AdminDashboard'); 
        } else {
          navigation.replace('FormLaporan'); 
        }
      }
    } catch (error) {
      console.log("Error Fetch:", error.message);
      Alert.alert('Gagal', 'Tidak bisa terhubung ke server. Periksa koneksi internetmu.');
    }
  };

  return (
    <View style={globalStyles.mainWrapper}>
      <View style={globalStyles.topOrnament} />

      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
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

            <Text style={globalStyles.pageTitle}>Selamat Datang</Text>
            <Text style={globalStyles.pageSubtitle}>
              {loginType === 'mahasiswa' 
                ? 'Silakan masuk dengan email kampus (@students.unila.ac.id) kamu.' 
                : 'Portal khusus staf Sarpras kampus.'}
            </Text>
          </View>

          <View style={globalStyles.card}>
            
            <View style={authStyles.tabContainer}>
              <TouchableOpacity 
                style={[authStyles.tabButton, loginType === 'mahasiswa' && authStyles.tabActive]}
                onPress={() => setLoginType('mahasiswa')}
                activeOpacity={0.8}
              >
                <Text style={[authStyles.tabText, loginType === 'mahasiswa' && authStyles.tabTextActive]}>
                  Mahasiswa
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[authStyles.tabButton, loginType === 'admin' && authStyles.tabActive]}
                onPress={() => setLoginType('admin')}
                activeOpacity={0.8}
              >
                <Text style={[authStyles.tabText, loginType === 'admin' && authStyles.tabTextActive]}>
                  Admin Sarpras
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={globalStyles.label}>
                {loginType === 'mahasiswa' ? 'EMAIL KAMPUS' : 'EMAIL'}
              </Text>

              <View style={globalStyles.inputContainer}>
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={COLORS.textGray}
                  style={globalStyles.inputIcon}
                />

                <TextInput
                  style={globalStyles.input}
                  placeholder={
                    loginType === 'mahasiswa'
                      ? 'contoh@students.unila.ac.id'
                      : 'admin@gmail.com'
                  }
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
                placeholder="Masukkan kata sandi"
                placeholderTextColor="#94A3B8"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={authStyles.eyeIcon}>
                <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color={COLORS.textGray} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={globalStyles.btnPrimary} onPress={handleLogin} activeOpacity={0.8}>
              <Text style={globalStyles.btnPrimaryText}>MASUK</Text>
              <Ionicons name="arrow-forward" size={20} color={COLORS.white} style={{ marginLeft: 8 }} />
            </TouchableOpacity>
          </View>

          {loginType === 'mahasiswa' ? (
            <View style={authStyles.footer}>
              <Text style={authStyles.footerText}>Belum punya akun? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={authStyles.loginLink}>Daftar Sekarang</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={authStyles.footer}>
              <Text style={authStyles.footerText}>Staf baru? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('AdminRegister')}>
                <Text style={authStyles.loginLink}>Daftar Akun Admin</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}