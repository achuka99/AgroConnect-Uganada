import { selectPostById } from '../src/reducers/communitySelectors';
import React, { useEffect, useState } from 'react';
import { View, Image, ScrollView, TextInput, TouchableOpacity} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { addComment, addLike, removeLike } from '../src/features/community/communitySlice';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import axios from 'axios';
import { Appbar, Button, Card, Text } from 'react-native-paper';

const PostDetailsScreen = ({ route, navigation }) => {
  const { postId } = route.params;
  const dispatch = useDispatch();
  const [comment, setComment] = useState('');

  // Translation state variables
  const [translatedTitle, setTranslatedTitle] = useState('');
  const [translatedDescription, setTranslatedDescription] = useState('');
  const [translatedComments, setTranslatedComments] = useState([]);
  const [isTranslated, setIsTranslated] = useState(false);

  // Use the selectPostById selector to retrieve the post
  const post = useSelector(selectPostById(postId));

  if (!post) {
    // Handle the case when the post is not found
    return (
      <View>
        <Text>Post not found</Text>
      </View>
    );
  }

  const { image, title, description } = post;

  // Translation function
  const translateText = async (text) => {
    try {
      const payload = {
        source_language: 'English',
        target_language: 'Luganda', // Replace with the farmer's selected language
        text: text,
      };

      const token = process.env.sunbird_api;

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

  // Translate the post details and comments
  const translatePostDetails = async () => {
    // Translate the title
    const translatedTitle = await translateText(post.title);
    setTranslatedTitle(translatedTitle);

    // Translate the description
    const translatedDescription = await translateText(post.description);
    setTranslatedDescription(translatedDescription);

    // Translate the comments
    const translatedComments = await Promise.all(post.comments.map((comment) => translateText(comment.text)));
    setTranslatedComments(translatedComments);
  };

  // Handle translation of comments when post changes
  useEffect(() => {
    if (post) {
      translatePostDetails();
    }
  }, [post]);

  const handleAddComment = () => {
    const timestamp = new Date().getTime(); // Generate a unique timestamp
    const newComment = {
      id: timestamp,
      text: comment,
    };

    dispatch(addComment({ postId, comment: newComment }));
    setComment('');
  };

  // Handle adding and removing likes
  const handleLike = () => {
    dispatch(addLike(postId));
  };

  const handleUnlike = () => {
    dispatch(removeLike(postId));
  };

  const handleTranslateToggle = () => {
    setIsTranslated(!isTranslated);
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'white', padding: 10, }}>
          <Appbar.Header>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title="Share your comment" />
          </Appbar.Header>

          <Card style={{}}>
                <Card.Cover source={{ uri: image }} />
          </Card>

          <Button icon="translate" mode="text" onPress={handleTranslateToggle}>
          {isTranslated ? 'Back to English' : 'Translate'}
         </Button>

          <Text>{isTranslated ? translatedTitle || title : title}</Text>
          <Text>{isTranslated ? translatedDescription || description : description}</Text>

           <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
            <TouchableOpacity onPress={handleLike}>
              <FontAwesome name="thumbs-up" size={24} color="green" />
            </TouchableOpacity>
            <Text style={{ marginLeft: 5 }}>{post.likes}</Text>
            <TouchableOpacity onPress={handleUnlike} style={{ marginLeft: 10 }}>
              <FontAwesome name="thumbs-down" size={24} color="green" />
            </TouchableOpacity>
          </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View style={{ margin: 20 }}>
          
          <View>
            {isTranslated
              ? translatedComments.map((comment, index) => (
                  <View key={index} style={{ backgroundColor: '#f2f2f2', borderRadius: 5, padding: 10, marginBottom: 10 }}>
                    <Text>{comment}</Text>
                  </View>
                ))
              : post.comments.map((comment, index) => (
                  <View key={index} style={{ backgroundColor: '#f2f2f2', borderRadius: 5, padding: 10, marginBottom: 10 }}>
                    <Text>{comment.text}</Text>
                  </View>
                ))}
          </View>
        </View>
      </ScrollView>
      <View style={{ margin: 20 }}>
        <TextInput
          value={comment}
          onChangeText={setComment}
          style={{ fontSize: 14, borderWidth: 1, borderColor: 'gray', padding: 5, borderRadius: 5, marginBottom: 10 }}
          placeholder="Add a comment"
        />
        <Button icon="send" mode="contained" onPress={handleAddComment}>
            Submit Comment
        </Button>
      </View>
    </View>
  );
};

export default PostDetailsScreen;
