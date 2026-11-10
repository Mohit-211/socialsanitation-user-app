import { View, Text, StatusBar, Image, Touchable, TouchableOpacity, Dimensions, ScrollView, Alert, BackHandler, FlatList, SafeAreaView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { tw } from '../../utils/styling'
import Carousel from 'react-native-snap-carousel'
import images from '../../assets/images'
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native'
import { base, imgURL } from '../../api/Constants'
import { set } from 'react-hook-form'
import axios from '../../api/axios'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Entypo from 'react-native-vector-icons/Entypo'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { fontFamily } from '../../utils/fonts'
import { fontSizeConstant } from '../../utils/fontSize'

export default Home = () => {
  const navigation = useNavigation();
  const [services, setServices] = useState([]);
  const isFocused = useIsFocused();
  const { height, width } = Dimensions.get("window");
  const [banners, setBanners] = useState([]);
  const [bannerCount, setBannerCount] = useState(0);
  const [address, setAddress] = useState();
  const [addressAvailable, setAddressAvailable] = useState(false);

  const getAvailableAddresses = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await axios.get(base.getAllAvailableAddreses, {
        headers: {
          'x-access-token': token,
          role_id: 6,
        },
      });
      if (res.data.status == 200) {
        if (res.data.data.length == 0) {
          setAddressAvailable(false)
        } else {

          setAddressAvailable(true)
          setAddress(res.data.data[0]);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const getAllServices = async () => {
    try {
      const res = await axios.get(base.getAllServices);
      console.log("🚀  getAllServices  res:", res.data.data)
      setServices(res.data.data)
    } catch (error) {
      console.log("🚀  getAllServices  error:", error)

    }
  }
  const getBanner = async () => {
    try {
      const res = await axios.get(base.banner);
      console.log("🚀  getBanner  res", res.data)
      if (res.data.status == 200) {
        setBannerCount(res.data.data.count)
        setBanners(res.data.data.banners)
      }
    } catch (error) {
      console.log("🚀  getBanner  error", error)
    }

  }
  const getUserProfile = async () => {

    try {

      const token = await AsyncStorage.getItem('token');
      const res = await axios.get(base.getUserProfile, {
        headers: {
          'x-access-token': token,
          'role_id': 6
        }
      })
      console.log(res,"-=-=pro")
      if (res.data.status == 200) {

      } else {

      }

    } catch (error) {

console.log(error,"=--==-pro1");
navigation.navigate('Login')
    }

  }
  useFocusEffect(
    React.useCallback(() => {
      getAvailableAddresses();
      getUserProfile()

    }, [isFocused

    ]
    )
  );

  useEffect(() => {
    if (!isFocused) return;

    const backAction = () => {
      Alert.alert("Hold on!", "Are you sure you want to exit?", [
        { text: "Cancel", onPress: () => null, style: "cancel" },
        { text: "YES", onPress: () => BackHandler.exitApp() }
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [isFocused]);

  useEffect(() => {

    getBanner()
    getAllServices()
    console.log(address)

  }, []);
  return (
    <SafeAreaView style={tw`flex-1 bg-[#ffffff] mt-[-30px]`}>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />

      <View style={tw`flex-row items-center  justify-between mt-[47px] px-4 pr-10`}>
        <Image source={images.logofigma} style={tw`w-[75.31px] h-[44px]`} />

        <TouchableOpacity  style={{right:-28}}
          onPress={() => {
            console.log("Bell Clicked");
            navigation.navigate("notification");
          }}
        >
          {}
          <Image
                source={images.notification}
                style={{
                  width: 50,
                  height: 50
                }}
              />
        </TouchableOpacity>

      </View>

      <View
        style={tw`flex-row justify-between mt-6   items-center`}
      >
        <Text
          style={[tw`text-2xl text-neutral-600 font-semibold mx-4 font-bold`, { fontFamily: fontFamily.Regular,color:'#000' }]}
        >
          Services we offer  </Text>
      </View>
      <FlatList
        showsVerticalScrollIndicator={false}
        numColumns={2}
        contentContainerStyle={{
          paddingHorizontal: 12,
          paddingTop: 10,
        }}
        columnWrapperStyle={{
          justifyContent: 'space-between',
          gap: 10,
        }}
        style={tw`px-0 mb-5 w-full`}
        data={services}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate("ServiceDetails", { item })}
            style={[
              tw`p-0 border-neutral-300 rounded-lg justify-center items-start`,
              {
                width: 180,
                height: 188,
                marginBottom: 10,

              }
            ]}
          >
            {
              item.service_attachments.length > 0 ? (
                <Image
                  source={{ uri: imgURL + item.service_attachments[0].file_name }}
                  style={tw`w-full h-30 rounded-lg`}
                  resizeMode="cover"
                />
              ) : (
                <Image
                  source={{ uri: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?q=80&w=3271&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' }}
                  style={tw`w-full h-30 rounded-lg`}
                  resizeMode="cover"
                />
              )
            }
            <Text numberOfLines={1} style={[tw`text-lg text-neutral-700 mt-2`, { fontFamily: fontFamily.extraBold }]}>
              {item.name}
            </Text>
            {

}
          </TouchableOpacity>

        )}
      />
    </SafeAreaView>
  )
}
