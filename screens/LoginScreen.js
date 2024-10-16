import React, { useState } from 'react';
import { View, TextInput, Button, Text, TouchableOpacity, Alert } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase'; // Asegúrate de importar auth correctamente

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(userCredential => {
        // Usuario autenticado
        const user = userCredential.user;
        console.log('Usuario autenticado:', user.email);
        navigation.navigate('Home'); // Redirige a HomeScreen
      })
      .catch(error => {
        console.error('Error de autenticación:', error.message);
        Alert.alert('Error de inicio de sesión', error.message);
        setError(error.message);
      });
  };

  return (
    <View>
      <TextInput
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />
      <TextInput
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />
      {error ? <Text style={{ color: 'red' }}>{error}</Text> : null}
      <Button title="Iniciar Sesión" onPress={handleLogin} />
      {/* Botón para redirigir a la pantalla de registro */}
      <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
        <Text style={{ color: 'blue', marginTop: 20 }}>¿No tienes una cuenta? Regístrate aquí</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;
