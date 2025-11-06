import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Text, TextInput, Button, ActivityIndicator } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../context/AuthContext';

export default function RegisterScreen({ navigation }) {
  const { login } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      await AsyncStorage.setItem('token', 'demo_token');
      login();
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>Create Account ✨</Text>
      <TextInput label="Full Name" mode="outlined" value={name} onChangeText={setName} style={styles.input} />
      <TextInput label="Email" mode="outlined" value={email} onChangeText={setEmail} style={styles.input} />
      <TextInput label="Password" mode="outlined" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
      <Button mode="contained" onPress={handleRegister} style={styles.button} buttonColor="#E91E63" disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : 'Register'}
      </Button>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', paddingHorizontal: 24, backgroundColor: '#fff' },
  title: { textAlign: 'center', marginBottom: 30, fontWeight: '700', color: '#E91E63' },
  input: { marginBottom: 16 },
  button: { marginTop: 10, borderRadius: 10, paddingVertical: 6 },
  link: { textAlign: 'center', color: '#E91E63', marginTop: 20, fontWeight: '600' },
});
