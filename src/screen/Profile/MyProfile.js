import { View, Text, StatusBar, TouchableOpacity, ScrollView, FlatList, Alert, SafeAreaView, Image } from 'react-native';
import React, { useState } from 'react';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { tw } from '../../utils/styling';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { base } from '../../api/Constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from '../../api/axios';
import LoadingScreen from '../../components/Loading';
import Entypo from 'react-native-vector-icons/Entypo';
import images from '../../assets/images';

const MyProfile = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const user = route?.params?.user || {}; 
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const backgroundColor = "white";

  const getAvailableAddresses = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await axios.get(base.getAllAvailableAddreses, {
        headers: { 'x-access-token': token, role_id: 6 },
      });
      if (res.data.status === 200) {
        setAddresses(res.data.data);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const deleteAddress = async (id) => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      const res = await axios.put(`${base.deleteAddress}/${id}`, {}, {
        headers: { 'x-access-token': token, role_id: 6 },
      });
      if (res.data.status === 200) {
        getAvailableAddresses();
      }
    } catch (error) {
      console.log(error.response.data);
    } finally {
      setLoading(false);
    }
  };

  const preDeleteAddress = (id) => {
    Alert.alert(
      'Delete Address',
      'Are you sure you want to delete this address? This action will delete all bookings associated with this address.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'OK', onPress: () => deleteAddress(id) },
      ],
      { cancelable: false }
    );
  };

  useFocusEffect(
    React.useCallback(() => {
      getAvailableAddresses();
    }, [])
  );

  if (loading) return <LoadingScreen />;

  return (
    <SafeAreaView style={[tw`flex-1`, { backgroundColor }]}>
      <StatusBar backgroundColor={backgroundColor} barStyle="dark-content" />

      {}
      <View style={[tw`h-[10%] flex-row items-center px-2`, { backgroundColor }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={tw`p-2`}>
          <Entypo name="chevron-small-left" size={35} color="#000" />
        </TouchableOpacity>
        <Text style={tw`text-black text-xl font-medium flex-1 text-center pr-10`}>
          About Us
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Image source={images.people} style={{ height: 200, width: '88%',marginHorizontal:0,alignSelf:'center' }} />

        <Text style={[tw`text-black text-m font-medium flex-1 text-center `, { textAlign: 'justify', marginHorizontal: 26, marginTop: 20 }]}>
          Welcome to Social Sanitation. We are Central Florida’s #1 Rated Commercial Cleaning Company. We’ve been in operation since the start of the COVID-19 pandemic. Our main operating office is located in Tampa, FL. We currently service areas of Central Florida, in counties such as: Hillsborough County, Pinellas County, Polk County, Pasco County and more.

          Since 2019, the COVID-19 pandemic has taken over our work environment and caused a social divide. We bring reassurance to our customers, safety first. Our refined sanitizing methods make your workplace a safe environment for both staff employees, and their customers. A clean and safe work environment is key to promoting future business and maintaining stability in the workplace. We’re here to make your workplace great again.
        </Text>
        {}
        {

}

        {}
        {

}
      </ScrollView>
    </SafeAreaView>
  );
};

const ProfileField = ({ label, value }) => (
  <View style={tw`w-[100%] self-center gap-2`}>
    <Text style={tw`text-neutral-800 font-medium`}>{label}</Text>
    <View style={tw`bg-sky-100 border-[.3px] border-neutral-400 py-4 px-4 rounded-lg`}>
      <Text style={tw`text-neutral-700`}>{value || 'Not Available'}</Text>
    </View>
  </View>
);

export default MyProfile;
