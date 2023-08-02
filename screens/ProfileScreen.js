import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Appbar, Button } from 'react-native-paper';
import { collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth } from '../firebase';
import { Avatar, Card, IconButton } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackActions } from '@react-navigation/native';


const ProfileScreen = ({ navigation}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const user = auth.currentUser;


  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleSave = async () => {
    setIsEditMode(false);
    await updateDoc(userDocRef, { name, email });
  };

  const handleLogout = async () => {
    try {
      // Clear AsyncStorage
      await AsyncStorage.clear();
  
      // Log out the user from Firebase
      await auth.signOut();
  
      // Reset the navigation stack and redirect to the "Login" screen
      navigation.dispatch(
        StackActions.replace('Login')
      );
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
      <Card.Title
            title="Card Title"
            subtitle="Card Subtitle"
            left={(props) => <Avatar.Icon {...props} icon="folder" />}
            right={(props) => <IconButton {...props} icon="dots-vertical" onPress={() => {}} />}
        />
        <Avatar.Icon size={100} icon="account" />

        <View style={styles.profileInfo}>
          <Text style={styles.label}>Name:</Text>
          {isEditMode ? (
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
            />
          ) : (
            <Text style={styles.text}>{name}</Text>
          )}
        </View>

        <View style={styles.profileInfo}>
          <Text style={styles.label}>Email:</Text>
          {isEditMode ? (
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
            />
          ) : (
            <Text style={styles.text}>{email}</Text>
          )}
        </View>

        {isEditMode ? (
          <Button mode="contained" onPress={handleSave} style={styles.button}>
            Save
          </Button>
        ) : (
          <Button mode="contained" onPress={handleEdit} style={styles.button}>
            Edit Profile
          </Button>
        )}
      </View>
      <Button mode="contained" onPress={handleLogout}  style={styles.button}>
            Log out
      </Button>


    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileContainer: {
    flex: 1,
    
  },
  profileInfo: {
    marginBottom: 15,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 16,
  },
  input: {
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
  },
  button: {
    marginTop: 20,
    marginHorizontal: 20,
    paddingVertical: 10,
  },
});

export default ProfileScreen;
