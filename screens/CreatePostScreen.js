import React, { useState } from 'react';
import { View, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { StatusBar } from 'expo-status-bar';
import { Appbar, Button, Text, TextInput } from 'react-native-paper';
import { auth, db, storage } from '../firebase';
import { addDoc, collection, query, orderBy, onSnapshot, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'; // Import the storage functions from Firebase v9

const CreatePostScreen = ({ navigation }) => {

  const [newPost, setNewPost] = useState({
    cropname: '',
    title: '',
    description: '',
    image: null,
  });

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setNewPost({ ...newPost, image: result.uri });
    } else {
      alert('You did not select any image.')
    }
  };

  const handleAddPost = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        // Upload image to Firebase Storage
        if (newPost.image) {
          const response = await fetch(newPost.image);
          const blob = await response.blob();
          const storageRef = ref(storage, 'images/' + Date.now()); // Generate a unique filename using the current timestamp
          const uploadTask = uploadBytesResumable(storageRef, blob);
  
          uploadTask.on('state_changed',
            (snapshot) => {
              // Progress updates here (optional)
            },
            (error) => {
              console.error('Error uploading image:', error);
            },
            () => {
              // Upload completed successfully, now we can get the download URL
              getDownloadURL(uploadTask.snapshot.ref)
                .then((downloadURL) => {
                  // Now you can use the download URL to store it in Firestore or use it as needed
                  // console.log('Download URL:', downloadURL);
  
                  // Add post to Firestore (with downloadURL)
                  const postRef = collection(db, 'posts');
                  addDoc(postRef, {
                    ...newPost,
                    createdAt: serverTimestamp(),
                    uid: user.uid,
                    image: downloadURL, // Add the downloadURL to the post data
                  });
                })
                .catch((error) => {
                  console.error('Error getting download URL:', error);
                });
            }
          );
        }
  
        setNewPost({
          cropname: '',
          title: '',
          description: '',
          image: null,
        });
      } else {
        Alert.alert('Please log in to create a post.');
      }
    } catch (error) {
      console.error('Error adding post:', error);
    }
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
              placeholder="Crop Name"
              style={styles.input}
              value={newPost.cropname}
              onChangeText={(text) => setNewPost({ ...newPost, cropname: text })}
            />
            <TextInput
              placeholder="Your question to the community"
              style={styles.input}
              value={newPost.title}
              onChangeText={(text) => setNewPost({ ...newPost, title: text })}
            />
            <TextInput
              placeholder="Description to your problem"
              style={styles.input}
              multiline
              value={newPost.description}
              onChangeText={(text) => setNewPost({ ...newPost, description: text })}
            />
            <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
        {newPost.image ? (
          <Image source={{ uri: newPost.image }} style={styles.image} />
        ) : (
          <Text style={styles.imagePlaceholder}>Add an image</Text>
        )}
      </TouchableOpacity>
            <Button icon="send" mode="contained" onPress={handleAddPost}>
                Create
            </Button>
            
      </ScrollView>

    </View>
  );
};

const styles = StyleSheet.create({ 
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    width: 200,
    height: 200,
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 5,
  },
  imagePlaceholder: {
    fontSize: 16,
    color: '#aaa',
  },
  input: {
    marginBottom: 10,
    paddingHorizontal: 10,
  },
})

export default CreatePostScreen;
