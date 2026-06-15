import React, { useState } from 'react';
import { 
  StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, 
  ScrollView, KeyboardAvoidingView, Platform, Dimensions 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const { width, height } = Dimensions.get('window');

export default function RegisterScreen({ navigation }) {
  const [nama, setNama] = useState('');
  const [npm, setNpm] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async () => {
    const emailBersih = email.trim().toLowerCase();

    if (!nama || !npm || !emailBersih || !password) {
      Alert.alert('Perhatian', 'Semua kolom wajib diisi!');
      return;
    }

    try {
      const response = await axios.post('http://192.168.2.242:5000/api/auth/register', {
        nama: nama,
        npm: npm,
        email: emailBersih,
        password: password
      });

      if (response.status === 201 || response.data.success) {
        Alert.alert('Sukses 🎉', 'Akun berhasil dibuat! Silakan Login.');
        setNama('');
        setNpm('');
        setEmail('');
        setPassword('');
        
        navigation.navigate('Login');
      }
    } catch (error) {
      console.error(error);
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Gagal mendaftar ke server.';
      Alert.alert('Gagal Daftar', errorMessage);
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
              <Ionicons name="school" size={36} color="#FFFFFF" />
            </View>
            <Text style={styles.title}>Buat Akun</Text>
            <Text style={styles.subtitle}>Bergabunglah untuk mulai melaporkan fasilitas kampus.</Text>
          </View>

          <View style={styles.card}>
            
            <Text style={styles.label}>Nama Lengkap</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color="#94A3B8" style={styles.inputIcon} />
              <TextInput 
                style={styles.input} 
                placeholder="Masukkan nama" 
                placeholderTextColor="#94A3B8" 
                value={nama} 
                onChangeText={setNama} 
              />
            </View>

            <Text style={styles.label}>NPM (Nomor Pokok Mahasiswa)</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="id-card-outline" size={20} color="#94A3B8" style={styles.inputIcon} />
              <TextInput 
                style={styles.input} 
                placeholder="Contoh: 2315061000" 
                placeholderTextColor="#94A3B8" 
                value={npm} 
                onChangeText={setNpm} 
                keyboardType="numeric" 
              />
            </View>

            <Text style={styles.label}>Email</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color="#94A3B8" style={styles.inputIcon} />
              <TextInput 
                style={styles.input} 
                placeholder="Email mahasiswa" 
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
                placeholder="Buat kata sandi" 
                placeholderTextColor="#94A3B8" 
                value={password} 
                onChangeText={setPassword} 
                secureTextEntry={!showPassword} 
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.btnRegister} onPress={handleRegister} activeOpacity={0.8}>
              <Text style={styles.btnRegisterText}>DAFTAR SEKARANG</Text>
              <Ionicons name="arrow-forward" size={20} color="#FFFFFF" style={{ marginLeft: 8 }} />
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Sudah punya akun? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.linkText}>Masuk di sini</Text>
            </TouchableOpacity>
          </View>
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
  label: { 
    fontSize: 13, 
    fontWeight: '700', 
    color: '#475569', 
    marginBottom: 8, 
    marginTop: 12,
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
    marginBottom: 8,
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
  btnRegister: { 
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
  btnRegisterText: { 
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