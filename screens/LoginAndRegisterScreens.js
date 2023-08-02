import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Button , TextInput} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { addDoc, collection } from 'firebase/firestore';
import LanguageSelectionDialog from '../Components/LanguageSelectionDialog';



const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    checkUserLoggedIn();
  }, []);

  const checkUserLoggedIn = async () => {
    try {
      // Check if the 'userEmail' and 'userId' are stored in AsyncStorage
      const userEmail = await AsyncStorage.getItem('userEmail');
      const userId = await AsyncStorage.getItem('userId');

      // If both userEmail and userId are not null, the user is logged in
      if (userEmail !== null && userId !== null) {
        // User is logged in, navigate to the Home screen
        navigation.replace('Home');
      } else {
        // User is not logged in, do nothing (stay on the Login screen)
      }
    } catch (error) {
      console.error('Error checking user login:', error);
    }
  };

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Store user email and user ID in AsyncStorage for future use
      await AsyncStorage.setItem('userEmail', email);
      await AsyncStorage.setItem('userId', user.uid);
  
      // You can redirect the user to the home screen or another part of the app after successful login.
      navigation.navigate('Home');
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={{ 
        color: 'green',
    paddingBottom: 10,
    fontSize: 25,
    fontWeight: 'bold',}}> Agriconnect Uganda</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={text => setEmail(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry={true}
        value={password}
        onChangeText={text => setPassword(text)}
      />
      <Button mode="contained" onPress={handleLogin}>
        Login
      </Button>
        <Text>Don't have an account ?</Text>
      <Button mode="text" onPress={() => navigation.navigate('Register')}>
        Register
      </Button>
    </View>
  );
};

const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [district, setDistrict] = useState('');
  const navigation = useNavigation();

  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('');

  const showDialog = () => setDialogVisible(true);
  const hideDialog = () => setDialogVisible(false);

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
  };


  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // After successful registration, add the user details to a "users" collection
      const usersRef = collection(db, 'users');
      await addDoc(usersRef, { 
        uid: user.uid,
        name,
        district,
        language: selectedLanguage,
      });
  
      // Store user email and user ID in AsyncStorage for future use
      await AsyncStorage.setItem('userEmail', email);
      await AsyncStorage.setItem('userId', user.uid);
       
      // You can also redirect the user to the home screen or another part of the app here,
      navigation.navigate('Home');
    } catch (error) {
      console.error('Error registering user:', error);
    }
  };
  
  return (
    <View style={styles.container}>
       <Text style={{ 
        color: 'green',
        paddingBottom: 10,
        fontSize: 25,
        fontWeight: 'bold',
        }}> Agriconnect Uganda</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={text => setName(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={text => setEmail(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry={true}
        value={password}
        onChangeText={text => setPassword(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        secureTextEntry={true}
        value={passwordConfirmation}
        onChangeText={text => setPasswordConfirmation(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="District"
        value={district}
        onChangeText={text => setDistrict(text)}
      />
   
      <Text>Select Language: {selectedLanguage}</Text>
      <Button mode="contained" onPress={showDialog}>
        Open Language Selection
      </Button>
      <LanguageSelectionDialog
        visible={dialogVisible}
        onDismiss={hideDialog}
        onLanguageSelect={handleLanguageSelect}
        selectedLanguage={selectedLanguage}
      />
      <Button mode="contained" onPress={handleRegister}>
         Register
      </Button>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: '80%',
    marginBottom: 5,
    paddingHorizontal: 10,
  },
  picker: {
    width: '80%',
    height: 40,
    borderColor: 'blue',
    borderWidth: 1,
  },
});

export { LoginScreen, RegisterScreen };
