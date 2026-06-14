import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginType, setLoginType] = useState('mahasiswa'); 

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Perhatian', 'Email dan password tidak boleh kosong!');
      return;
    }

    try {
      const response = await axios.post('http://192.168.2.242:5000/api/auth/login', {
        email: email.trim().toLowerCase(), 
        password: password
      });

      if (response.data.token) {
        const userRole = response.data.user.role;

        if (loginType === 'admin' && userRole !== 'admin') {
          Alert.alert('Akses Ditolak', 'Akun ini tidak memiliki hak akses Admin Sarpras.');
          return;
        }

        if (loginType === 'mahasiswa' && userRole === 'admin') {
           Alert.alert('Perhatian', 'Gunakan portal Admin Sarpras untuk masuk.');
           return;
        }

        await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
        await AsyncStorage.setItem('token', response.data.token);

        Alert.alert('Sukses', 'Berhasil Login!');

        if (userRole === 'admin') {
          navigation.replace('AdminDashboard'); 
        } else {
          navigation.replace('FormLaporan'); 
        }
      }
    } catch (error) {
      console.error(error);
      const errorMessage = error.response?.data?.error || 'Gagal terhubung ke server.';
      Alert.alert('Gagal Login', errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Selamat Datang</Text>
        <Text style={styles.subtitle}>
          {loginType === 'mahasiswa' 
            ? 'Silakan masuk dengan akun mahasiswa Unila kamu.' 
            : 'Portal khusus staf Sarpras kampus.'}
        </Text>
      </View>

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

      <View style={styles.card}>
        <Text style={styles.label}>Email Kampus</Text>
        <TextInput
          style={styles.input}
          placeholder="contoh@students.unila.ac.id"
          placeholderTextColor="#94A3B8"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Kata Sandi</Text>
        <TextInput
          style={styles.input}
          placeholder="Masukkan kata sandi"
          placeholderTextColor="#94A3B8"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.btnLogin} onPress={handleLogin} activeOpacity={0.8}>
          <Text style={styles.btnLoginText}>MASUK</Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC', padding: 24, justifyContent: 'center' },
  headerContainer: { marginBottom: 24 },
  title: { fontSize: 32, fontWeight: '800', color: '#0F172A', letterSpacing: -0.5 },
  subtitle: { fontSize: 15, color: '#64748B', marginTop: 8, lineHeight: 22 },
  
  tabContainer: { flexDirection: 'row', backgroundColor: '#E2E8F0', borderRadius: 12, padding: 4, marginBottom: 24 },
  tabButton: { flex: 1, paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  tabActive: { backgroundColor: '#FFFFFF', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  tabText: { fontSize: 15, fontWeight: '600', color: '#64748B' },
  tabTextActive: { color: '#0F172A', fontWeight: '800' },

  card: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 24, shadowColor: '#CBD5E1', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 4 },
  label: { fontSize: 14, fontWeight: '700', color: '#334155', marginBottom: 8, marginTop: 12 },
  input: { backgroundColor: '#F1F5F9', borderRadius: 14, padding: 16, fontSize: 15, color: '#0F172A', borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 12 },
  btnLogin: { backgroundColor: '#0F172A', padding: 18, borderRadius: 16, alignItems: 'center', marginTop: 20, elevation: 3 },
  btnLoginText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold', letterSpacing: 1 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 30 },
  footerText: { color: '#64748B', fontSize: 15 },
  linkText: { color: '#2563EB', fontSize: 15, fontWeight: '700' }
});