import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { View,  Image, TouchableOpacity, ScrollView, StyleSheet, } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {  addLike, removeLike, selectPosts, } from '../src/reducers/communitySelectors';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import AppBar from '../Components/AppBar';
import { fetchPosts } from '../src/features/community/communitySlice';
import { Avatar, Button, Card, FAB, Text } from 'react-native-paper';

const LeftContent = props => <Avatar.Icon {...props} icon="folder" />

const PostCard = ({ image, title, description, likes, onPress, onLike, onUnlike }) => {
  return (
         <Card onPress={onPress} style={{ marginBottom: 10}} >
                {/* <Card.Title title="Achuka" subtitle="Nigeria" left={LeftContent} />   */}
                <Card.Cover source={{ uri: image }} />
                <Card.Content>
                <Text variant="titleLarge">{title}</Text>
                <Text variant="bodyMedium">{description}</Text>
                </Card.Content>
        </Card>

  );
};

const CommunityScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const posts = useSelector(selectPosts);
  console.log(posts)

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  const handleLike = (postId) => {
    dispatch(addLike(postId));
  };

  const handleUnlike = (postId) => {
    dispatch(removeLike(postId));
  };

  return (
    <View style={{ flex: 1, }}>
      <AppBar />

      <ScrollView contentContainerStyle={{ margin: 10, padding: 2,}}
      showsVerticalScrollIndicator={false}
       >
        {posts.map((post, index) => (
          <PostCard
            key={index}
            image={post.image}
            title={post.title}
            description={post.description}
            likes={post.likes}
            onPress={() => navigation.navigate('PostDetails', { postId: post.id })}
            onLike={() => handleLike(post.id)}
            onUnlike={() => handleUnlike(post.id)}
          />
        ))}
      </ScrollView>
      <FAB
            icon="plus"
            style={styles.fab}
            onPress={() => navigation.navigate('CreatePosts')}
        />
     
    </View>
  );
};

const styles = StyleSheet.create({
    fab: {
      position: 'absolute',
      margin: 16,
      right: 0,
      bottom: 0,
    },
  })

export default CommunityScreen;
