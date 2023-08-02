import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { ActivityIndicator, Avatar, Card, Text, Chip } from 'react-native-paper';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const PostCard = ({ post, onPress }) => {
  const { uid, cropname, image, title, description, createdAt } = post;
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const q = query(collection(db, 'users'), where('uid', '==', uid));
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
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [uid]);

  const renderUserImage = () => {
    if (userData && userData.image) {
      return <Avatar.Image size={35} source={{ uri: userData.image }} />;
    } else {
      return <Avatar.Icon size={35} icon="account" />;
    }
  };



  const getTimeSincePost = (createdAt) => {
    if (!createdAt) {
        return 'Unknown time';
      }
    // Convert the server timestamp (Firebase timestamp) to JavaScript Date
    const postTime = createdAt.toDate();
    const currentTime = Date.now();
    const timeDifference = currentTime - postTime.getTime();

    // Calculate time units
    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);

    // Choose appropriate time unit
    if (months > 0) {
      return `${months} ${months === 1 ? 'month' : 'months'} ago`;
    } else if (days > 0) {
      return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    } else if (hours > 0) {
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else if (minutes > 0) {
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    } else {
      return `${seconds} ${seconds === 1 ? 'second' : 'seconds'} ago`;
    }
  };

  return (
    <Card onPress={onPress} mode='contained' style={{ marginBottom: 10,width: '100%' }}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="green" />
        </View>
      ) : (
        <>
          <Card.Cover source={{ uri: image }} style={{ marginBottom: -10 }}/>
          <Card.Title
            titleVariant="titleSmall"
            title={userData ? userData.name : 'Unknown'}
            titleStyle={{marginBottom: -15}}
            subtitle={userData ? userData.district : 'Unknown Location'}
            left={renderUserImage}
            right={() => <Text variant="bodySmall" style={{paddingRight: 20, color: 'green'}}>{getTimeSincePost(createdAt)}</Text>}
          />
          <Card.Content>
            
            <Chip icon="leaf" mode='flat' style={{ width: 200}} ><Text variant="bodySmall" style={{  marginTop: -10}}>{cropname}</Text></Chip>
            <Text variant="titleMedium" numberOfLines={1}>{title}</Text>
            <Text variant="bodyMedium" numberOfLines={1} style={{ marginBottom: 10}}>{description}</Text>
          </Card.Content>
        </>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 300, // Adjust the height as needed
  },
});

export default PostCard;
