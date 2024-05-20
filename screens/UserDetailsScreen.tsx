import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { useNavigation } from '@react-navigation/native';

type UserDetailsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'UserDetails'>;

const UserDetailsScreen = () => {
  const [userDetails, setUserDetails] = useState<any>(null);
  const navigation = useNavigation<UserDetailsScreenNavigationProp>();

  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = await AsyncStorage.getItem('token');
      console.log('Fetched token:', token);
      if (token) {
        try {
          const response = await axios.get('http://163.172.177.98:8081/user/details/me', {
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log('User details response:', response.data);
          setUserDetails(response.data);
        } catch (error) {
          if (axios.isAxiosError(error) && error.response?.status === 403) {
            Alert.alert('Error', 'You do not have permission to access this resource.');
          } else {
            console.error('Fetch user details error:', error);
          }
        }
      }
    };
    fetchUserDetails();
  }, []);

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    navigation.navigate('Auth');
  };

  if (!userDetails) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>User Details</Text>
      </View>
      <View style={styles.middle}>
        <Text style={styles.email}>Email: {userDetails.user.email}</Text>
      </View>
      <View style={styles.footer}>
        <Button title="Logout" onPress={logout} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'space-between',
      padding: 16,
    },
    header: {
      alignItems: 'center',
      marginTop: 40,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
    },
    middle: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    email: {
      fontSize: 18,
    },
    footer: {
      alignItems: 'center',
      marginBottom: 40,
    },
  });

export default UserDetailsScreen;
