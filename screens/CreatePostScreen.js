import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';
import { useDispatch } from 'react-redux';
import { addPost } from '../src/features/community/communitySlice';
import * as ImagePicker from 'expo-image-picker';
import { StatusBar } from 'expo-status-bar';
import { Appbar, Button, Text } from 'react-native-paper';

const CreatePostScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleCreatePost = () => {
    // const timestamp = new Date().getTime(); // Generate a unique timestamp
    
    const newPost = {
      user_id: 3,
      image: image,
      title: title,
      description: description,
      // Add more properties as needed
    };

      // Make API call to create a new post
    // fetch('https://sunbird-backend.onrender.com/api/addPosts', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify(newPost)
    // })
    //   .then(response => response.json())
    //   .then(data => {
    //     // Handle the response from the backend
    //     console.log('Create Post response:', data);
    //     // Additional logic after successful registration
    //     dispatch(addPost(newPost));
    //     navigation.navigate('Community');
    //   })
    //   .catch(error => {
    //     console.error('Post creation error:', error);
    //     // Handle the error
    //   });

      dispatch(addPost(newPost));
    
    // Clear the form fields
    setTitle('');
    setDescription('');

    // Navigate back to the CommunityScreen
    navigation.goBack();
  };

  return (
    <View style={{ flex: 1,  }}>
         <Appbar.Header>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title="Ask Community" />
          </Appbar.Header>

      <ScrollView style={{ padding: 10,}}>
            <Text style={{ fontSize: 19, fontWeight: 'bold', marginBottom: 20 }}>Create Post</Text>
            <TextInput
              style={{ fontSize: 18, borderWidth: 1, borderColor: 'gray', padding: 10, marginBottom: 20, borderRadius: 5 }}
              placeholder="Your question to the community"
              value={title}
              onChangeText={setTitle}
            />
            <TextInput
              style={{ fontSize: 18, borderWidth: 1, borderColor: 'gray', padding: 10, marginBottom: 20, borderRadius: 5 }}
              placeholder="Description to your problem"
              multiline
              value={description}
              onChangeText={setDescription}
            />
            <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
              {image ? (
                <Image source={{ uri: image }} style={styles.image} />
              ) : (
                <Text style={styles.imagePlaceholder}>Pick an image</Text>
              )}
            </TouchableOpacity>
            <Button icon="send" mode="contained" onPress={handleCreatePost}>
                Create
            </Button>
            
      </ScrollView>

    </View>
  );
};

const styles = StyleSheet.create({ 
  imageContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
  },
})

export default CreatePostScreen;
