import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase'; // Asegúrate de que auth esté correctamente importado

const SignUpScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignUp = () => {
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then(userCredential => {
        // Usuario registrado exitosamente
        const user = userCredential.user;
        console.log('Usuario registrado:', user.email);
        Alert.alert('Registro exitoso', 'Tu cuenta ha sido creada.');
        navigation.navigate('Home'); // Redirige a HomeScreen después del registro
      })
      .catch(error => {
        // Muestra errores si algo falla
        console.error('Error al registrar:', error.message);
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
      <TextInput
        placeholder="Confirmar contraseña"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />
      {error ? <Text style={{ color: 'red' }}>{error}</Text> : null}
      <Button title="Registrarse" onPress={handleSignUp} />
    </View>
  );
};

export default SignUpScreen;
