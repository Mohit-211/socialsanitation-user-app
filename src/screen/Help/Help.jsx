import { View, Text, StatusBar, TouchableOpacity, Image, ScrollView, Linking, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import images from '../../assets/images';
import { tw } from '../../utils/styling';
import { useQuery } from '@tanstack/react-query';
import axios from '../../api/axios';
import { base } from '../../api/Constants';
import LoadingScreen from '../../components/Loading';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';

const Help = () => {
  const navigation = useNavigation();
  const [heading, setHeading] = useState('');
  const [content, setContent] = useState('');
  const {data , isLoading , error} = useQuery({queryKey : ['contacts'] , queryFn : async () => {
    return await axios.get(base.getContacts)
  }})

 useFocusEffect(
   React.useCallback(() => {
     if(data){

       setContent(data.data.data[0])
     }
   }, [data])

 );
 console.log(content)

 const openDialScreen = (number) => {
    let phoneNumber = '';

    if (Platform.OS === 'android') {
        phoneNumber = `tel:${number}`;
    } else {
        phoneNumber = `telprompt:${number}`;
    }

    Linking.openURL(phoneNumber);
 }

 const openMailScreen = (mail) => {
    Linking.openURL(`mailto:${mail}`)
 }

 const openAddressInMap = (address) => {
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${address}`)
 }

  if(isLoading){
    return <LoadingScreen/>
  }
  return (
    <View style={tw`flex-1 `}>
    <StatusBar backgroundColor="#086FB1" barStyle="light-content" />
    {}

    <View style={tw`h-[10%] bg-[#086FB1] flex-row  px-4 gap-4   `}>
<TouchableOpacity style={tw`p-2  flex-row items-center gap-3  my-auto rounded-full  `}>
    <AntDesign name="arrowleft" size={24} color="white" onPress={() => navigation.goBack()} />

</TouchableOpacity>

<Text style={tw`text-white my-auto text-xl font-medium  capitalize  `}>
  Contact Us
</Text>

</View>
<ScrollView style={tw`flex-1 `}>

<View style={tw`mx-8 gap-8 mt-8 w-[90%] self-center `}>
<View style={tw`flex-row items-center gap-3  `}>
   <AntDesign
    name="mail"
    size={28}
    color="#333333"
   /> 
   <Text onPress={() => openMailScreen(content?.email)} style={tw`text-lg text-neutral-600 font-semibold`}>{content?.email}</Text>
</View>
<View style={tw`flex-row items-center gap-3`}>
   <AntDesign
    name="phone"
    size={28}
    color="#333333"
   /> 
   <Text onPress={() => openDialScreen(content?.contact_number)} style={tw`text-lg text-neutral-600 font-semibold`}>{content?.contact_number}</Text>
</View>
<View style={tw`flex-row items-center gap-3`}>
<Entypo name="location-pin" size={28} color="#333333" />
   <Text onPress={() => openAddressInMap(content?.address)} style={tw`text-lg text-neutral-600 font-semibold w-[95%]`}>{content?.address}</Text>
</View>
</View>
</ScrollView>
    </View>
  )
}

export default Help
