import { View, Text, StatusBar, TouchableOpacity, Image, SafeAreaView, Alert } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { tw } from '../../utils/styling';
import images from '../../assets/images';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from '../../api/axios';
import Toast from 'react-native-toast-message';
import { base, imgURL } from '../../api/Constants';
import LoadingScreen from '../../components/Loading';
import moment from 'moment';
import AntDesign from 'react-native-vector-icons/AntDesign';

const Profile = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [calendarAuthorized, setCalendarAuthorized] = useState(false);
  const backgroundColor = "white"

  const getUserProfile = async () => {

    try {

      const token = await AsyncStorage.getItem('token');
      const res = await axios.get(base.getUserProfile, {
        headers: {
          'x-access-token': token,
          'role_id': 6
        }
      })
      console.log(res.data,"-==-nih")
      if (res.data.status == 200) {
        setUser(res.data.data?.profile)
        setCalendarAuthorized(res?.data?.data?.authorization)
        setLoading(false)
      } else {
        setLoading(false)
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: res.data.message
        })
        navigation.navigate("Home")

      }

    } catch (error) {
      setLoading(false)
      console.log(error)
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Something went wrong'
      })
      navigation.navigate("Home")

    }

  }

  const handleLogout = async () => {
    try {

      const token = await AsyncStorage.getItem('token');
      const res = await axios.get(base.logout, {
        headers: {
          'x-access-token': token,
        }
      })
      console.log(res.data)
      if (res.data.status == 200) {
        await AsyncStorage.removeItem('token');
        navigation.navigate('Login')
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: res.data.message
        })
      }

    } catch (error) {
      console.error("🚀 ~ handleLogout ~ error", error.response.data.message)
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Something went wrong'
      })
    }
  }

  const confirmDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => handleDeleteAccount(),
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  const handleDeleteAccount = async () => {
    try {

      const token = await AsyncStorage.getItem('token');
      const res = await axios.delete(base.deleteAccount, {
        headers: {
          'x-access-token': token,
        }
      })
      console.log(res.data)
      if (res.data.status == 200) {
        await AsyncStorage.removeItem('token');
        navigation.navigate('Login')
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: res.data.message
        })
      }

    } catch (error) {
      console.error("🚀 ~ delete account ~ error", error.response.data.message)
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Something went wrong'
      })
    }
  }

  useFocusEffect(
    useCallback(() => {
      getUserProfile()
    }, [])
  );

  if (loading) {
    return <LoadingScreen />
  }

  return (
    <SafeAreaView style={[tw`flex-1`, { backgroundColor }]}>
      <StatusBar backgroundColor={backgroundColor} barStyle="dark-content" />
      {}

      <View style={tw`h-[10%] w-[335px] h-[56px] flex-row  px-4 gap-4   `}>
        {

}

        <Text style={tw`text-black my-auto text-xl ml-4 font-medium color`}>
          Profile
        </Text>
      </View>

      {

}

      <View style={tw`w-[335px] h-[56px] self-center my-1  items-center gap-3  `}>
        <TouchableOpacity
          onPress={() => navigation.navigate('MyProfile', { user })}
          style={tw`flex-row items-center justify-between border-[.3px] border-neutral-400  w-[100%] rounded-full p-3  `}
        >
          <View style={tw`flex-row items-center gap-3 `}>

            <Image source={images.about}  style={tw`w-6 h-6  `} />
            <Text style={tw`text-neutral-800 text-lg `}>About Us</Text>
          </View>
          <Image source={images.arrowRight} tintColor={'#000'} style={tw`w-5 h-5  `} />
        </TouchableOpacity>
        {

}
        <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}
          style={tw`flex-row items-center justify-between border-[.3px] border-neutral-400  w-[100%] rounded-full px-3  py-4  `}
        >

          <View style={tw`flex-row items-center gap-3 `}>

            {}
            <Image source={images.editProfile} style={tw`w-5 h-5    `} />

            <Text style={tw`text-neutral-800 text-lg `}>Edit Profile </Text>
          </View>
          <Image source={images.arrowRight} tintColor={'#000'} style={tw`w-5 h-5  `} />

        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('GetAllQuotesbyUser')}
          style={tw`flex-row items-center justify-between border-[.3px] border-neutral-400  w-[100%] rounded-full px-3  py-4  `}
        >

          <View style={tw`flex-row items-center gap-3 `}>

            <Image source={images.question} style={tw`w-8 h-8 `} />

            <Text style={tw`text-neutral-800 text-lg `}>Get Quotes </Text>
          </View>
          <Image source={images.arrowRight} tintColor={'#000'} style={tw`w-5 h-5  `} />

        </TouchableOpacity>

        {

}

        <TouchableOpacity
          onPress={() => navigation.navigate('ChangePassword')}
          style={tw`flex-row items-center justify-between border-[.3px] border-neutral-400  w-[100%] rounded-full p-3  `}
        >
          <View style={tw`flex-row items-center gap-3 `}>

            <Image source={images.change}  style={tw`w-6 h-6  `} />
            <Text style={tw`text-neutral-800 text-lg `}>Change Password</Text>
          </View>
          <Image source={images.arrowRight} tintColor={'#000'} style={tw`w-5 h-5  `} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('PrivacyPolicy')}
          style={tw`flex-row items-center justify-between border-[.3px] border-neutral-400  w-[100%] rounded-full p-3  `}
        >
          <View style={tw`flex-row items-center gap-3 `}>

            <Image source={images.policy}  style={tw`w-6 h-6  `} />
            <Text style={tw`text-neutral-800 text-lg `}>Privacy Policy</Text>
          </View>
          <Image source={images.arrowRight} tintColor={'#000'} style={tw`w-5 h-5  `} />
        </TouchableOpacity>

        {

}

        <TouchableOpacity
          onPress={() => handleLogout()}
          style={tw`flex-row items-center justify-between border-[.3px] border-neutral-400  w-[100%] rounded-full p-3  `}
        >
          <View style={tw`flex-row items-center gap-3 `}>

            {}
          <Image source={images.logout} style={{height:20,width:20}} />

            <Text style={tw`text-[#EA2021]  text-lg `}>Log Out</Text>
          </View>
          <Image source={images.arrowRight} tintColor={'#000'} style={tw`w-5 h-5  `} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={confirmDeleteAccount}
          style={tw`flex-row items-center justify-between border-[.3px] border-neutral-400  w-[100%] rounded-full p-3  `}
        >
          <View style={tw`flex-row items-center gap-3 `}>

            {}
          <Image source={images.delete} style={{height:20,width:20}} />

            <Text style={tw`text-[#EA2021]  text-lg `}>Delete Account</Text>
          </View>
          <Image source={images.arrowRight} tintColor={'#000'} style={tw`w-5 h-5  `} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default Profile
