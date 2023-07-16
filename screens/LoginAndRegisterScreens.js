import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Button } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { setUser } from '../src/features/community/userSlice';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const handleLogin = () => {
    // Performing login logic here using my backend API
    const userData = {
      email: email,
      password: password
    };

    // Make API call to authenticate the user
    fetch('https://sunbird-backend.onrender.com/api/login', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    })
        .then((response) => response.json())
        .then((data) => {
        // Handle the response from the backend
        console.log('Login response:', data);
        // Dispatch the user action to Redux store
        dispatch(setUser(data.user));
        // Additional logic after successful login
        navigation.navigate('Home');
        })
        .catch((error) => {
        console.error('Login error:', error);
        // Handle the error
        });
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
  const [language, setLanguage] = useState('');
  const navigation = useNavigation();

  const handleRegister = () => {
   

    // Performing registration logic here using my backend API
    const userData = {
      name: name,
      email: email,
      password: password,
      password_confirmation: passwordConfirmation,
    //   location: district,
    //   language: language
    };
    console.log(userData)

    // Make API call to register the user
    fetch('https://sunbird-backend.onrender.com/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    })
      .then(response => response.json())
      .then(data => {
        // Handle the response from the backend
        console.log('Registration response:', data);
        // Additional logic after successful registration
        navigation.navigate('Login');
      })
      .catch(error => {
        console.error('Registration error:', error);
        // Handle the error
      });
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
      <Text>Select Language:</Text>
      <Picker
        selectedValue={language}
        onValueChange={value => setLanguage(value)}
        style={styles.picker}
      >
        <Picker.Item label="Luganda" value="Luganda" />
        <Picker.Item label="Runyankole" value="Runyankole" />
        <Picker.Item label="Ateso" value="Ateso" />
        <Picker.Item label="Lugbara" value="Lugbara" />
        <Picker.Item label="Acholi" value="Acholi" />
      </Picker>
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
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  picker: {
    width: '80%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
  },
});

export { LoginScreen, RegisterScreen };
