import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { useNavigation } from '@react-navigation/native';

type AuthScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Auth'>;

const AuthScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation<AuthScreenNavigationProp>();

  const register = async () => {
    console.log('Registering...');
    try {
      const response = await axios.post('http://163.172.177.98:8081/auth/register', { email, password });
      console.log('Register response:', response.data);
      if (response.data.accessToken) {
        await AsyncStorage.setItem('token', response.data.accessToken);
        console.log('Token stored, navigating to UserDetails');
        navigation.navigate('UserDetails');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Register error:', error.response?.data);
        if (error.response?.status === 409) {
          Alert.alert('Registration Error', 'User already exists. Please login.');
        } else if (error.response?.status === 403) {
          Alert.alert('Registration Error', 'You do not have permission to register.');
        } else {
          Alert.alert('Registration Error', 'An error occurred during registration. Please try again.');
        }
      } else {
        console.error('Register error:', error);
      }
    }
  };

  const login = async () => {
    console.log('Logging in...');
    try {
      const response = await axios.post('http://163.172.177.98:8081/auth/login', { email, password });
      console.log('Login response:', response.data);
      if (response.data.accessToken) {
        await AsyncStorage.setItem('token', response.data.accessToken);
        console.log('Token stored, navigating to UserDetails');
        navigation.navigate('UserDetails');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Login error:', error.response?.data);
        if (error.response?.status === 403) {
          Alert.alert('Login Error', 'You do not have permission to login.');
        } else {
          Alert.alert('Login Error', 'An error occurred during login. Please try again.');
        }
      } else {
        console.error('Login error:', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text>Email:</Text>
      <TextInput style={styles.input} value={email} onChangeText={setEmail} />
      <Text>Password:</Text>
      <TextInput style={styles.input} value={password} onChangeText={setPassword} secureTextEntry />
      <View style={styles.buttonContainer}>
        <View style={styles.button}>
          <Button title="Register" onPress={register} />
        </View>
        <View style={styles.button}>
          <Button title="Login" onPress={login} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      padding: 16,
    },
    input: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      marginBottom: 12,
      paddingHorizontal: 8,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    button: {
      flex: 1,
      marginHorizontal: 5,
    },
});

export default AuthScreen;
