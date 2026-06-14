import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import axios from 'axios';

export default function AdminRegisterScreen({ navigation }) {
  const [form, setForm] = useState({ nama: '', npm: '', email: '', password: '', adminKey: '' });

  const handleRegister = async () => {
    try {
      const response = await axios.post('http://192.168.2.242:5000/api/auth/register-admin', {
        nama: form.nama,
        npm: form.npm,
        email: form.email,
        password: form.password,
        admin_key: form.adminKey
      });
      Alert.alert('Sukses', 'Akun Staf Sarpras Berhasil Dibuat!');
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert(
        'Laporan Investigasi Error 🕵️‍♀️',
        `Pesan: ${error.message}\nStatus: ${error.response?.status || 'Gagal konek ke server'}\nData: ${JSON.stringify(error.response?.data || 'Kosong')}`
      );
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Registrasi Staf</Text>
        <Text style={styles.subtitle}>Pembuatan akun khusus Admin Sarpras Unila.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Nama Lengkap</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Contoh: Dr. Budi Santoso, S.T." 
          placeholderTextColor="#94A3B8"
          onChangeText={(t) => setForm({...form, nama: t})} 
        />

        <Text style={styles.label}>NIP / ID Staf</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Contoh: 198001012005011001" 
          placeholderTextColor="#94A3B8"
          keyboardType="numeric"
          onChangeText={(t) => setForm({...form, npm: t})} 
        />

        <Text style={styles.label}>Email Institusi</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Contoh: admin.sarpras@unila.ac.id" 
          placeholderTextColor="#94A3B8"
          keyboardType="email-address"
          autoCapitalize="none"
          onChangeText={(t) => setForm({...form, email: t})} 
        />

        <Text style={styles.label}>Kata Sandi</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Minimal 8 karakter" 
          placeholderTextColor="#94A3B8"
          secureTextEntry 
          onChangeText={(t) => setForm({...form, password: t})} 
        />

        <Text style={styles.label}>Kode Rahasia Admin</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Ketik: UNILA_SARPRAS_2024" 
          placeholderTextColor="#94A3B8"
          secureTextEntry 
          onChangeText={(t) => setForm({...form, adminKey: t})} 
        />
        
        <TouchableOpacity style={styles.btnRegister} onPress={handleRegister} activeOpacity={0.8}>
          <Text style={styles.btnRegisterText}>DAFTARKAN AKUN ADMIN</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Sudah punya akun staf? </Text>
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