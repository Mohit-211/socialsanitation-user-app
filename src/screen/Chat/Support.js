import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  BackHandler,
  Modal,
  Alert,
  Dimensions,
  Button,
  ScrollView,
  ActivityIndicator,
  TextInput,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import RNFetchBlob from 'rn-fetch-blob';
import ImagePicker from 'react-native-image-crop-picker';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { base } from '../../api/Constants';
import moment from 'moment';
import Loading from '../../components/Loading';
import mime from 'mime';
import Toast from 'react-native-toast-message';
import { getApiCall, postApiCall } from '../../services/AppSetting';
import AsyncStorage from '@react-native-async-storage/async-storage';
import storage from '@react-native-firebase/storage';
import { firebase } from '@react-native-firebase/database';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Carousel from 'react-native-snap-carousel';
import axios from '../../api/axios';
import { tw } from '../../utils/styling';
import { db } from '../../utils/firebase';
import LinearGradient from 'react-native-linear-gradient';

const Support = (props) => {
  const route = useRoute()
  const { receiverId, senderId,title } = route?.params;
  const [message, setMesage] = useState('');

  const [messageList, setMessageList] = useState([]);
  const { width: screenWidth } = Dimensions.get('window');
  const [modalVisibleImage, setModalVisibleImage] = useState(false);
  const [imageUri, setImageUri] = useState('');
  const [imageName, setImageName] = useState('');

  const [videoModel, setVideoModel] = useState(false);
  const [videoUrl, setVideoUrl] = useState(0);
  const [profileData, setProfileData] = useState(null);
  const [messageSend, setMessageSend] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [imageList, setImageList] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const carouselRef = useRef();
  const backgroundColor = "#ffffff";
  console.log(senderId, "-=-=-=sender", receiverId);

  useFocusEffect(
    React.useCallback(() => {
      restrict_actions_for_guest();

    }, [props]),
  );

  useFocusEffect(
    useCallback(() => {
      markMessageAsRead();
    }, [props]),
  );

  const [messages, setMessages] = useState([])

  console.log("-=-=-=", receiverId, "-=-=-=senderid", senderId);

  const flatListRef = useRef();

  useEffect(() => {
    if (!senderId || !receiverId) return;

    const messagesRef = db.ref(`USER_ADMIN_CHAT/messages/USER_${senderId}/ADMIN_${receiverId}`);

    const unsubscribe = messagesRef.on('value', snapshot => {
      let data = snapshot.val();
      if (data) {
        let items = Object.entries(data);
        items.sort(([keyA, itemA], [keyB, itemB]) => itemB.timestamp - itemA.timestamp);

        const lastUnreadReceivedMessage = items.find(
          ([key, item]) => item.source === 'RECEIVER' && item.read === false
        );

        if (lastUnreadReceivedMessage) {
          const [key, item] = lastUnreadReceivedMessage;
          messagesRef.child(key).update({ read: true });
        }

        setMessages(items.map(([key, value]) => value));
        flatListRef.current?.scrollToEnd({ animated: true });
      } else {
        setMessages([]);
      }
    });

    return () => messagesRef.off('value', unsubscribe);
  }, [senderId, receiverId]);

  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const markMessageAsRead = async () => {

  };

  const sendImages = async () => {
    console.log(imageList);
    setLoading(true);
    const formData = new FormData();
    imageList.forEach((image, index) => {
      const newImageUri = 'file:///' + image.path.split('file:/').join('');
      formData.append('images', {
        uri: newImageUri,
        type: mime.getType(newImageUri),
        name: newImageUri.split('/').pop(),
      });
    });
    formData.append('receiverUserId', receiverId);
    formData.append('message', '');
    console.log(formData,"formdata-=");

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: base.sendImages,
      headers: {
        'x-access-token': await AsyncStorage.getItem('token'),
        role_id: '6',
        'Content-Type': 'multipart/form-data',
      },
      data: formData,
    };
    console.log(config);
    axios
      .request(config)
      .then(response => {
        console.log(JSON.stringify(response.data),"-=-=-=image upload");
        setLoading(false);
        Toast.show({ type: 'success', text1: 'Images sent successfully' });
        setImageList([]);
        setModalOpen(false);
      })
      .catch(error => {

        setLoading(false)
        setImageList([]);
        console.error(error.response);
        console.error(error.response);
        console.error(error.message);
      });
  };

  const onSend = async () => {
    if(!message) return
    try {
      const token = await AsyncStorage.getItem("token");
      console.log("TOKEN GET ON MESSAGE SCREEN ", token);
      const roleId = await AsyncStorage.getItem("roleId");
      if (!roleId) {
        console.error("No role_id found in storage");
        return;
      }

      const response = await axios.post(
        base.sendMessage,
        {
          receiverUserId: receiverId,
          message: message,

        },
        {
          headers: {
            "x-access-token": token,
            role_id: roleId,
          },
        }
      );
      console.log("response of data on message screen", response);
      if (response.status === 200) {
        console.log("🟢 message sent successfully:", response.data);

        const newMessage = {
          id: String(new Date().getTime()),
          source: "SENDER",
          message: message,
          timestamp: moment.now(),
        };

        flatListRef.current?.scrollToEnd({ animated: true });

        setMesage("")

      }
    } catch (error) {
      console.log("❌ Error sending message:", error.response?.data || error.message);
    }
  };

  const getProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await axios.get(base.getUserProfile, {
        headers: {
          'x-access-token': token,
          role_id: 6,
        },
      });

      console.log(res.data);
      if (res.data.status == 200) {
        setProfileData(res.data.data?.profile);
      } else {
        setLoading(false);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: res.data.message,
        });

      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Something went wrong',
      });
      navigation.navigate('Home');
    }
  };

  const restrict_actions_for_guest = async () => {
    let guest = await AsyncStorage.getItem('guestID');
    if (guest) {
      Alert.alert(
        'Guest Account',
        'You are a guest , Please Login with a real account to get access to this feature',
        [
          {
            text: 'Cancel',
            onPress: () => props.navigation.goBack(),
            style: 'cancel',
          },
          {
            text: 'OK',
            onPress: async () => {
              AsyncStorage.clear();
              props.navigation.navigate('Login');
            },
          },
        ],
      );
    }
  };

  const handler = () => {
    props.navigation.goBack();
  };

  useEffect(() => {
    const backAction = () => {
      handler();
      getProfile();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [props]);

  const add_image = async () => {
    try {
      const res = await ImagePicker.openPicker({
        mediaType: 'photo',
        multiple: true,
        compressImageQuality: 0.8,
        compressImageMaxWidth: 1000,
        compressImageMaxHeight: 1000,
      });
      setModalOpen(true);

      setImageList(res);
    } catch (error) { }
  };

  const renderModalItem = (item, index) => {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',

        }}>
        <TouchableOpacity
          style={{
            padding: 12,
            backgroundColor: '#086FB1',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => {
            removeImage(index);
          }}>
          <AntDesign name="closecircle" size={24} color="#fff" />
        </TouchableOpacity>
        <Image
          source={{ uri: item.path }}
          style={{
            height: 400,
            width: 350,
            marginHorizontal: 10,
            borderRadius: 8,
          }}
        />
      </View>
    );
  };

  const downloadImage = async url => {
    const { config, fs } = RNFetchBlob;
    let PictureDir = fs.dirs.PictureDir;
    let options = {
      fileCache: true,
      addAndroidDownloads: {

        useDownloadManager: true,
        notification: true,
        path:
          PictureDir +
          '/image_' +
          Math.floor(new Date().getTime() + Math.random() * Math.floor(1000)) +
          '.jpg',
        description: 'Image',
      },
    };
    config(options)
      .fetch('GET', url)
      .then(res => {

        console.log('res -> ', JSON.stringify(res));
        Toast.show({ type: 'success', text1: 'Image downloaded successfully' });
        setSelectedImage('');
      });

  };

  const renderItem = ({ item, index }) => {
    console.log(item, 'ITEM');

    const isImageMessage = Array.isArray(item?.imageUrls) && item.imageUrls.length > 0;
    const isReceiver = item.source === 'RECEIVER';

    if (isImageMessage) {
      return (
        <View
          key={index}
          style={{
            marginHorizontal: 10,
            maxWidth: 250,
            alignSelf: isReceiver ? 'flex-start' : 'flex-end',
          }}>
          {item.imageUrls.map((image, imgIndex) => (
            <TouchableOpacity
              key={imgIndex}
              onPress={() => setSelectedImage(image)}
              style={{
                alignSelf: isReceiver ? 'flex-start' : 'flex-end',
                borderRadius: 12,
                marginTop: 5,
                padding: 5,
                paddingVertical: 15,
                flexDirection: 'row',
                shadowColor: '#333333',
                elevation: isReceiver ? 0 : 3,
                backgroundColor: isReceiver ? '#F7F3EF' : '#888',
              }}>
              <Image
                source={{ uri: image }}
                style={{
                  height: 150,
                  width: 150,
                  resizeMode: 'cover',
                  alignSelf: 'center',
                }}
              />
            </TouchableOpacity>
          ))}
          <Text
            style={{
              color: '#818181',
              fontSize: 12,
              marginHorizontal: 7,
              alignSelf: isReceiver ? 'flex-start' : 'flex-end',
            }}>
            {moment(item.timestamp).format('LT')}
          </Text>
        </View>
      );
    }

    return (
      <View
        key={index}
        style={{
          marginHorizontal: 10,
          maxWidth: 250,
          alignSelf: isReceiver ? 'flex-start' : 'flex-end',
        }}>
        <TouchableOpacity
          onPress={() => { }}
          style={{
            alignSelf: isReceiver ? 'flex-start' : 'flex-end',
            borderRadius: 12,
            marginTop: 5,
            padding: 5,
            paddingVertical: 15,
            flexDirection: 'row',
            shadowColor: '#333333',
            elevation: isReceiver ? 0 : 3,
            backgroundColor: isReceiver ? '#F7F3EF' : '#888',
          }}>
          <View style={{ marginHorizontal: 10 }}>
            <Text style={{ color: '#333333' }}>{item?.message}</Text>
          </View>
        </TouchableOpacity>
        <Text
          style={{
            color: '#818181',
            fontSize: 12,
            marginHorizontal: 7,
            alignSelf: isReceiver ? 'flex-start' : 'flex-end',
          }}>
          {moment(item.timestamp).format('LT')}
        </Text>
      </View>
    );
  };

  console.log(imageList.length);

  const uploadVideo = async imageUri => {
    if (!imageUri) {
      Alert.alert('Please pick a video before uploading');
      return;
    }

    const fileName = imageUri.substring(imageUri.lastIndexOf('/') + 1);

    const reference = storage().ref(`/chat_images/${fileName}`);

    try {
      await reference.putFile(imageUri);

      const url = await storage()
        .ref(`/chat_images/${fileName}`)
        .getDownloadURL();

      console.log('url=========' + url);

    } catch (error) {
      Alert.alert('Upload failed', error.message);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setImageList([]);
  };

  const navigation = useNavigation();

  const removeImage = index => {
    const newList = [...imageList];
    newList.splice(index, 1);
    setImageList(newList);
    setCurrentIndex(0);
    carouselRef.current.snapToItem(currentIndex - 1);
    if (newList.length == 0) {
      setModalOpen(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={backgroundColor} barStyle="dark-content" />

      {}
      <View style={[tw`h-[10%] flex-row  px-1 gap-1`, { backgroundColor }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={tw`p-2 items-center justify-center my-auto bg-transparent`}>
          <Entypo name="chevron-small-left" size={35} color="#000" />
        </TouchableOpacity>
        <Text style={tw`text-black my-auto text-xl font-medium `}>
         {title ?? "Unknown"}
        </Text>
      </View>
      {selectedImage && (
        <Modal
          transparent
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,.8)',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <SafeAreaView
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,.7)',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              style={{
                position: 'absolute',
                top: '22%',
                right: '10%',
                zIndex: 999,
              }}
              onPress={() => {
                setSelectedImage('');
              }}>
              <AntDesign name="closecircle" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                downloadImage(selectedImage);
              }}>
              <Image
                source={{ uri: selectedImage }}
                style={{
                  height: 400,
                  width: 330,
                  resizeMode: 'contain',
                  alignSelf: 'center',
                }}
              />
            </TouchableOpacity>
          </SafeAreaView>
        </Modal>
      )}
      {
        <Modal
          visible={modalOpen}
          onRequestClose={() => {
            closeModal();
          }}
          transparent
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,.8)',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <SafeAreaView
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,.6)',
              justifyContent: 'center',
            }}>
            {
              <>
                <TouchableOpacity
                  style={{
                    position: 'absolute',
                    top: Platform.OS === 'android' ? 20 : 100,
                    right: 20,
                    zIndex: 999,
                  }}
                  onPress={() => {
                    closeModal();
                    setImageList([]);
                  }}>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: 18,
                      fontWeight: '700',
                      marginHorizontal: 16,
                    }}>
                    Cancel
                  </Text>
                </TouchableOpacity>

                {loading ? (
                  <Loading />
                ) : (
                  <>
                    <Carousel
                      ref={carouselRef}
                      style={{}}
                      data={imageList}
                      renderItem={({ item, index }) =>
                        renderModalItem(item, index)
                      }

                      currentIndex={0}
                      sliderWidth={screenWidth}
                      itemWidth={screenWidth - 80}
                      layout={'default'}
                      firstItem={currentIndex}
                      onSnapToItem={index => setCurrentIndex(index)}
                    />
                  </>
                )}

                <TouchableOpacity
                  disabled={loading}
                  onPress={() => {
                    sendImages();
                  }}
                  style={{
                    backgroundColor: '#086FB1',
                    padding: 12,
                    position: 'absolute',
                    bottom: 20,

                    width: screenWidth - 32,
                    borderRadius: 20,
                    marginHorizontal: 16,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginVertical: 20,
                  }}>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: 18,
                      fontWeight: '700',
                      marginHorizontal: 16,
                    }}>
                    Send
                  </Text>
                </TouchableOpacity>
              </>
            }
          </SafeAreaView>
        </Modal>
      }
      <SafeAreaView style={{ flex: 1 }}>
        {

}

        <View
          style={{
            flex: 7,
            backgroundColor: '#fff',
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
          }}>
          <FlatList
            ref={flatListRef}
            style={{ borderTopEndRadius: 30, borderTopStartRadius: 30 }}
            data={[...messages].reverse()}

            keyExtractor={(item, index) => item?.id || index.toString()}
            renderItem={renderItem}

            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
          />
        </View>
        <View
          style={{
            padding: 10,
            width: screenWidth,
            backgroundColor: '#fff',
            alignContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',

          }}>
          <View
            style={{
              width: screenWidth,
              flexDirection: 'row',
              paddingHorizontal: 12,
              alignItems: 'center',
              gap: 6,
              backgroundColor: '#fff',
            }}>
            <TextInput
              value={message}
              onChangeText={text => setMesage(text)}
              style={{
                flex: 1,
                color: '#333',
                paddingHorizontal: 10,
                fontSize: 16,
                backgroundColor: '#F7F3EF',
                borderRadius: 30,
                height: 50
              }}
              placeholder="Type a message..."
              placeholderTextColor="#B2B2B2"
            />
            <TouchableOpacity
              onPress={() => {
                add_image();
              }}
              style={{}}>
              <AntDesign name="pluscircleo" size={24} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                height: 34,
                width: 34,
                borderRadius: 30,
                backgroundColor: '#086FB1',
                alignItems: 'center',
                justifyContent: 'center',

                marginHorizontal: 10,
              }}
              onPress={onSend}>
              <Ionicons name="send" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
        {

}
        {

}
      </SafeAreaView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  txtInput: {

    height: 30,
    width: 200,
    alignSelf: 'center',
    borderRadius: 5,
    flexDirection: 'row',
    borderWidth: 1,

  },
  messageContainer: {
    padding: 10,
    marginVertical: 2,
    maxWidth: "70%",

  },
  myMessageContainer: {
    alignSelf: "flex-end",
  },
  myMessage: { alignSelf: "flex-end" },
  otherMessageContainer: {
    alignSelf: "flex-start",
  },
  myMessage: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 15,
    borderBottomRightRadius: 0,
  },
  otherMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#DFE2E8",
    borderBottomLeftRadius: 0,
  },
  messageText: { fontSize: 14, color: "#000" },
});

export default Support;
