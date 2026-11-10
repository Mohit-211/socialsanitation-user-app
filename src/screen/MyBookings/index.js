import {
  View,
  Text,
  StatusBar,
  Image,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import images from '../../assets/images';
import { tw } from '../../utils/styling';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import axios from '../../api/axios';
import { base, imgURL } from '../../api/Constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import LinearGradient from 'react-native-linear-gradient';

export default function MyBookings() {
  const [selected, setSelected] = useState('Upcoming');
  const navigation = useNavigation();
  const [bookings, setBookings] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const backgroundColor = "white";

  const getBookings = async () => {
    setRefreshing(true);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.log('No token found in AsyncStorage');
        setRefreshing(false);
        return;
      }

      console.log('Fetching bookings for:', selected);
      const response = await axios.post(
        base.getallUserBooking,
        { booking_status: selected === 'Upcoming' ? 'UPCOMING' : 'COMPLETED' },
        {
          headers: {
            'x-access-token': token,
            role_id: 6,
          },
        }
      );

      console.log('Full API Response:', JSON.stringify(response.data, null, 2));

      if (response.data?.data && Array.isArray(response.data.data)) {
        setBookings(response.data.data);
      } else {
        console.log('No valid data found in response');
        setBookings([]); 
      }
    } catch (error) {
      console.error('API Error:', error.response?.data?.message || error.message);
    } finally {
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getBookings();
    }, [selected])
  );

  const renderItem = ({ item }) => {
    console.log('Rendering Item:', item); 

    if (!item?.service_booking) {
      console.log('3333333333', item);
      return null;
    }

    return (
    <SafeAreaView style={[tw`flex-1`, { backgroundColor }]}>

      <TouchableOpacity
        onPress={() => navigation.navigate('BookingDetails', { item })}
        style={tw`border-[.3px] rounded-lg border-neutral-400 py-3 px-3 my-2`}
      >
        {}
        <View style={tw`flex-row items-center justify-between`}>
          <Text style={tw`text-neutral-700`}>#{item.booking_unique_id}</Text>
          <Text style={[tw`bg-[#F29F05] text-white px-3 py-[2px] rounded-full`,{backgroundColor:item.booking_status === "PENDING" ? "#2391B1" :item.booking_status === "SUCCESS" ? "#67B870" :item.booking_status === "CANCELLED" ? "red" : "#F29F05"}]}>
            {item.booking_status}
          </Text>
        </View>

        {}
        <View style={tw`my-1 flex-row items-center gap-2`}>
          {item.service_booking.service_attachments?.length > 0 && (
            <Image
              style={tw`h-12 w-18 rounded-lg`}
              source={{ uri: imgURL + item.service_booking.service_attachments[0]?.file_name }}
            />
          )}
          <View style={tw`gap-1`}>
            <Text style={tw`font-semibold text-neutral-800`}>
              {item.service_booking.name || 'No Service Name'}
            </Text>
            {

}
          </View>
        </View>

        {}
        <View style={tw`flex-row items-center gap-2 pt-2`}>
          <Image source={images.calendar} style={{height:20,width:20}} />
          <Text style={tw`text-neutral-500 text-[12px]`}>
            {moment(item.date).format('DD MMM YYYY ')} {moment(item.time, 'hh:mm:ss').format('hh:mm A')}
          </Text>
        </View>
      </TouchableOpacity>
      </SafeAreaView>
    );
  };

  return (
    <SafeAreaView style={[tw`flex-1`, { backgroundColor }]}>
      <StatusBar backgroundColor={backgroundColor} barStyle="dark-content" />
      <View style={tw`h-[10%]  flex-row`}>
        <Text style={tw`text-black my-auto text-xl font-medium mx-8`}>Bookings</Text>
      </View>

      {}
      <View style={[tw`flex-row items-center justify-center my-5 border-[1px] self-center rounded-full p-1 gap-4 mx-5 bg-white`, { borderColor:'#ECECEC',borderWidth: 1}]}>
      <TouchableOpacity onPress={() => setSelected('Upcoming')} style={tw`w-[45%] rounded-full overflow-hidden`}>
    {selected === 'Upcoming' ? (
      <LinearGradient 
        colors={["#243352", "#08F624"]} 
        start={{ x: 0, y: 0 }} 
        end={{ x: 1, y: 1 }} 
        style={tw`items-center py-3 rounded-full`}
      >
        <Text style={tw`text-white`}>Upcoming</Text>
      </LinearGradient>
    ) : (
      <View style={tw`bg-white items-center py-3 rounded-full`}>
        <Text style={tw`text-[#086FB1]`}>Upcoming</Text>
      </View>
    )}
  </TouchableOpacity>

  {}
  <TouchableOpacity onPress={() => setSelected('Completed')} style={tw`w-[45%] rounded-full overflow-hidden`}>
    {selected === 'Completed' ? (
      <LinearGradient 
        colors={["#243352", "#08F624"]} 
        start={{ x: 0, y: 0 }} 
        end={{ x: 1, y: 1 }} 
        style={tw`items-center py-3 rounded-full`}
      >
        <Text style={tw`text-white`}>Completed</Text>
      </LinearGradient>
    ) : (
      <View style={tw`bg-white items-center py-3 rounded-full`}>
        <Text style={tw`text-[#086FB1]`}>Completed</Text>
      </View>
    )}
  </TouchableOpacity>

      </View>

      {}
      {bookings.length > 0 ? (
        <FlatList
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={getBookings} />}
          data={bookings}
          style={tw`px-4 mb-5`}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      ) : (
        <Text style={tw`text-center text-lg text-neutral-500`}>No {selected.toLowerCase()} bookings found</Text>
      )}
    </SafeAreaView>
  );
}
