import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  StyleSheet,
  Touchable,
  SafeAreaView,
  FlatList,
  Alert,
  Platform,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import images from '../../assets/images';
import { tw } from '../../utils/styling';
import moment from 'moment';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import { GOOGLE_MAPS_APIKEY, base, imgURL } from '../../api/Constants';
import Toast from 'react-native-toast-message';
import LoadingScreen from '../../components/Loading';
import axios from '../../api/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fontFamily } from '../../utils/fonts';
import { Dropdown } from 'react-native-element-dropdown';
import RBSheet from 'react-native-raw-bottom-sheet';
import { Controller, useForm } from 'react-hook-form';
import LinearGradient from 'react-native-linear-gradient';
import ImagePicker from 'react-native-image-crop-picker';
import Feather from 'react-native-vector-icons/Feather';
import {
  SQIPCardEntry,
  SQIPApplePay,
  SQIPCore
} from 'react-native-square-in-app-payments';
const occurence = [
  { label: '1 month', value: '1 month' },
  { label: '2 months', value: '2 months' },
  { label: '3 months', value: '3 months' },
  { label: '4 months', value: '4 months' },
  { label: '5 months', value: '5 months' },
  { label: '6 months', value: '6 months' },
  { label: '7 months', value: '7 months' },
  { label: '8 months', value: '8 months' },
  { label: '9 months', value: '9 months' },
  { label: '10 months', value: '10 months' },
  { label: '11 months', value: '11 months' },
  { label: '12 months', value: '12 months' },
];
const reccuringEvery = [
  { label: 'Daily', value: 'Daily' },
  { label: 'Weekly', value: 'Weekly' },
  { label: 'Bi-Weekly', value: 'Bi-Weekly' },
  { label: 'Monthly', value: 'Monthly' },
  { label: 'Quarterly', value: 'Quarterly' },
];
export default function BookService() {
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const navigation = useNavigation();
  const { item } = useRoute().params;
  const [time, setTime] = useState(null);
  const [selectedAddressID, setSelectedAddressID] = useState(1);
  const [selectedReccuringType, setSelectedReccuringType] = useState(null);
  const [selectedOccurence, setSelectedOccurence] = useState(null);
  const [timePickerVisibility, setTimePickerVisibility] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState('non-recurring');
  const [bookingtype, setBookingType] = useState([
    { label: 'One Time Booking', value: "One Time Booking" },
    { label: 'Recurring Booking', value: "Recurring Booking" },
  ])

  const [bookingId, setBookingId] = useState('')
  const [date, setDate] = useState(new Date());
  const [datePickerVisibility, setDatePickerVisibility] = useState(false);
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  const [price, setPrice] = useState()
  const [tax, setTax] = useState()

  const backgroundColor = "white"
  console.log('@@@@@@@@@@@', item);
  useEffect(() => {
    if (item) {
      setPrice(item.price); 
      setTax(10); 
    }
  }, [item]);

  const taxAmount = (price * tax) / 100;
  const totalPayable = price + taxAmount;
  const [multiUrl, setMultiUrl] = useState([])

  const bookService = async () => {

    setLoading(true);
    const token = await AsyncStorage.getItem('token');

      if (!selectedAddressID) {
        setLoading(false);
        return Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Please select address',
          text1Style: {
            fontSize: 12,
          },
        });
      }

      if (!date || !time) {
        setLoading(false);
        return Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Please select date and time',
          text1Style: {
            fontSize: 12,
          },
        });
      }
      if (bookingId === "") {
        setLoading(false);
        return Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Please select booking type',
          text1Style: {
            fontSize: 12,
          },
        });
      }

    let formData = new FormData();

    multiUrl.forEach((image, index) => {
      formData.append("images", {
        uri: image.uri,
        name: image.fileName || `image_${index}.jpg`,
        type: image.type || "image/jpeg",
      });
    });
    formData.append("service_id",item.id)
    formData.append("date",moment(date).format('YYYY-MM-DD'))
    formData.append("time",moment(time).format('HH:mm'))
    formData.append("address_id",selectedAddressID)
    formData.append("notes",notes)
    formData.append("type",bookingId)

    try {
      const res = await axios.post(base.bookService, formData, {
        headers: {
          'x-access-token': token,
          role_id: 6,
           timezone: 'Asia/Kolkata'
        }
      })
      console.log("responce@@@", res.data)
      if (res.data.status == 201) {
        setLoading(false)
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: res.data.message,
          text1Style: {
            fontSize: 12
          },
        })

        navigation.navigate('bookingReceived');

      } else {
        setLoading(false)
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: res.data.message,
          text1Style: {
            fontSize: 12
          },
        })
      }

    } catch (error) {
      setLoading(false)
      console.log("🚀 ~ bookService ~ error", error)
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error?.response?.data?.message,
        text1Style: {
          fontSize: 12
        },
      })

    }
  };

  useEffect(() => {
    SQIPCore.setSquareApplicationId('REDACTED');
  }, []);

const onStartDigitalWallet = async () => {
  if (Platform.OS === 'ios') {
    try {
      await SQIPApplePay.initializeApplePay('merchant.com.sanitation');

      const applePayConfig = {
        price:'40.00',
        summaryLabel:item?.name,
        countryCode: 'US',
        currencyCode: 'USD',
        paymentType: 2, 
      };

      await SQIPApplePay.requestApplePayNonce(
        applePayConfig,
        async (cardDetails) => {

          console.log('✅ Nonce:', cardDetails.nonce);

          await createPaymentApiHandler(cardDetails.nonce)
          await SQIPApplePay.completeApplePayAuthorization(true);
          Alert.alert('Success', 'Payment completed!');
        },
        async (errorInfo) => {

          console.error('Apple Pay Failure:', errorInfo);
          await SQIPApplePay.completeApplePayAuthorization(false);
          Alert.alert('Payment Failed', errorInfo.message || 'Error occurred');
        },
        () => {

          console.log('Apple Pay Flow Complete');

        }
      );
    } catch (e) {
      console.error('Init Error:', e);
      Alert.alert('Init Error', e.message || 'Something went wrong');
    }
  }
};

const createPaymentApiHandler = async (nonce) => {

  setLoading(true);
  const token = await AsyncStorage.getItem('token');
  let formData = new FormData();
  formData.append("booking_id",item.id)
  formData.append("nonce", nonce); 

  try {
    const res = await axios.post(base.createPaymentIntent, formData, {
      headers: {
        'x-access-token': token,
        role_id: 6
      }
    })
    console.log("create payment@@@", res.data)
    if (res.data.status == 201) {
      setLoading(false)
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: res.data.message,
        text1Style: {
          fontSize: 12
        },
      })

      navigation.navigate('bookingReceived');

    } else {
      setLoading(false)
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: res.data.message,
        text1Style: {
          fontSize: 12
        },
      })
    }

  } catch (error) {
    setLoading(false)
    console.log("🚀 ~ bookService ~ error", error)
    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: error?.response?.data?.message,
      text1Style: {
        fontSize: 12
      },
    })

  }
};
  const getAvailableAddresses = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await axios.get(base.getAllAvailableAddreses, {
        headers: {
          'x-access-token': token,
          role_id: 6,
        },
      });
      console.log(res.data.data, "-=-=-=select address");

      if (res.data.status == 200) {
        let arr = []
        res.data.data.map((item, index) => {
          arr.push({ label: `${item.address}, ${item.user_city.name}, ${item.user_state.name}, ${item.user_country.name}`, value: item.id })
        })

        setAddresses(arr);
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  useFocusEffect(
    React.useCallback(() => {
      getAvailableAddresses();
    }, []),
  );

  const handleConfirm = date => {
    setDate(date);
    hideDatePicker();
  };
  console.log(addresses, "-=-=-=-==adddd");
  const handleImageUpdate = async () => {
    ImagePicker.openPicker({
      mediaType: 'photo',
      compressImageQuality: 0.8,
      cropping: true,
      multiple: true
    }).then(result => {
      setMultiUrl(result);
      console.log(result, "=-select photo");

    }).catch(err => {
      console.log("ImagePicker error", err);
    });
  };

  const handleRemove = (index) => {
    const updatedImages = [...multiUrl];
    updatedImages.splice(index, 1);
    setMultiUrl(updatedImages);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (

    <SafeAreaView style={[tw`flex-1`, { backgroundColor }]}>
      <StatusBar backgroundColor={backgroundColor} barStyle="dark-content" />
      <View style={tw`h-[10%]  flex-row   `}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={tw`p-2  mx-4   items-center justify-center  my-auto bg-transparent  `}>
          <Entypo name="chevron-small-left" size={35} color="#000" />
        </TouchableOpacity>
        <Text style={[tw`text-black my-auto text-xl font-medium  left-1/1.3`]}>
          Book Service
        </Text>
      </View>

      <View
        style={tw` my-4 gap-4 mx-8   flex-row items-center border-[1px] px-2 py-2 rounded-xl border-neutral-400 `}>
        {item.service_attachments.length > 0 ? (
          <Image
            source={{ uri: imgURL + item.service_attachments[0].file_name }}
            style={tw`w-20 h-20 rounded-lg `}
          />
        ) : (
          <Image
            source={{
              uri: 'https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png',
            }}
            style={tw`w-20 h-20 rounded-lg `}
          />
        )}
        <View style={tw`gap-1 `}>
          <Text style={tw`text-xl text-neutral-700 font-medium self-start `}>
            {item.name}
          </Text>
          {}
        </View>
      </View>

      {

}
      <ScrollView
        contentContainerStyle={{ alignItems: 'center' }}
        style={tw`flex-1  `}>
        <View style={tw`mx-8 gap-2 `}>
          <View style={{ alignItems: 'flex-start', gap: 3, marginTop: 12 }}>
            <Text
              style={{
                marginHorizontal: 5,
                fontSize: 16,
                color: '#000',
                fontWeight: '500',
              }}>
              Select Date
            </Text>
            <TouchableOpacity
              style={{
                justifyContent: 'space-between',

                flexDirection: 'row',
                alignItems: 'center',

                borderWidth: 1,
                borderColor: '#E5E5E5',
                borderRadius: 12,
                height: 54,
                width: '100%',
                paddingHorizontal: 20,
                borderRadius: 9999, 

              }}
              onPress={() => setDatePickerVisibility(true)}>
              <Text
                style={{ fontSize: 14, fontWeight: '400', color: '#333333' }}>
                {moment(date).format('YYYY-MM-DD')}
                {}
              </Text>
              <Image style={{ height: 20, width: 20 }} source={images.calendar} />
              <DateTimePickerModal
                isVisible={datePickerVisibility}
                mode="date"
                minimumDate={new Date()}
                date={date}
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
              />
            </TouchableOpacity>
          </View>
          <View style={{ alignItems: 'flex-start', gap: 3, marginTop: 12 }}>
            <Text
              style={{
                marginHorizontal: 5,
                fontSize: 16,
                color: '#000',
                fontWeight: '500',
              }}>
              Select Booking Type{' '}
            </Text>
            {

}
            <Dropdown
              style={[styles.dropdown]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              itemContainerStyle={{ borderRadius: 12, borderColor: '#E5E5E5' }}
              data={bookingtype}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={!isFocus ? 'Select Booking Type' : '...'}
              searchPlaceholder="Search..."
              selectedTextProps={{ ellipsizeMode: 'tail', numberOfLines: 1 }}
              value={bookingId}

              onChange={item => {
                setBookingId(item.value || 1);

              }}

              itemTextStyle={{ color: '#333333', borderColor: '#E5E5E5' }}
            />
          </View>
          <View style={{ alignItems: 'flex-start', gap: 3, marginTop: 12 }}>
            <Text
              style={{
                marginHorizontal: 5,
                fontSize: 16,
                color: '#000',
                fontWeight: '500',
              }}>
              Select Time
            </Text>
            <TouchableOpacity
              style={{
                justifyContent: 'space-between',

                flexDirection: 'row',
                alignItems: 'center',

                borderWidth: 1,
                borderColor: '#E5E5E5',
                borderRadius: 12,
                height: 54,
                width: '100%',
                paddingHorizontal: 20,
                borderRadius: 9999, 

              }}
              onPress={() => setTimePickerVisibility(true)}>
              <Text
                style={{ fontSize: 14, fontWeight: '400', color: '#333333' }}>
                {time ? moment(time).format('LT') : 'HH:MM '}
              </Text>
              <Image
                source={images.clock}
                style={{ height: 20, width: 20, resizeMode: 'contain' }}
              />
              <DateTimePickerModal

                isVisible={timePickerVisibility}
                mode="time"
                onConfirm={t => {
                  setTimePickerVisibility(false);
                  setTime(t);
                }}
                onCancel={() => setTimePickerVisibility(false)}
              />
            </TouchableOpacity>
          </View>
          <View style={{ alignItems: 'flex-start', gap: 3, marginTop: 12 }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
              }}>
              <Text
                style={{
                  marginHorizontal: 5,
                  fontSize: 16,
                  color: '#000',
                  fontWeight: '500',
                }}>
                Address
              </Text>
              <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('AddNewAddress' , {screen : 'Booking',addressData:""});
                  }}>
                  <Text
                    style={{
                      marginHorizontal: 20,
                      fontSize: 13,
                      color: '#086FB1',
                      fontFamily: fontFamily.Regular,
                      fontWeight: '600',
                    }}>
                    +Add New Address
                  </Text>
                </TouchableOpacity>
            </View>
            {addresses.length > 0 ? 
            <Dropdown
              style={[styles.dropdown]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              itemContainerStyle={{ borderRadius: 12, borderColor: '#E5E5E5' }}
              data={addresses}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={!isFocus ? 'Select Address' : '...'}
              searchPlaceholder="Search..."
              selectedTextProps={{ ellipsizeMode: 'tail', numberOfLines: 1 }}
              value={selectedAddressID}

              onChange={item => {
                setSelectedAddressID(item.id || 1);
                setIsFocus(false);
              }}

              itemTextStyle={{ color: '#333333', borderColor: '#E5E5E5' }}
            />
            :
            <View style={[styles.dropdown,{justifyContent:'center'}]}>
              <Text>No Address Found</Text>
              </View>
}
          </View>

          <View style={{ alignItems: 'flex-start', gap: 3, marginVertical: 12 }}>
            <Text
              style={{
                marginHorizontal: 5,
                fontSize: 16,
                color: '#000',
                fontWeight: '500',
              }}>
              Notes{' '}
            </Text>
            <TextInput
              placeholder="Notes"
              placeholderTextColor="#333333"
              value={notes}
              onChangeText={e => setNotes(e)}
              multiline
              style={{
                justifyContent: 'space-between',
                flexDirection: 'row',
                alignItems: 'center',

                color: '#333333',
                borderWidth: 1,
                borderColor: '#E5E5E5',
                borderRadius: 30,
                height: 99,
                width: '100%',
                paddingHorizontal: 20,
                paddingTop:10
              }}
            />

          </View>
          <View style={styles.fieldCont}>
          <TouchableOpacity
            style={styles.addImagecontainer}
            onPress={()=>handleImageUpdate()}
          >
      <Feather name="camera" size={24} color="green" />
            <Text style={styles.addImagecontainerTxt}>Upload Image</Text>
          </TouchableOpacity>
        </View>
          {
            multiUrl.length > 0 ?
            <FlatList 
            data={multiUrl}
            horizontal
            renderItem={  (({item, index}) => {
              return (
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8,marginHorizontal:8,marginTop:8 }}>

                  <View key={index} style={{ position: 'relative' }}>
                    <Image
                      source={{ uri: item.path }}
                      style={{
                        width: 100,
                        height: 100,
                        borderRadius: 10,
                      }}
                    />
                    <TouchableOpacity
                      onPress={() => handleRemove(index)}
                      style={{
                        position: 'absolute',
                        top: -5,
                        right: -5,
                        backgroundColor: '#fff',
                        borderRadius: 999,
                        padding: 2,
                        elevation: 3,
                      }}
                    >
                      <AntDesign name="closecircle" size={18} color="#f00" />
                    </TouchableOpacity>
                  </View>

              </View>
              )
            })}/>

              :
              <></>
          }
          {

}
          {

}

          {selected == 'recurring' && (
            <>
              <View style={{ alignItems: 'flex-start', gap: 3, marginTop: 12 }}>
                <Text
                  style={{
                    marginHorizontal: 20,
                    fontSize: 16,
                    color: '#000',
                    fontWeight: '500',
                  }}>
                  Recurring Every{' '}
                </Text>
                <Dropdown
                  style={[styles.dropdown]}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  data={reccuringEvery}
                  search
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder={'Select reccuring type'}
                  searchPlaceholder="Search..."
                  selectedTextProps={{
                    ellipsizeMode: 'tail',
                    numberOfLines: 1,
                  }}
                  value={selectedReccuringType}
                  dropdownPosition="top"
                  onChange={item => {
                    setSelectedReccuringType(item.value);
                  }}
                  itemTextStyle={{ color: '#333333' }}
                />
              </View>
              <View style={{ alignItems: 'flex-start', gap: 3, marginTop: 12 }}>
                <Text
                  style={{
                    marginHorizontal: 20,
                    fontSize: 16,
                    color: '#000',
                    fontWeight: '500',
                  }}>
                  Occurence{' '}
                </Text>
                <Dropdown
                  style={[styles.dropdown]}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  data={occurence}
                  search
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder={'Select occurence'}
                  searchPlaceholder="Search..."
                  selectedTextProps={{
                    ellipsizeMode: 'tail',
                    numberOfLines: 1,
                  }}
                  value={selectedOccurence}
                  onChange={item => {
                    setSelectedOccurence(item.value);
                  }}
                  itemTextStyle={{ color: '#333333' }}
                />
              </View>
            </>
          )}

          <TouchableOpacity onPress={bookService} style={tw`my-3 rounded-full`}>
            <LinearGradient
              colors={["#243352", "#08F624"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={tw`w-full py-4 items-center rounded-full`}>
              <Text
                style={[
                  tw`text-white text-lg font-semibold`,
                  { fontFamily: fontFamily.Regular },
                ]}>
                Confirm Booking
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView >
    </SafeAreaView >

  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 16,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#E5E5E5',

    height: 54,
    paddingHorizontal: 18,
    width: '100%',
    borderRadius: 9999, 

  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
    color: '#333333',
  },
  selectedTextStyle: {
    fontSize: 16,
    color: '#333333',
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    color: "#333333"
  },
  addImagecontainer: {
    height:120,
    width:  '100%',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#2F6836",
    alignItems: "center",
    justifyContent: "center",
  },
  addImagecontainerTxt: {
    color: "#2F6836",
    fontSize: 20,
    marginTop: "1%",
    fontWeight: "700",
  },
});
