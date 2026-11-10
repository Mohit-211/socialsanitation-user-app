import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { tw } from '../../utils/styling'
import { useNavigation, useRoute } from '@react-navigation/native'
import BouncyCheckbox from 'react-native-bouncy-checkbox'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { base } from '../../api/Constants'
import axios from '../../api/axios'
import AntDesign from 'react-native-vector-icons/AntDesign'
import WebView from 'react-native-webview'
import Toast from 'react-native-toast-message'
import { set } from 'react-hook-form'

const Calendar = () => {
    const navigation = useNavigation();
    const {user, authorized} = useRoute().params;
    const [notifications, setNotifications] = useState(user.notification_status);
    const [syncWithCalendar, setSyncWithCalendar] = useState(user.is_sync_by_google_calendar);
    const [showWebView, setShowWebView] = useState(false);
    const [authorizationUrl, setAuthorizationUrl] = useState('');

    const authorizeURL = async () => {
        const token = await AsyncStorage.getItem("token")
        try {

            const res = await axios.get(base.authorize , {
                headers : {
                    'x-access-token' : token,
                    role_id : 6,
                }
            })

            if(res.status == 200){
                setAuthorizationUrl(res.data.authorizationUrl);

                setShowWebView(true);
            }

        } catch (error) {

        }
    }

    const onWebViewResponse = async (event) => {
        console.log(event.nativeEvent.url, authorizationUrl , "Result Webview")
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

      const toggleSyncWithCalendar = async () => {
        try {
            console.log("Pressed")
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

          if(error.response.data.status == 404){
          Toast.show({
            type : 'error',
            text1 : 'Please connect you calendar to activate this feature'
          })
        }

      }
    }

  return (
    <View style={tw`flex-1 `}>
    <StatusBar backgroundColor="#086FB1" barStyle="light-content" />
    {}

    <View style={tw`h-[10%] bg-[#086FB1] flex-row  px-4 gap-4   `}>
    <TouchableOpacity onPress={() => navigation.goBack()} style={tw`p-2   items-center justify-center  my-auto bg-transparent  `}>

  <AntDesign name="arrowleft" size={28} color="#fff" />

</TouchableOpacity>

<Text style={tw`text-white my-auto text-xl font-medium  `}>
Sync with Calendar
</Text>

</View>

<View style={tw`w-[90%] self-center my-8 gap-5 `}>

<TouchableOpacity
    disabled={authorized}
  onPress={authorizeURL}
  style={tw` ${
    authorized ? 'bg-neutral-300' : 'bg-white'
  } flex-row items-center justify-between border-[.3px] border-neutral-400  w-[100%] rounded-lg px-3  py-4 `}
  >

  <Text style={tw`text-neutral-800  text-base`}>Connect with your Calendar</Text>
  <AntDesign
    name="calendar"
    size={24}
    color={"#333"}
  />

  </TouchableOpacity>
<View
  style={tw`flex-row items-center justify-between border-[.3px] border-neutral-400  w-[100%] rounded-lg pl-3  py-4  `}>

  <Text style={tw`text-neutral-800  text-base`} > Sync with Calendar </Text>
  <BouncyCheckbox
    disableBuiltInState
    isChecked={syncWithCalendar}
  onPress={() => toggleSyncWithCalendar()}
   fillColor='#086FB1' />
  </View>

</View>

    </View>
  )
}

export default Calendar

const styles = StyleSheet.create({})
