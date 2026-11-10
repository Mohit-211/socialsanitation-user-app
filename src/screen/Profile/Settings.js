import { View, Text, StatusBar, TouchableOpacity, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import { tw } from '../../utils/styling'
import { useNavigation, useRoute } from '@react-navigation/native';
import images from '../../assets/images';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { base } from '../../api/Constants';
import axios from '../../api/axios';
import Toast from 'react-native-toast-message';
import LoadingScreen from '../../components/Loading';
import WebView from 'react-native-webview';

const Settings = () => {
  const navigation = useNavigation();
  const {user, authorized}=  useRoute().params;
  const [loading, setLoading] = useState();
  const [notifications, setNotifications] = useState(user.notification_status);
  const [syncWithCalendar, setSyncWithCalendar] = useState(user.is_sync_by_google_calendar);
  const [showWebView, setShowWebView] = useState(false);
  const [authorizationUrl, setAuthorizationUrl] = useState('');

const onWebViewResponse = async (event) => {
  console.log(event.nativeEvent.url, authorizationUrl , "Result")
 if(event.nativeEvent.url.startsWith(`https://node.socialsanitation.com/`)){
  setShowWebView(false);

  navigation.goBack()
 }else{
  if(event.nativeEvent.url == "https://node.socialsanitation.com/authorization-failure/"){
  setShowWebView(false);
  Toast.show({
    type: 'error',
    text1: 'Error',
    text2: 'Authorization failed',
  });
  }

 }
};

const runFirst = `window.ReactNativeWebView.postMessage("this is message from web");`;

if(showWebView){
  console.log(authorizationUrl)
    return (

            <WebView
            style={{flex: 1}}
            collapsable
                source={{ uri: authorizationUrl }}

                injectedJavaScript={runFirst}
                userAgent={
           'Mozilla/5.0 (Linux; Android 12; Pixel a5 Build/SP1A.210812.016) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/114.0.5735.130 Mobile Safari/537.36'
        }

                onMessage={onWebViewResponse}

            />
    )
}
  console.log(user)
  const deleteAccount =  () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account?",
      [
        {
          text: "Cancel",
          onPress: () => {
            return;
          },
          style: "cancel"
        },
        { text: "OK", onPress: async () => {
          setLoading(true)
          try {
            const token = await AsyncStorage.getItem('token');
            const res = await axios.delete(base.deleteAccount , {
              headers : {
                'x-access-token' : token
              }
            })

            setLoading(false)

            if(res.data.status == 200){
              await AsyncStorage.clear();
              navigation.navigate('Login')
              Toast.show({
                type : 'success',
                text1 : 'Success',
                text2 : res.data.message
              })
            }else{
              Toast.show({
                type : 'error',
                text1 : 'Error',
                text2 : res.data.message
              })
            }
          } catch (error) {
            setLoading(false)
            console.log(error.message) 
          }
        } }
      ]
    );
  }

  const toggleNotifications = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await axios.post(base.notifications , {} , {
        headers : {
          'x-access-token' : token
        }
      })
     if(res.data.status == 200){
        console.log(res.data)
        setNotifications(!notifications)
      }
    } catch (error) {
      console.log(error)
    }

  }

  const authorizeURL = async () => {
    const token = await AsyncStorage.getItem("token")
    try {
        console.log("Hello World")
        const res = await axios.get(base.authorize , {
            headers : {
                'x-access-token' : token,
                role_id : 6,
            }
        })
        console.log(res.data)
        if(res.status == 200){
            setAuthorizationUrl(res.data.authorizationUrl);
            setShowWebView(true);
        }

    } catch (error) {
        console.log(error)

    }
}
  const toggleSyncWithCalendar = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await axios.post(base.syncWithCalendar , {} , {
        headers : {
          'x-access-token' : token,
          role_id : 6
        }
      })
      if(res.status == 200){
        setSyncWithCalendar(!syncWithCalendar)
      }
    } catch (error) {
      console.log(error)
      Toast.show({
        type : 'error',
        text1 : 'Something went wrong'
      })
    }

  }

if(loading){
  return <LoadingScreen/>
}
  return (
    <View style={tw`flex-1 `}>
    <StatusBar backgroundColor="#086FB1" barStyle="light-content" />
    {}

    <View style={tw`h-[10%] bg-[#086FB1] flex-row  px-4 gap-4   `}>
    <TouchableOpacity onPress={() => navigation.goBack()} style={tw`p-2    items-center justify-center  my-auto bg-transparent  `}>

  <AntDesign name="arrowleft" size={28} color="#fff" />

</TouchableOpacity>

<Text style={tw`text-white my-auto text-xl font-medium  `}>
  Settings
</Text>

</View>
<View style={tw`w-[90%] self-center my-8 gap-5 `}>
{

}
  <TouchableOpacity
  onPress={() => navigation.navigate("ChangePassword")}
  style={tw`flex-row items-center justify-between border-[.3px] border-neutral-400  w-[100%] rounded-lg px-3  py-4  `}
  >

  <Text style={tw`text-neutral-800  text-base`}>Change Password</Text>
  <Image source={images.arrowRight} tintColor={'#000'} style={tw`w-5 h-5  `}/>

  </TouchableOpacity>
  <TouchableOpacity onPress={() => deleteAccount()}
  style={tw`flex-row items-center justify-between border-[.3px] border-neutral-400  w-[100%] rounded-lg px-3  py-4  `}
  >

  <Text style={tw`text-neutral-800  text-base`}>Delete Account </Text>
  <Image source={images.arrowRight} tintColor={'#000'} style={tw`w-5 h-5  `}/>

  </TouchableOpacity>
  <TouchableOpacity   onPress={() => navigation.navigate('TermsConditions')}
  style={tw`flex-row items-center justify-between border-[.3px] border-neutral-400  w-[100%] rounded-lg px-3  py-4  `}
  >

  <Text style={tw`text-neutral-800  text-base`}>Terms & Conditions  </Text>
  <Image source={images.arrowRight} tintColor={'#000'} style={tw`w-5 h-5  `}/>

  </TouchableOpacity>

  <View
  style={tw`flex-row items-center justify-between border-[.3px] border-neutral-400  w-[100%] rounded-lg pl-3  py-4  `}
  >

  <Text style={tw`text-neutral-800  text-base`} > Allow Notifications </Text>
  <BouncyCheckbox 
  isChecked={notifications}
  onPress={() => toggleNotifications()}
   fillColor='#086FB1' />

  </View>

</View>
    </View>
  )
}

export default Settings
