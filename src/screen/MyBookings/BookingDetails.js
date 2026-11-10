import React, { useState, useEffect } from 'react';  
import {
  View,
  Text,
  StatusBar,
  Image,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  TextInput,
  StyleSheet,
  FlatList,
  Dimensions,
  ScrollView,
} from 'react-native';
import { tw } from '../../utils/styling';
import { useNavigation, useRoute } from '@react-navigation/native';
import moment from 'moment';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { base, imgURL } from '../../api/Constants';
import axios from '../../api/axios';
import Toast from 'react-native-toast-message';
import LoadingScreen from '../../components/Loading';
import AsyncStorage from '@react-native-async-storage/async-storage';
import images from '../../assets/images';
import Icon from 'react-native-vector-icons/Feather';
import GradientButton from '../../components/GradientButton';
import ImagePicker from 'react-native-image-crop-picker';
import Feather from 'react-native-vector-icons/Feather';

const BookingDetails = () => {
  const route = useRoute();
  const item = route.params?.item || {}; 
  const backgroundColor = "white";
  const { height, width } = Dimensions.get("window");

  const [modal, setModal] = useState(false);
  const [reportModal, setReportModal] = useState(false);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState();
  const [tax, setTax] = useState();
  const [imageModal, setImageModal] = useState(false)
  const [imageReason, setImageReason] = useState("")
  const [senderId,setSenderId] = useState("")

  console.log('🚀 ~ BookingDetails ~ item', item.bdm_details);
  const [reason, setReason] = useState('');
  const [multiUrl, setMultiUrl] = useState([])

  const [rating, setRating] = useState(4);
  const [reasonReport, setReasonReport] = useState('');

  const renderStars = () => {
    return [1, 2, 3, 4, 5].map(i => (
      <TouchableOpacity key={i} onPress={() => setRating(i)}>
        <Icon
          name="star"
          size={30}
          color={i <= rating ? '#FFB800' : '#ccc'}
          style={{ marginHorizontal: 2 }}
        />
      </TouchableOpacity>
    ));
  };

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
  useEffect(() => {
   const  getUserID = async ()=>{
    const id = await AsyncStorage.getItem('userID')
    setSenderId(id)
   }
    if (item) {
      getUserID()
      setPrice(item.price); 
      setTax(10); 
    }
  }, [item]);
  const taxAmount = (price * tax) / 100;
  const totalPayable = price + taxAmount;
  const cancelBooking = async (delete_type) => {
    if (reason === "") {
      Toast.show({ type: 'error', text1: 'Please enter reason.' })
    } else {
      try {
        setLoading(true);
        const token = await AsyncStorage.getItem('token');

        if (!token) {
          setLoading(false);
          Toast.show({ type: 'error', text1: 'Error', text2: 'User not authenticated' });
          return;
        }

        const res = await axios.post(
          base.cancelBooking,
          {
            booking_id: item.id,
            reason: reason
          },
          {
            headers: {
              'x-access-token': token,
              role_id: 6,
            },
          }
        );

        setLoading(false);
        if (res.data.status === 200) {
          Toast.show({ type: 'success', text1: 'Success', text2: res.data.message });
          setReason("")
          setModal(false)
          navigation.goBack()
        } else {
          Toast.show({ type: 'error', text1: 'Error', text2: res.data.message });
        }
      } catch (error) {
        setLoading(false);
        console.log('🚀 ~ cancelBooking ~ error', error?.response?.data?.message || error.message);
        Toast.show({ type: 'error', text1: 'Error', text2: error?.response?.data?.message || 'Something went wrong' });
      }
    }
  };
  const reportHanler = async (delete_type) => {
    if (reasonReport === "") {
      Toast.show({ type: 'error', text1: 'Please enter reason.' })
    } else {
      try {
        setLoading(true);
        const token = await AsyncStorage.getItem('token');

        if (!token) {
          setLoading(false);
          Toast.show({ type: 'error', text1: 'Error', text2: 'User not authenticated' });
          return;
        }

        const res = await axios.post(
          base.ratingReport,
          {
            service_id: item.id,
            review: reasonReport,
            rating: rating
          },
          {
            headers: {
              'x-access-token': token,
              role_id: 6,
            },
          }
        );

        setLoading(false);
        if (res.data.status === 201) {
          Toast.show({ type: 'success', text1: 'Success', text2: res.data.message });
          setReasonReport("")
          setReportModal(false)
        } else {
          Toast.show({ type: 'error', text1: 'Error', text2: res.data.message });
        }
      } catch (error) {
        setLoading(false);
        console.log('🚀 ~ cancelBooking ~ error', error?.response?.data?.message || error.message);
        Toast.show({ type: 'error', text1: 'Error', text2: error?.response?.data?.message || 'Something went wrong' });
      }
    }
  };
  const handleRemove = (index) => {
    const updatedImages = [...multiUrl];
    updatedImages.splice(index, 1);
    setMultiUrl(updatedImages);
  };
  const imageHandlerApi = async (delete_type) => {
    if (imageReason === "") {
      Toast.show({ type: 'error', text1: 'Please enter reason.' })
    }
    else if (multiUrl.length === 0) {
      Toast.show({ type: 'error', text1: 'Please select  image.' })
    }
    else {
      try {
        setLoading(true);
        const token = await AsyncStorage.getItem('token');

        if (!token) {
          setLoading(false);
          Toast.show({ type: 'error', text1: 'Error', text2: 'User not authenticated' });
          return;
        }

        const formData = new FormData()
        formData.append('reason', imageReason)
        multiUrl.forEach((image, index) => {
          formData.append("images", {
            uri: image.uri,
            name: image.fileName || `image_${index}.jpg`,
            type: image.type || "image/jpeg",
          });
        });
        const res = await axios.post(
          base.reviewImage + item.id,
          formData,
          {
            headers: {
              'x-access-token': token,
              role_id: 6,
            },
          }
        );

        setLoading(false);
        if (res.data.status === 200) {
          Toast.show({ type: 'success', text1: 'Success', text2: res.data.message });
          setImageReason("")
          setMultiUrl([])
          setReportModal(false)
          setImageModal(false)
        } else {
          Toast.show({ type: 'error', text1: 'Error', text2: res.data.message });
        }
      } catch (error) {
        setLoading(false);
        console.log('🚀 ~ cancelBooking ~ error', error?.response?.data?.message || error.message);
        Toast.show({ type: 'error', text1: 'Error', text2: error?.response?.data?.message || 'Something went wrong' });
      }
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  const serviceBooking = item.service_booking || {};
  console.log(JSON.stringify(item), "-===--==-");

  const beforeServiceImages = item?.booking_attachment?.filter(
    (att) => att.title === "BEFORE SERVICE"
  );
  const afterServiceImages = item?.booking_attachment?.filter(
    (att) => att.title === "AFTER SERVICE"
  );
  return (
    <SafeAreaView style={[tw`flex-1`, { backgroundColor }]}>
<ScrollView contentContainerStyle={{flexGrow:1,paddingBottom:100}} showsVerticalScrollIndicator={false}>

      <StatusBar backgroundColor={backgroundColor} barStyle="dark-content" />

      <View style={tw`h-[10%] flex-row px-2 gap-16`}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={tw`p-2 my-auto`}>
          <Entypo name="chevron-small-left" size={35} color="#000" />
        </TouchableOpacity>
        <Text style={tw`text-black my-auto ml-2 text-xl font-medium`}>Booking Details</Text>
      </View>

      {}
      <View style={tw`w-[90%] self-center my-3 relative`}>
        <View style={[tw`border rounded-lg border-neutral-400 py-3 px-3 flex-row items-center gap-3`, { borderColor: "#ECECEC" }]}>

          {}
          {serviceBooking.service_attachments?.length > 0 && (
            <Image
              style={tw`h-18 w-28 rounded-lg`}
              source={{ uri: imgURL + serviceBooking.service_attachments[0]?.file_name }}
            />
          )}

          {}
          <View style={tw`flex-1`}>
            <View style={tw`flex-row items-center justify-between mb-1`}>
              <Text style={tw`
                  ${item.booking_status === 'PENDING' ? 'bg-[#F29F05]'
                  : item.booking_status === 'ONGOING' ? 'bg-[#F29F05]'
                    : item.booking_status === 'ACCEPTED' ? 'bg-[#17A2B8]'
                      : item.booking_status === 'SUCCESS' ? 'bg-[#39C123]'
                        : 'bg-[#EA2021]'} 
                    text-white px-3 py-[2px] rounded-full text-xs font-semibold`}>
                {item.booking_status}
              </Text>
            </View>

            <Text style={tw`font-semibold text-neutral-800`}>{serviceBooking.name || 'N/A'}</Text>
            {}
            <View style={tw`flex-row items-center gap-1`}>
              {}
              <Image source={images.calendar} style={{ height: 20, width: 20 }} />

              <Text style={tw`text-neutral-500 text-[12px]`}>
                {moment(item.date).format('DD MMM YYYY ')} {moment(item.time, "HH:mm:ss").format('hh:mm A')}
              </Text>
            </View>
          </View>

        </View>
      </View>

      {}
      <View style={tw`px-4 ml-1`}>
        <Text style={tw`text-m font-semibold text-black mt-2`}>Notes</Text>
        <Text style={tw`text-neutral-500 text-[12px] mt-2`}>{item.notes}</Text>
        {item?.booking_address != null &&
          <>
            <Text style={tw`text-m font-semibold text-black mt-3`}>Service Location</Text>
            <Text style={tw`text-neutral-500 text-[12px] mt-2`}>
              {item?.booking_address?.address}, {item?.booking_address?.user_city?.name}, {item?.booking_address?.user_state?.name}, {item?.booking_address?.user_country?.name}
            </Text>
          </>
        }
        <View>
          <Text style={tw`text-m font-semibold text-black mt-3`}>
            Executive Assigned
          </Text>
          <View style={[tw`border rounded-lg  py-3 px-3  mt-3 flex-row items-center gap-3`, { borderColor: "#ECECEC" }]}>
            <Image source={images.userG} style={{ height: 40, width: 40 }} />
            <Text style={tw`text-neutral-600 text-[14px]  text-black`}>
              {item?.bdm_details?.name || "N/A"}
            </Text>
      <TouchableOpacity 
      onPress={() => navigation.navigate('support',{receiverId:item?.bdm_details?.id,senderId:senderId,title:item?.bdm_details?.name})}

      style={{ backgroundColor: "#2391B1", padding: 8, borderRadius: 20, right: 20, position: 'absolute' }}>
              <Text style={tw`text-neutral-600 text-[14px]  text-white`}>
                Chat
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {beforeServiceImages?.length > 0 &&

          <Text
            style={{ color: "#000", fontSize:   16, fontWeight: "600", marginHorizontal: 0, marginTop: 20 }}
          >
            Before Service
          </Text>
        }
        {beforeServiceImages?.length > 0 &&
          <View style={styles.imageGrid}>
            {beforeServiceImages.map((uri, index) => (
              <View key={index} style={[styles.BoxImages,{    height: height / 9,
                width: width / 4,}]}>
                {console.log("URI", uri)}

                <Image
                  source={{ uri: imgURL + uri.file_name }}
                  style={{ height: "100%", width: "100%", borderRadius: 20 }}
                />

              </View>
            ))}
          </View>}
        {afterServiceImages?.length > 0 &&

          <Text
            style={{ color: "#000", fontSize: 16, fontWeight: "600", marginHorizontal: 0, marginTop: 20 }}
          >
            After Service
          </Text>
        }
        {afterServiceImages?.length > 0 &&
          <View style={styles.imageGrid}>
            {afterServiceImages.map((uri, index) => (
              <View key={index} style={[styles.BoxImages,{  height: height / 9,
                width: width / 4,}]}>

                <Image
                  source={{ uri: imgURL + uri.file_name }}
                  style={{ height: "100%", width: "100%", borderRadius: 20 }}
                />

              </View>
            ))}
          </View>}
        <TouchableOpacity
          style={[

            {
              borderRadius: 30, 
              marginTop: "10%",
              padding: 15,
              justifyContent: "space-between",
              alignItems: "center",
              borderColor: "#ECECEC",
              borderWidth: 1,

              flexDirection: 'row'
            },
          ]}
          onPress={() => navigation.navigate("CheckList", { id: item.id })}
        >
          <Text style={{ fontSize: 14, fontWeight: "400", color: "#000" }}>CheckList </Text>
          <Image
            source={images.back}
            style={{ position: "absolute", right: "5%", height: 10, width: 14, transform: [{ rotate: '180deg' }] }}
          />
        </TouchableOpacity>

        {

}

        {

}
      </View>

      {item.booking_status !== 'DELETED' && item.booking_status !== 'SUCCESS' && (
        <TouchableOpacity onPress={() => { setModal(true); }}
          style={[tw`w-[90%] self-center my-4 items-center border border-neutral-400 py-3 bg-[#fff] mt-8 rounded-full`, { borderColor: "#ECECEC" }]}>
          <Text style={tw`text-red-500 text-base uppercase font-medium`}>Cancel Booking</Text>
        </TouchableOpacity>
      )}
      {item.booking_status !== 'DELETED' && item.booking_status !== 'SUCCESS' && (
        <TouchableOpacity onPress={() => { setImageModal(true); }}
          style={[tw`w-[90%] self-center my-4 items-center border border-neutral-400 py-3 bg-[#fff] mt-4 rounded-full`, { borderColor: "#ECECEC" }]}>
          <Text style={tw`text-red-500 text-base uppercase font-medium`}>Report</Text>
        </TouchableOpacity>
      )}
      {item.booking_status === 'SUCCESS' && (
        <TouchableOpacity onPress={() => { setReportModal(true); }}
          style={[tw`w-[90%] self-center my-4 items-center border border-neutral-400 py-3 bg-[green]  rounded-full`, { borderColor: "#ECECEC", marginTop: item.booking_status === 'SUCCESS' ? 28 : 20 }]}>
          <Text style={tw`text-white text-base uppercase font-medium`}>Add Review</Text>
        </TouchableOpacity>
      )}
      <Modal visible={modal} transparent animationType="slide">
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'center',
        }}>
          <View style={{
            backgroundColor: 'white',
            padding: 20,
            borderRadius: 20,
            marginHorizontal: 20
          }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Cancel Booking</Text>
              <TouchableOpacity onPress={() => setModal(false)}>
                <Icon name="x" size={24} />
              </TouchableOpacity>
            </View>

            <TextInput
              value={reason}
              onChangeText={setReason}
              placeholder="Reason"
              multiline
              style={{
                height: 100,
                marginVertical: 20,
                borderColor: '#ddd',
                borderWidth: 1,
                borderRadius: 15,
                padding: 10,
                textAlignVertical: 'top',
              }}
            />

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 10 }}>
              <TouchableOpacity
                onPress={() => setModal(false)}
                style={{

                  borderWidth: 1,
                  borderColor: '#00000080',
                  padding: 12,
                  borderRadius: 50,
                  alignItems: 'center',
                  width: '48%'
                }}>
                <Text style={{ color: '#000', fontWeight: 'bold' }}>CANCEL</Text>
              </TouchableOpacity>
              <GradientButton title={'CONFIRM'} onPress={() => cancelBooking()} />

            </View>
          </View>
        </View>
      </Modal>
      <Modal visible={reportModal} transparent animationType="slide">
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'center',
        }}>
          <View style={{
            backgroundColor: 'white',
            padding: 20,
            borderRadius: 20,
            marginHorizontal: 20,
            height: 350
          }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Add Your Review</Text>
              <TouchableOpacity onPress={() => setReportModal(false)}>
                <Icon name="x" size={24} />
              </TouchableOpacity>
            </View>

            <Text style={{ marginVertical: 10 }}>
              Your feedback will help improve driving experience
            </Text>

            <View style={{ flexDirection: 'row', marginBottom: 20 }}>
              {renderStars()}
            </View>

            <TextInput
              value={reasonReport}
              onChangeText={setReasonReport}
              placeholder="Reason"
              multiline
              style={{
                height: 100,
                marginBottom: 20,
                borderColor: '#ddd',
                borderWidth: 1,
                borderRadius: 15,
                padding: 10,
                textAlignVertical: 'top',
              }}
            />

            <GradientButton title="SUBMIT" onPress={() => reportHanler()} />
          </View>
        </View>
      </Modal>
      <Modal visible={imageModal} transparent animationType="slide">
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'center',
        }}>
          <View style={{
            backgroundColor: 'white',
            padding: 20,
            borderRadius: 20,
            marginHorizontal: 20,
            height: multiUrl.length > 0 ? 550 : 400

          }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Add Your Report</Text>
              <TouchableOpacity onPress={() => setImageModal(false)}>
                <Icon name="x" size={24} />
              </TouchableOpacity>
            </View>

            <Text style={{ marginVertical: 10 }}>
              Your feedback will help improve driving experience
            </Text>

            <TextInput
              value={imageReason}
              onChangeText={setImageReason}
              placeholder="Reason"
              multiline
              style={{
                height: 80,
                marginBottom: 20,
                borderColor: '#ddd',
                borderWidth: 1,
                borderRadius: 15,
                padding: 10,
                textAlignVertical: 'top',
              }}
            />
            <View style={styles.fieldCont}>
              <TouchableOpacity
                style={styles.addImagecontainer}
                onPress={() => handleImageUpdate()}
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
                  showsHorizontalScrollIndicator={false}
                  renderItem={(({ item, index }) => {
                    return (
                      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginHorizontal: 8, marginTop: 8 }}>

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
                  })} />

                :
                <></>
            }
            <GradientButton title="SUBMIT" onPress={() => imageHandlerApi()} />
          </View>
        </View>
      </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

export default BookingDetails;

const styles = StyleSheet.create({
  addImagecontainer: {
    height: 80,
    width: '100%',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#2F6836",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20
  },
  addImagecontainerTxt: {
    color: "#2F6836",
    fontSize: 14,
    marginTop: "1%",
    fontWeight: "700",
  },
  imageGrid: {
    flexDirection: "row",
    justifyContent: "flex-start",
    flexWrap: "wrap",
    marginTop: "3%",

  },
  BoxImages: {

    borderRadius: 20,
    backgroundColor: "#c9c9c9",
    margin: "1%",
    marginHorizontal: '2%',
    justifyContent: "center",
    alignItems: "center",
  },
})
