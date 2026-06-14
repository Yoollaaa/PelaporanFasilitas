import React, { useState } from 'react';
import { 
  StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, 
  ScrollView, KeyboardAvoidingView, Platform, Dimensions 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const { width, height } = Dimensions.get('window');

export default function AdminRegisterScreen({ navigation }) {
  const [form, setForm] = useState({ nama: '', npm: '', email: '', password: '', adminKey: '' });
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async () => {
    try {
      const response = await axios.post('http://192.168.1.9:5000/api/auth/register-admin', {
        nama: form.nama,
        npm: form.npm,
        email: form.email.trim().toLowerCase(),
        password: form.password,
        admin_key: form.adminKey
      });
      Alert.alert('Sukses 🎉', 'Akun Staf Sarpras Berhasil Dibuat!');
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Gagal Daftar', error.response?.data?.error || 'Pastikan IP dan Kunci Admin benar.');
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
            <View style={styles.logoContainer}>
              <Ionicons name="shield-checkmark" size={36} color="#FFFFFF" />
            </View>
            <Text style={styles.title}>Registrasi Admin</Text>
            <Text style={styles.subtitle}>Portal khusus staf Sarpras kampus.</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>Nama Lengkap</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color="#94A3B8" style={styles.inputIcon} />
              <TextInput style={styles.input} placeholder="Contoh: Dr. Budi Santoso" placeholderTextColor="#94A3B8" onChangeText={(t) => setForm({...form, nama: t})} />
            </View>

            <Text style={styles.label}>NIP / ID Staf</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="id-card-outline" size={20} color="#94A3B8" style={styles.inputIcon} />
              <TextInput style={styles.input} placeholder="NIP" keyboardType="numeric" placeholderTextColor="#94A3B8" onChangeText={(t) => setForm({...form, npm: t})} />
            </View>

            <Text style={styles.label}>Email Institusi</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color="#94A3B8" style={styles.inputIcon} />
              <TextInput style={styles.input} placeholder="admin.sarpras@unila.ac.id" autoCapitalize="none" keyboardType="email-address" placeholderTextColor="#94A3B8" onChangeText={(t) => setForm({...form, email: t})} />
            </View>

            <Text style={styles.label}>Kata Sandi</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#94A3B8" style={styles.inputIcon} />
              <TextInput style={styles.input} placeholder="Minimal 8 karakter" secureTextEntry={!showPassword} placeholderTextColor="#94A3B8" onChangeText={(t) => setForm({...form, password: t})} />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Kode Rahasia Admin</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="key-outline" size={20} color="#94A3B8" style={styles.inputIcon} />
              <TextInput style={styles.input} placeholder="Ketik Kode Rahasia" secureTextEntry placeholderTextColor="#94A3B8" onChangeText={(t) => setForm({...form, adminKey: t})} />
            </View>
            
            <TouchableOpacity style={styles.btnRegister} onPress={handleRegister} activeOpacity={0.8}>
              <Text style={styles.btnRegisterText}>DAFTARKAN AKUN ADMIN</Text>
              <Ionicons name="arrow-forward" size={20} color="#FFFFFF" style={{ marginLeft: 8 }} />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainWrapper: { flex: 1, backgroundColor: '#F4F7FC' },
  topOrnament: {
    position: 'absolute', top: -height * 0.15, left: -width * 0.1,
    width: width * 1.2, height: height * 0.45, backgroundColor: '#0A2540',
    transform: [{ rotate: '-5deg' }], borderBottomLeftRadius: 60, borderBottomRightRadius: 120,
  },
  container: { flexGrow: 1, padding: 24, paddingTop: 80, paddingBottom: 40 },
  headerContainer: { alignItems: 'center', marginBottom: 32 },
  logoContainer: { backgroundColor: 'rgba(255, 255, 255, 0.2)', padding: 16, borderRadius: 24, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.3)' },
  title: { fontSize: 32, fontWeight: '900', color: '#FFFFFF', marginBottom: 8 },
  subtitle: { fontSize: 15, color: '#E2E8F0', textAlign: 'center', paddingHorizontal: 20 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.08, shadowRadius: 20, elevation: 8 },
  label: { fontSize: 13, fontWeight: '700', color: '#475569', marginBottom: 8, marginTop: 12, textTransform: 'uppercase' },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', borderWidth: 1.5, borderColor: '#E2E8F0', borderRadius: 16, paddingHorizontal: 16, height: 56, marginBottom: 8 },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, fontSize: 15, color: '#0F172A' },
  eyeIcon: { padding: 8 },
  btnRegister: { backgroundColor: '#0A2540', height: 56, borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 24, elevation: 6 },
  btnRegisterText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800', letterSpacing: 1 }
});