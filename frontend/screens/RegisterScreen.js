import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';

export default function RegisterScreen({ navigation }) {
  const [nama, setNama] = useState('');
  const [npm, setNpm] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    if (!nama || !npm || !email || !password) {
      Alert.alert('Perhatian', 'Semua kolom wajib diisi!');
      return;
    }
    // Logika API Register ditaruh di sini nanti
    Alert.alert('Sukses', 'Akun berhasil dibuat! Silakan Login.');
    navigation.navigate('Login'); // Arahkan kembali ke Login setelah daftar
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Buat Akun</Text>
        <Text style={styles.subtitle}>Bergabunglah untuk mulai melaporkan fasilitas kampus.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Nama Lengkap</Text>
        <TextInput style={styles.input} placeholder="Masukkan nama" placeholderTextColor="#94A3B8" value={nama} onChangeText={setNama} />

        <Text style={styles.label}>NPM (Nomor Pokok Mahasiswa)</Text>
        <TextInput style={styles.input} placeholder="Contoh: 2315061000" placeholderTextColor="#94A3B8" value={npm} onChangeText={setNpm} keyboardType="numeric" />

        <Text style={styles.label}>Email</Text>
        <TextInput style={styles.input} placeholder="Email mahasiswa" placeholderTextColor="#94A3B8" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />

        <Text style={styles.label}>Kata Sandi</Text>
        <TextInput style={styles.input} placeholder="Buat kata sandi" placeholderTextColor="#94A3B8" value={password} onChangeText={setPassword} secureTextEntry />

        <TouchableOpacity style={styles.btnRegister} onPress={handleRegister} activeOpacity={0.8}>
          <Text style={styles.btnRegisterText}>DAFTAR SEKARANG</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Sudah punya akun? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.linkText}>Masuk di sini</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#F8FAFC', padding: 24, justifyContent: 'center' },
  headerContainer: { marginBottom: 32, marginTop: 40 },
  title: { fontSize: 32, fontWeight: '800', color: '#0F172A', letterSpacing: -0.5 },
  subtitle: { fontSize: 15, color: '#64748B', marginTop: 8, lineHeight: 22 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 24, shadowColor: '#CBD5E1', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 4 },
  label: { fontSize: 14, fontWeight: '700', color: '#334155', marginBottom: 8, marginTop: 12 },
  input: { backgroundColor: '#F1F5F9', borderRadius: 14, padding: 16, fontSize: 15, color: '#0F172A', borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 12 },
  btnRegister: { backgroundColor: '#2563EB', padding: 18, borderRadius: 16, alignItems: 'center', marginTop: 20, elevation: 3 },
  btnRegisterText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold', letterSpacing: 1 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 30, marginBottom: 40 },
  footerText: { color: '#64748B', fontSize: 15 },
  linkText: { color: '#2563EB', fontSize: 15, fontWeight: '700' }
});