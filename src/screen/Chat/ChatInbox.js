import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import images from '../../assets/images';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import axios from '../../api/axios';
import { base } from '../../api/Constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';

const { height, width } = Dimensions.get('window');

const ChatInbox = () => {
  const [ContactDeatils, setContactDeatils] = useState('');
  const [chatList, setChatList] = useState([])
  const [senderId, setSenderId] = useState("")

  const chatDetails = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      console.log("TOKEN GET ON CHAT SCREEN ", token);
      const roleId = await AsyncStorage.getItem("roleId");
      const userID = await AsyncStorage.getItem("userID");
      if (!roleId) {
        console.error("No role_id found in storage");
        return;
      }
      const response = await axios.get(
        base.chatList,

        {
          headers: {
            "x-access-token": token,
            role_id: roleId,
          },
        }
      );
      console.log("response of data on cchat screen", response.data);
      if (response.status == 200) {
        console.log("🟢 chat successfully:", response.data);
        setChatList(response.data.data)
        setSenderId(userID)

      }
    } catch (error) {
      console.log(
        "❌ Error applying chat:",
        error.response?.data || error.message
      );
    }
  }

useFocusEffect(
  React.useCallback(()=>{
chatDetails()
  },[])
)

  const formatDate = dateString => {
    const date = new Date(dateString);

    const day = date.getDate().toString().padStart(2, '0'); 
    const month = date.toLocaleString('en-US', { month: 'short' }); 
    const year = date.getFullYear().toString().slice(-2); 

    return `${day} - ${month} - ${year}`;
  };

  const navigation = useNavigation();
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => navigation.navigate('support',{receiverId:item.id,senderId:senderId,title:item.name})}>
      <Image source={images.profile} style={styles.avatar} />
      <View style={styles.chatDetails}>
        {}
        <Text style={styles.name}>{item.name}</Text>
        {}
        <Text style={styles.message}>{item.displayMessage}</Text>
      </View>
      <Text style={styles.time}>{moment(item.lastMessageTime).format('hh:mm A')}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titleTxt}>Chat</Text>
      {chatList.length > 0 ?
        <FlatList
          data={chatList}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
        :
        <View style={styles.chat}>
          <Text style={styles.err}>No Chat Found</Text>
        </View>
      }
      {}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  titleTxt: {
    color: '#000',
    fontWeight: '700',
    fontSize: 18,
    marginTop: height / 28,

    marginBottom: '5%',
    marginHorizontal: 20
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    marginHorizontal: 20
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#c9c9c9',
  },
  chatDetails: {
    flex: 1,
    marginLeft: 10,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#000',
  },
  message: {
    color: '#555',
    fontSize: 14,
    marginTop: 2,
  },
  time: {
    color: '#999',
    fontSize: 12,
  },
  chat: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  err: {
    fontSize: 20,
    fontWeight: '600'
  }
});

export default ChatInbox;
