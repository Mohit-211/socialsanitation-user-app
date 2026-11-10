import { ActivityIndicator, Dimensions, Image, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useRef, useState } from 'react'
import images from '../../assets/images'
import { tw } from '../../utils/styling'
import { CommonActions, useFocusEffect, useNavigation } from '@react-navigation/native'
import { Controller, useForm } from 'react-hook-form'
import Toast from 'react-native-toast-message'
import axios from '../../api/axios'
import { base } from '../../api/Constants'
import AsyncStorage from '@react-native-async-storage/async-storage'
import PasswordTextInput from '../../components/PasswordTextInput'
import messaging from '@react-native-firebase/messaging';
import { PERMISSIONS, RESULTS, check, request, checkNotifications, requestNotifications } from 'react-native-permissions';
import LinearGradient from 'react-native-linear-gradient'

const Login = () => {
  const navigation = useNavigation();
  const [Loading, setLoading] = useState(false);
  const hasRequestedMessagingPermissionRef = useRef(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm()

  const [fcmToken, setFcmToken] = useState('');

  const requestPermission = async (permission) => {
    try {
      const result = await check(permission);

      if (result !== RESULTS.GRANTED) {
        const requestResult = await request(permission);
        console.log(`${permission} permission result: ${requestResult}`);
      } else {
        console.log(`${permission} permission already granted`);
      }
    } catch (error) {
      console.warn(`${permission} permission error:`, error);
    }
  };

  const requestNotificationPermission = async () => {
    try {
      if (Platform.OS === 'ios') {
        const { status } = await checkNotifications();
        if (status !== RESULTS.GRANTED) {
          await requestNotifications(['alert', 'sound', 'badge']);
        }
      } else {
        const notificationPermission = PERMISSIONS.ANDROID.POST_NOTIFICATIONS;
        await requestPermission(notificationPermission);
      }
      console.log('Notification permission flow completed');
    } catch (error) {
      console.warn('Notification permission error:', error);
    }
  };

  async function requestUserPermission() {
    if (hasRequestedMessagingPermissionRef.current) {
      return;
    }

    hasRequestedMessagingPermissionRef.current = true;

    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
      getFcmToken();
    }
  }
  const getFcmToken = async () => {
    try {
      const fcmToken = await messaging().getToken();
      console.log(fcmToken, 'fcm token');
      setFcmToken(fcmToken)

    } catch (error) {
      console.log('FCM token error:', error)
    }
  };

  useFocusEffect(
    useCallback(() => {
      requestNotificationPermission();
      requestUserPermission();
    }, [])
  );

  const handleLogin = async (data) => {
    console.log("🚀 ~ handleLogin ~ data:", data)
    setLoading(true)
    if (!data.email || !data.password) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please fill all the fields'
      })
      return;
    }
    try {
      const res = await axios.post(base.login, data, {
        headers: {
          role_id: 6,
          timezone: 'Asia/Kolkata'
        }
      })
      console.log(res.data)
      setLoading(false)
      if (res.status == 200) {

        console.log(res.data.data,"-=-=--login respo-=-=");

        await AsyncStorage.setItem('token', res.data.data.tokens.access.token)
        await AsyncStorage.setItem('userID', res.data.data.id.toString())
        await AsyncStorage.setItem('roleId', res.data.data.role_id)
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [
              { name: 'Tabs' },
            ],
          })
        )
        reset()
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: res.data.message
        })

      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: res.data.message
        })
      }

    } catch (error) {
      setLoading(false)
      console.log(error)
      if (error.response.data.message) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: error.response.data.message
        })
      }

    }
  }

  return (
    <ScrollView contentContainerStyle={{ alignItems: 'flex-start' }} style={tw`flex-1 bg-white   `}>
      <Image source={images.logofigma} style={tw`w-[155px] h-[92px] mt-[70px] ml-[20px]`} />
      <View style={tw`items-center`}>
        <View style={tw`self-start gap-2 my-12 pl-8`}>
          <Text style={tw`text-2xl text-neutral-700 font-medium`}>
            Login
          </Text>
          <Text style={tw`text-lg text-neutral-600 `}>
            Login to your account
          </Text>
        </View>
        <View style={[tw`gap-5  `, {
          width: Dimensions.get('window').width,
          alignItems: 'center'
        }]}>
          <View style={tw`w-[90%] gap-2`}>
            <Text style={tw`text-neutral-600 text-sm`}>
              Email ID
            </Text>
            <Controller
              control={control}
              name='email'
              rules={
                {
                  required: {
                    value: true,
                    message: 'Email is required'
                  },
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                    message: "Invalid email address"
                  }
                }
              }
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  placeholder='Email ID'
                  placeholderTextColor={'#929292'}
                  style={tw`border-[1px] rounded-full h-12 border-neutral-300 w-full mx-8 self-center py-2 px-4 ${errors.email ? 'border-red-500' : 'border-neutral-300'
                    } text-neutral-600`}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}

                />
              )}
            />
          </View>
          <View style={tw`w-[90%] gap-2 `}>
            <Text style={tw`text-neutral-600 text-sm `}>
              Password
            </Text>
            <Controller
              control={control}
              name='password'
              rules={
                {
                  required: {
                    value: true,
                    message: 'Password is required'
                  },
                }
              }
              render={({ field: { onChange, onBlur, value } }) => (
                <PasswordTextInput
                  placeholder='Password'
                  secureTextEntry={true}
                  errors={errors}
                  onBlur={onBlur}
                  onChange={onChange}
                  value={value}
                  style={tw`border-[1px] rounded-full border-neutral-300 w-full mx-8 self-center py-2 px-4 ${errors.password ? 'border-red-500' : 'border-neutral-300'
                    } text-neutral-600`}
                />
              )}
            />

          </View>

          <TouchableOpacity
            disabled={Loading}
            onPress={handleSubmit(handleLogin)}
            style={[
              tw`w-[90%] rounded-full overflow-hidden mb-4`,
              Loading && { opacity: 0.6 }
            ]}
          >
            <LinearGradient
              colors={["#243352", "#08F624"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={tw`w-full py-4 items-center rounded-full`}
            >
              <View style={tw`flex-row items-center justify-center`}>
                {Loading ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <Text style={tw`text-white text-lg font-semibold`}>Login</Text>
                )}
              </View>
            </LinearGradient>
          </TouchableOpacity>
          <Text onPress={() => navigation.navigate("SendOTP")} style={tw`text-neutral-600 text-center`}>
            Forgot Password?
          </Text>
        </View>
        <View style={tw`flex-row items-center gap-1 my-20 `}>
          <Text style={tw`text-neutral-600 text-center`}>
            Don't have an account?
          </Text>

          <Text
            onPress={() => navigation.navigate("Signup")}
            style={tw`text-[#2391B1]   underline font-bold `}
          >
            SIGN UP
          </Text>

        </View>
      </View>
    </ScrollView>
  )
}

export default Login
