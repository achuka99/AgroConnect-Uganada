import React, { useEffect, useState } from 'react';
import { View, ScrollView, Image, Alert, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Appbar, Button, Chip, Text  } from 'react-native-paper';
import axios from 'axios';
import { collection, query, orderBy, onSnapshot, addDoc, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { Avatar, Card, IconButton } from 'react-native-paper';
import CommentCard from '../Components/CommentCard';

const PostDetailsScreen = ({ navigation, route }) => {
  const { postId, postTitle, postDescription, image, cropName } = route.params;
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const user = auth.currentUser;
  const [userData, setUserData] = useState(null);


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const q = query(collection(db, 'users'), where('uid', '==', user.uid));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          const userData = { id: userDoc.id, ...userDoc.data() };
          setUserData(userData);
        } else {
          console.log('User not found.');
          setUserData(null);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Error fetching user data.');
      } 
    };

    fetchUserData();
  }, []);

  // Translation state variables
  const [translatedTitle, setTranslatedTitle] = useState('');
  const [translatedDescription, setTranslatedDescription] = useState('');
  const [translatedComments, setTranslatedComments] = useState([]);
  const [isTranslated, setIsTranslated] = useState(false);

  // Translation function
  const translateText = async (text) => {
    try {
      const payload = {
        source_language: 'English',
        target_language: userData.language, // Replace with the farmer's selected language
        text: text,
      };
  
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJCcnVuby5Tc2VraXdlcmUiLCJleHAiOjQ4Mzg2ODkxNjB9.o3u4vpxvSd10b552mS5FkATKAVN_R2_uSwC8tP0G-I8';
  
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      };
  
      const response = await axios.post('https://sunbird-ai-api-5bq6okiwgq-ew.a.run.app/tasks/translate', payload, {
        headers: headers,
      });
  
      if (response.status === 200) {
        const translatedText = response.data.text;
        return translatedText;
      } else {
        console.error('Translation failed:', response.status);
        return '';
      }
    } catch (error) {
      console.error('Translation request failed:', error);
      return '';
    }
  };

// Fetch comments from Firebase based on postId
useEffect(() => {
  const q = query(collection(db, 'comments'), where('post_id', '==', postId), orderBy('createdAt', 'asc'));
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const commentsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setComments(commentsData);
  });

  return () => unsubscribe();
}, [postId]);

  const handleCommentSubmit = async () => {
    try {
      // Add a new comment to Firebase
      const user = auth.currentUser;

        // Check if the new comment is not empty or contains only spaces
        if (newComment.trim() === '') {
          // Display an alert or toast to inform the user that the fields cannot be empty
          alert('Comment cannot be empty or contain only spaces');
          return;
        }

      if(user) {
        const newCommentData = {
          uid: user.uid, // Replace with the authenticated user's ID
          post_id: postId,
          content: newComment,
          createdAt: new Date(),
        };
  
        await addDoc(collection(db, 'comments'), newCommentData);
  
        // Clear the new comment input field
        setNewComment('');
      }else {
        Alert.alert('Please log in to add a comment.');
      }
      
    } catch (error) {
      console.error('Create comment error:', error);
    }
  };

  // Translate the post details and comments
  const translatePostDetails = async () => {
    const translatedPostTitle = await translateText(postTitle);
    const translatedPostDescription = await translateText(postDescription);
    const translatedPostComments = await Promise.all(comments.map((comment) => translateText(comment.content)));

    setTranslatedTitle(translatedPostTitle);
    setTranslatedDescription(translatedPostDescription);
    setTranslatedComments(translatedPostComments);
  };

  useEffect(() => {
    translatePostDetails();
  }, [comments]);

  const handleTranslateToggle = () => {
    setIsTranslated(!isTranslated);
  };

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Share your comment" />
      </Appbar.Header>

      <Image source={{ uri: image }} style={{ height: 200, resizeMode: 'cover' }} />
      <View style={{margin: 10}}>
            <Button icon="translate" mode="text" onPress={handleTranslateToggle}>
              {isTranslated ? 'Back to English' : 'Translate'}
            </Button>
            
            <Chip icon="leaf" mode='flat' style={{ width: 200}} ><Text variant="bodySmall" style={{  marginTop: -10}}>{cropName}</Text></Chip>

            <Text variant="titleMedium">{isTranslated ? translatedTitle || postTitle : postTitle}</Text>
            <Text variant="bodyMedium">{isTranslated ? translatedDescription || postDescription : postDescription}</Text>

            <Text variant="labelMedium" style={{ color: 'green' }}>Comments</Text>
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1, margin: 10, }} showsVerticalScrollIndicator={false}>
        <View style={{ }}>
          <View>
            {isTranslated
              ? translatedComments.map((comment, index) => (
                    <Card  mode='contained' style={{ marginBottom: 10, width: '100%', }}> 
                      <Card.Content>
                        <Text variant="bodyMedium"  style={{ }}>{comment}</Text>
                      </Card.Content>
                    </Card>
                ))
              : comments.map((comment, index) => (
                  <CommentCard
                    key={comment.id}
                    comment={comment}
                  />
                ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
      <TextInput
        value={newComment} 
        onChangeText={setNewComment} 
        placeholder="Write a comment" 
        style={styles.textInput}
      />
      <TouchableOpacity activeOpacity={0.5} style={styles.sendButton}>
              <IconButton
                  icon="send"
                  //iconColor={MD3Colors.error50}
                  size={20}
                  style={styles.sendButton}
                  onPress={handleCommentSubmit}
               />
      </TouchableOpacity>
    </View>

    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 2,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#d3d3d3',
    height: 40,
    borderRadius: 20,
    marginLeft: 10,
    marginRight: 10,
    bottom: 0,
    paddingLeft: 10,
    borderWidth: 0, // Remove the border
  },
  sendButton: {
    marginRight: 10,
  },
});

export default PostDetailsScreen;
