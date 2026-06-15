import React, { useState } from 'react';
import { 
  StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, 
  KeyboardAvoidingView, Platform, ScrollView, Dimensions 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

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

    try {
      const response = await axios.post('http://167.172.66.214:5000/api/auth/login', {
        email: emailBersih, 
        password: password
      });

      if (response.data.token) {
        const userRole = response.data.user.role;

        if (loginType === 'admin' && userRole !== 'admin') {
          Alert.alert('Akses Ditolak', 'Akun ini tidak terdaftar sebagai Staf/Admin Sarpras.');
          return;
        }

        if (loginType === 'mahasiswa' && userRole === 'admin') {
           Alert.alert('Perhatian', 'Kamu adalah Admin. Silakan pindah ke tab Admin Sarpras untuk masuk.');
           return;
        }

        await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
        await AsyncStorage.setItem('token', response.data.token);

        Alert.alert('Sukses 🎉', 'Berhasil Login!');

        if (userRole === 'admin') {
          navigation.replace('AdminDashboard'); 
        } else {
          navigation.replace('FormLaporan'); 
        }
      }
    } catch (error) {
      console.error(error);
      const errorMessage = error.response?.data?.error || 'Gagal terhubung ke server. Cek koneksi wifi!';
      Alert.alert('Gagal Login', errorMessage);
    }
  };

  return (
    <View style={styles.mainWrapper}>
      <View style={styles.topOrnament} />

      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={styles.container} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Selamat Datang</Text>
            <Text style={styles.subtitle}>
              {loginType === 'mahasiswa' 
                ? 'Silakan masuk dengan akun mahasiswa Unila kamu.' 
                : 'Portal khusus staf Sarpras kampus.'}
            </Text>
          </View>

          <View style={styles.card}>
            
            <View style={styles.tabContainer}>
              <TouchableOpacity 
                style={[styles.tabButton, loginType === 'mahasiswa' && styles.tabActive]}
                onPress={() => setLoginType('mahasiswa')}
                activeOpacity={0.8}
              >
                <Text style={[styles.tabText, loginType === 'mahasiswa' && styles.tabTextActive]}>
                  Mahasiswa
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.tabButton, loginType === 'admin' && styles.tabActive]}
                onPress={() => setLoginType('admin')}
                activeOpacity={0.8}
              >
                <Text style={[styles.tabText, loginType === 'admin' && styles.tabTextActive]}>
                  Admin Sarpras
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Email Kampus</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color="#94A3B8" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="contoh@students.unila.ac.id"
                placeholderTextColor="#94A3B8"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <Text style={styles.label}>Kata Sandi</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#94A3B8" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Masukkan kata sandi"
                placeholderTextColor="#94A3B8"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.btnLogin} onPress={handleLogin} activeOpacity={0.8}>
              <Text style={styles.btnLoginText}>MASUK</Text>
              <Ionicons name="arrow-forward" size={20} color="#FFFFFF" style={{ marginLeft: 8 }} />
            </TouchableOpacity>
          </View>

          {loginType === 'mahasiswa' ? (
            <View style={styles.footer}>
              <Text style={styles.footerText}>Belum punya akun? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.linkText}>Daftar Sekarang</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.footer}>
              <Text style={styles.footerText}>Staf baru? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('AdminRegister')}>
                <Text style={styles.linkText}>Daftar Akun Admin</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    backgroundColor: '#F4F7FC',
  },
  topOrnament: {
    position: 'absolute',
    top: -height * 0.15, 
    left: -width * 0.1,
    width: width * 1.2,
    height: height * 0.45,
    backgroundColor: '#0A2540',
    transform: [{ rotate: '-5deg' }],
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 120,
  },
  container: { 
    flexGrow: 1, 
    padding: 24, 
    paddingTop: 80, 
    paddingBottom: 40,
  },
  headerContainer: { 
    alignItems: 'center',
    marginBottom: 32,
  },
  logoContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 16,
    borderRadius: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  title: { 
    fontSize: 32, 
    fontWeight: '900', 
    color: '#FFFFFF', 
    letterSpacing: 0.5,
    marginBottom: 8
  },
  subtitle: { 
    fontSize: 15, 
    color: '#E2E8F0', 
    fontWeight: '500',
    textAlign: 'center',
    paddingHorizontal: 20
  },
  card: { 
    backgroundColor: '#FFFFFF', 
    borderRadius: 24, 
    padding: 24, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 10 }, 
    shadowOpacity: 0.08, 
    shadowRadius: 20, 
    elevation: 8 
  },
  tabContainer: { 
    flexDirection: 'row', 
    backgroundColor: '#F1F5F9', 
    borderRadius: 16, 
    padding: 6, 
    marginBottom: 24 
  },
  tabButton: { 
    flex: 1, 
    paddingVertical: 12, 
    borderRadius: 12, 
    alignItems: 'center' 
  },
  tabActive: { 
    backgroundColor: '#FFFFFF', 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.05, 
    shadowRadius: 4, 
    elevation: 2 
  },
  tabText: { 
    fontSize: 14, 
    fontWeight: '700', 
    color: '#64748B' 
  },
  tabTextActive: { 
    color: '#0A2540', 
    fontWeight: '800' 
  },
  label: { 
    fontSize: 13, 
    fontWeight: '700', 
    color: '#475569', 
    marginBottom: 8, 
    marginTop: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
    marginBottom: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: { 
    flex: 1,
    fontSize: 15, 
    color: '#0F172A',
    fontWeight: '500',
  },
  eyeIcon: {
    padding: 8,
  },
  btnLogin: { 
    backgroundColor: '#0A2540', 
    height: 56,
    borderRadius: 16, 
    flexDirection: 'row',
    alignItems: 'center', 
    justifyContent: 'center',
    marginTop: 24, 
    shadowColor: '#0A2540',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6
  },
  btnLoginText: { 
    color: '#FFFFFF', 
    fontSize: 16, 
    fontWeight: '800', 
    letterSpacing: 1 
  },
  footer: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    marginTop: 32 
  },
  footerText: { 
    color: '#64748B', 
    fontSize: 15,
    fontWeight: '500'
  },
  linkText: { 
    color: '#0A2540', 
    fontSize: 15, 
    fontWeight: '800' 
  }
});