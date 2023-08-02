import { View} from 'react-native'
import React, { useEffect, useState } from 'react'
import { Avatar, Card, Text } from 'react-native-paper';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const CommentCard = ({ comment , onPress }) => {
  const { uid, content } = comment;
  const [userData, setUserData] = useState(null);


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

  return (
    <Card mode='contained' style={{ marginBottom: 10, width: '100%' }}> 
          {/* <Card.Title
            titleVariant="titleSmall"
            title={userData ? userData.name : ''}
            titleStyle={{marginBottom: -10, marginTop: -10}}
            subtitle={userData ? userData.district : ''}
            left={renderUserImage} 
          /> */}
          <Card.Content>
            <Text variant="bodyMedium"  style={{  }}>{content}</Text>
          </Card.Content>
    </Card>
  )
}

export default CommentCard