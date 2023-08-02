import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { FAB } from 'react-native-paper';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../firebase';
import AppBar from '../Components/AppBar';
import PostCard from '../Components/PostCard';

const CommunityScreen = ({ navigation }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPosts(postsData);
    });

    return () => unsubscribe();
  }, []);

  return (
    <View style={{ flex: 1 }}>
  
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onPress={() =>
              navigation.navigate('PostDetails', {
                postId: post.id,
                postTitle: post.title,
                postDescription: post.description,
                image: post.image,
                cropName: post.cropname,
              })
            }
          />
        ))}
      </ScrollView>

      {/* FAB */}
      <FAB icon="pencil-plus" style={styles.fab} onPress={() => navigation.navigate('CreatePosts')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 2,
    padding: 2,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default CommunityScreen;
