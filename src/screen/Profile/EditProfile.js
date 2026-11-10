import {
  View, Text, StatusBar, TextInput, TouchableOpacity, SafeAreaView,
  ScrollView
} from 'react-native';
import React, { useState } from 'react';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import ImagePicker from 'react-native-image-crop-picker';
import { useForm, Controller } from 'react-hook-form';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from '../../api/axios';
import Toast from 'react-native-toast-message';
import Entypo from 'react-native-vector-icons/Entypo';
import LinearGradient from 'react-native-linear-gradient';
import Feather from 'react-native-vector-icons/Feather';
import { base } from '../../api/Constants';
import LoadingScreen from '../../components/Loading';
import { tw } from '../../utils/styling';

const EditProfile = (props) => {
  const navigation = useNavigation();

  const [profileImage, setProfileImage] = useState(null);
  const [showAddress2, setShowAddress2] = useState(false);
  const [addressList, setAddressList] = useState([])
  const [loading, setLoading] = useState(true);
  const backgroundColor = "white";

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      mobile: '',
      address: '',
      address2: '',
    }
  });

  useFocusEffect(
    React.useCallback(() => {
      getUserProfile();
      getAllAddress()
    }, [props])
  );

  const getUserProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await axios.get(base.getUserProfile, {
        headers: {
          'x-access-token': token,
          'role_id': 6
        }
      });

      if (res.data.status === 200) {
        const userData = res.data.data;
        reset({
          name: userData.user_profile.name,
          email: userData.email,
          mobile: userData.user_profile.mobile,
          address1: userData.user_profile.address1 || '',
          address2: userData.user_profile.address2 || ''
        });
        setLoading(false);
      } else {
        setLoading(false);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: res.data.message
        });
      }

    } catch (error) {
      setLoading(false);
      console.log("getUserProfile error", error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Something went wrong'
      });
    }
  };

  const handleImageUpdate = async () => {
    ImagePicker.openPicker({
      mediaType: 'photo',
      compressImageQuality: 0.8,
      cropping: true,
    }).then(result => {
      setProfileImage(result);
    }).catch(err => {
      console.log("ImagePicker error", err);
    });
  };

  const updateProfile = async (data) => {
    if (profileImage) {
      const newFile = {
        uri: profileImage.path,
        type: profileImage.mime,
        name: profileImage.path.split('/').pop()
      };
      data['images'] = newFile;
    }
    console.log(data, "=-==--update profile img");

    try {
      const token = await AsyncStorage.getItem('token');
      const res = await axios.put(base.updateProfile, data, {
        headers: {
          'x-access-token': token,
          'role_id': 6
        }
      });

      if (res.status === 200) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: res.data.message
        });
        navigation.navigate('Profile');
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: res.data.message
        });
      }
    } catch (error) {
      console.log("updateProfile error", error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Something went wrong'
      });
    }
  };
  const getAllAddress = async () => {
    try {

      const token = await AsyncStorage.getItem('token');
      const res = await axios.get(base.allUserAddress, {
        headers: {
          'x-access-token': token,
          'role_id': 6
        }
      });
      console.log(JSON.stringify(res.data.data), "-==-=-getalladdress");

      if (res.data.status === 200) {
        setAddressList(res.data.data)
        setLoading(false);
      } else {
        setLoading(false);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: res.data.message
        });
      }

    } catch (error) {
      setLoading(false);
      console.log("getUserProfile error", error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Something went wrong'
      });
    }
  };
  const deleteAddressHandler = async (id) => {
    try {

      const token = await AsyncStorage.getItem('token');
      const res = await axios.post(base.delete_Address+"/"+id,{}, {
        headers: {
          'x-access-token': token,
          'role_id': 6
        }
      });
      console.log(JSON.stringify(res.data), "-==-=-delete");

      if (res.data.status === 200) {

        getAllAddress()
        setLoading(false);
      } else {
        setLoading(false);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: res.data.message
        });
      }

    } catch (error) {
      setLoading(false);
      console.log("getUserProfile error", error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Something went wrong'
      });
    }
  };

  if (loading) return <LoadingScreen />;

  return (
    <SafeAreaView style={[tw`flex-1`, { backgroundColor }]}>
      <StatusBar backgroundColor={backgroundColor} barStyle="dark-content" />

      {}
      <View style={tw`h-[10%] flex-row px-2 gap-14`}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={tw`p-2 items-center justify-center my-auto`}>
          <Entypo name="chevron-small-left" size={35} color="#000" />
        </TouchableOpacity>
        <Text style={tw`text-black my-auto text-xl ml-10 font-medium`}>
          Edit Profile
        </Text>
      </View>
      <ScrollView style={{}}>

        {}
        <View style={tw`flex-1 justify-between`}>
          <View style={tw`w-[90%] self-center my-3 gap-5`}>
            {}
            <View style={tw`gap-2`}>
              <Text style={tw`text-neutral-800 font-medium`}>Name</Text>
              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    placeholder="Enter your Name"
                    placeholderTextColor="#333333"
                    value={value}
                    onChangeText={onChange}
                    style={tw`border-[0.3px] h-12 border-neutral-400 py-3 px-4 rounded-full text-neutral-700`}
                  />
                )}
              />
            </View>

            {}
            <View style={tw`gap-2`}>
              <Text style={tw`text-neutral-800 font-medium`}>Phone Number</Text>
              <Controller
                control={control}
                name="mobile"
                rules={{
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: 'Invalid Phone Number'
                  }
                }}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    keyboardType="phone-pad"
                    placeholder="Enter your Phone"
                    placeholderTextColor="#333333"
                    value={value}
                    onChangeText={onChange}
                    style={tw`border-[${errors.mobile ? '1px' : '.3px'}] ${errors.mobile ? 'border-red-700' : 'border-neutral-400'} py-3 h-12 px-4 rounded-full text-neutral-700`}
                  />
                )}
              />
            </View>

            {}
            <View style={tw`gap-2`}>
              <Text style={tw`text-neutral-800 font-medium`}>Email</Text>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    placeholder="Enter your Email"
                    placeholderTextColor="#333333"
                    value={value}
                    onChangeText={onChange}
                    editable={false}
                    style={tw`border-[0.3px] border-neutral-400 py-3 px-4 rounded-full h-12 text-neutral-700`}
                  />
                )}
              />
            </View>

            {}
            <View style={tw`gap-4 `}>
              {addressList.map((item, index) => (
                <View key={item.id}>
                  <Text style={tw`text-neutral-800 font-medium`}>
                    Address {index + 1}
                  </Text>

                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <TextInput
                      value={`${item.address}, ${item.user_city?.name}, ${item.user_state?.name}, ${item.user_country?.name}`}
                      editable={false}
                      style={tw`border w-[74%] border-neutral-400 mt-2 py-3 h-10 px-4 rounded-full text-neutral-700`}
                    />
                    <TouchableOpacity
                      onPress={() => navigation.navigate('AddNewAddress', { addressData: item, screen: 'Edit' })}
                      style={tw`mt-0 self-end px-2 py-2 mb-1 bg-blue-500 rounded-full`}
                    >
                      {}
                      <Feather name="edit" size={18} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => deleteAddressHandler(item.id)}
                      style={tw`mt-0 self-end px-2 py-2 mb-1 bg-red-500 rounded-full`}
                    >
                      <Feather name="trash" size={18} color="#fff" />
                    </TouchableOpacity>
                  </View>

                </View>
              ))}
            </View>

            {}
            {showAddress2 && (
              <View style={tw`gap-2`}>
                <View style={tw`flex-row justify-between items-center`}>
                  <Text style={tw`text-neutral-800 font-medium`}>Address 2</Text>
                  <TouchableOpacity onPress={() => setShowAddress2(false)}>
                    <Text style={tw`text-red-600 font-semibold`}>Remove</Text>
                  </TouchableOpacity>
                </View>
                <Controller
                  control={control}
                  name="address2"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      placeholder="Enter your Address 2"
                      placeholderTextColor="#333333"
                      value={value}
                      onChangeText={onChange}
                      style={tw`border-[0.3px] border-neutral-400 h-12 py-3 px-4 rounded-full text-neutral-700`}
                    />
                  )}
                />
              </View>
            )}

            {!showAddress2 && (
              <TouchableOpacity onPress={() =>

                navigation.navigate('AddNewAddress', { addressData: "", screen: 'Add' })
              } style={tw`mt-2`}>
                <Text style={tw`text-green-600 font-semibold`}>+ Add Address</Text>
              </TouchableOpacity>
            )}
          </View>

          {}

        </View>
        <View style={{ marginBottom: 200 }} />
      </ScrollView>
      <TouchableOpacity onPress={handleSubmit(updateProfile)} style={tw`absolute bottom-10 w-[90%] self-center`}>
        <LinearGradient
          colors={["#243352", "#08F624"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={tw`w-full py-4 items-center rounded-full`}
        >
          <Text style={tw`text-white text-lg font-semibold`}>SAVE DETAILS</Text>
        </LinearGradient>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default EditProfile;
