import {
    KeyboardAvoidingView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ActivityIndicator,
    TextInput,
    Dimensions,
    Image,
    PermissionsAndroid,
  } from 'react-native';
  import React, {useEffect, useRef, useState} from 'react';
  import {tw} from '../../utils/styling';
  import AntDesign from 'react-native-vector-icons/AntDesign';
  import RBSheet from 'react-native-raw-bottom-sheet';
  import {Controller, useForm} from 'react-hook-form';
  import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
  import {useFocusEffect, useNavigation, useRoute} from '@react-navigation/native';
  import AsyncStorage from '@react-native-async-storage/async-storage';
  import axios from '../../api/axios';
  import {GOOGLE_MAPS_APIKEY, base} from '../../api/Constants';
  import Toast from 'react-native-toast-message';
  import LoadingScreen from '../../components/Loading';
  import MapView, { Marker } from 'react-native-maps';
  import { SafeAreaView } from 'react-native-safe-area-context';
  import Geolocation from 'react-native-geolocation-service';

  const Address = () => {
    const {
      control,
      handleSubmit,
      formState: {errors},
      setValue,
      getValues
    } = useForm({
      defaultValues: {
        address_line_1: item?.address_line_1 || '',
        address_line_2: item?.address_line_2 || '',
        municipality: item?.municipality || '',
        province: item?.province || '',
        postal_code: item?.postal_code || '',
      },
    });

    const navigation = useNavigation();
    const [lat, setLat] = useState(0);
    const addressRef = useRef();
    const refRBSheet = useRef();
    const [lng, setLng] = useState(0);
    const [fullAddress, setFullAddress] = useState('');
    const [loading, setLoading] = useState(false);
    const [locationPermissionGranted, setLocationPermissionGranted] = useState(false);
    const mapRef = useRef();
    const _mapView = useRef(null);
    const {height: screenHeight, width: screenWidth} = Dimensions.get('window');

    const {item = null} = useRoute().params;

    const [initialRegion, setInitialRegion] = useState({
      latitude: lat,
      longitude: lng,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });

    const getCoordsFromAddressName = (latitude, longitude) => {
      fetch(
        'https://maps.googleapis.com/maps/api/geocode/json?address=' +
          latitude +
          ',' +
          longitude +
          '&key=' +
          GOOGLE_MAPS_APIKEY,
      )
        .then((response) => response.json())
        .then((responseJson) => {
          setLat(responseJson.results[0].geometry.location.lat);
          setLng(responseJson.results[0].geometry.location.lng);

          setFullAddress(responseJson.results[0].formatted_address);

          const addressComponents = responseJson.results[0].address_components;
          addressComponents.forEach(component => {
            console.log(component)
            if (component.types.includes('locality'))
              setValue('municipality', component.long_name);
            if (component.types.includes('administrative_area_level_1'))
              setValue('province', component.long_name);
            if (component.types.includes('postal_code'))
              setValue('postal_code', component.long_name);
          });
        });
    };

    const getCurrentLocation = async () => {
        const hasPermission = await requestLocationPermission();
        if (!hasPermission) {
          Toast.show({
            type: 'error',
            text1: 'Location permission denied',
            text2: 'Please enable location permissions in settings',
          });
          return;
        }

        setLocationPermissionGranted(true);
        setLoading(true);

        Geolocation.getCurrentPosition(
          (position) => {
            const {latitude, longitude} = position.coords;

            const newRegion = {
              latitude,
              longitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            };

            setInitialRegion(newRegion);
            setLat(latitude);
            setLng(longitude);

            _mapView.current?.animateToRegion(newRegion, 1000);

            getCoordsFromAddressName(latitude, longitude);
            setLoading(false);
          },
          (error) => {
            setLoading(false);
            console.log('Location error:', error);
            Toast.show({
              type: 'error',
              text1: 'Error getting location',
              text2: error.message,
            });
          },
          {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 10000,
          },
        );
      };

      useEffect(() => {
        if(!item){
            getCurrentLocation();
        }
      }, [
        item
      ]);

      const requestLocationPermission = async () => {
        try {
          if (Platform.OS === 'ios') {
            const granted = await Geolocation.requestAuthorization('whenInUse');
            return granted === 'granted';
          }

          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Location Permission',
              message: 'This app needs access to your location to show your current position.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            },
          );
          return granted === PermissionsAndroid.RESULTS.GRANTED;
        } catch (err) {
          console.warn('Location permission err:', err);
          return false;
        }
      };

    const onMapRegionChange = (region) => {
      getCoordsFromAddressName(region.latitude, region.longitude);
      setLat(region.latitude);
      setLng(region.longitude);
    };

    const addNewAddress = async data => {
      setLoading(true);
      data.address_lat = lat;
      data.address_long = lng;

      if (item) {
        data.user_address_id = item?.id;
      }
      try {
        const token = await AsyncStorage.getItem('token');
        const url = item ? base.updateAddress : base.addNewAddress;
        const res = await axios.request({
          method: item ? 'PUT' : 'POST',
          url: url,
          data: data,
          headers: {
            'x-access-token': token,
            role_id: 6,
          },
        });
        if (item ? res.status == 200 : res.status == 200) {
          refRBSheet.current.close();
          Toast.show({
            type: 'success',
            text1: res.data.message,
          });
        }
        navigation.goBack();
      } catch (error) {
        Toast.show({
          text1: error?.response?.data?.message || 'Something went wrong',
          type: 'error',
        });
      } finally {
        setLoading(false);
      }
    };

    useFocusEffect(
        React.useCallback(() => {
          if (item) {
            console.log(item)
            setLat(parseFloat(item.address_lat));
            setLng(parseFloat(item.address_long));
            setInitialRegion({
              latitude: parseFloat(item.address_lat),
              longitude: parseFloat(item.address_long),
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            });
            _mapView.current?.animateToRegion({
                latitude: parseFloat(item.address_lat),
                longitude: parseFloat(item.address_long),
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
            })
            setValue('address_line_1', item.address_line_1);
            setValue('address_line_2', item.address_line_2);
            setValue('municipality', item.municipality);
            setValue('province', item.province);
            setValue('postal_code', item.postal_code);
            refRBSheet?.current?.open();
          }
        }, [item]),
      );

    if (loading) {
      return <LoadingScreen />;
    }
    return (
      <SafeAreaView style={tw`flex-1`}>
        <StatusBar backgroundColor="#086FB1" barStyle="light-content" />
        <View style={tw`h-[10%] bg-[#086FB1] flex-row px-4 gap-4`}>
          <TouchableOpacity
            style={tw`p-2 flex-row items-center gap-3 my-auto rounded-full`}
            onPress={() => navigation.goBack()}>
            <AntDesign name="arrowleft" size={24} color="white" />
          </TouchableOpacity>
          <Text style={tw`text-white my-auto text-xl font-medium capitalize`}>
            Select Location
          </Text>
        </View>
        <View style={tw`flex-1`}>
          {}
          <MapView
        ref={_mapView}
        apikey={'REDACTED'}
        style={{ flex: 1, position: 'relative' }}
        initialRegion={initialRegion}
        followsUserLocation={true}
        showsTraffic={false}
        showsMyLocationButton={true}
        zoomEnabled={true}
        resetOnChange={true}
        moveOnMarkerPress={true}
        onRegionChangeComplete={(reg) => onMapRegionChange(reg)}

          >
                    </MapView>

          {}
          <View style={tw`absolute w-full bottom-0`} >
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        style={tw`w-full bg-white`} 
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <View style={{
          width: '100%',
          backgroundColor: 'white',
          padding: 12,
          paddingVertical: 20,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
        }}>
          <Text style={tw`text-md w-[95%] my-4 font-medium text-[#333333]`}>
            {fullAddress || getValues('address_line_1')}
          </Text>

          <TouchableOpacity onPress={() => refRBSheet.current.open()} style={tw`bg-[#086FB1] w-[95%] my-2 rounded-lg py-2 items-center`}>
            <Text style={tw`text-white font-medium text-lg`}>
              Add Address
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
          <View
            style={{
              position: 'absolute',
              zIndex: 1000,
              alignSelf: 'center',
              top: screenHeight / 2.6,
            }}>
            <AntDesign name="enviromento" size={40} color="#086FB1" />
          </View>
          {}
          <View style={styles.searchContainer}>
          <GooglePlacesAutocomplete
          placeholder="Search"
          fetchDetails={true}
          GooglePlacesDetailsQuery={{ fields: 'geometry' }}
          onPress={(data, details = null) => {
            console.log(
              JSON.stringify(details.geometry.location.lng),
              '==========',
            );
            setInitialRegion({
              latitude: details.geometry.location.lat,
              longitude: details.geometry.location.lng,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            });

            _mapView?.current?.animateToRegion(
              {
                latitude: details.geometry.location.lat,
                longitude: details.geometry.location.lng,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              },
              1000,
            );
            setLat(details.geometry.location.lat);
            setLng(details.geometry.location.lng);
            setFullAddress(data.description);
          }}
          query={{
            key: 'REDACTED',
            language: 'en',
          }}
          textInputProps={{ placeholderTextColor: "gray" }}
          styles={{
            description: { color: "#333333" },
            textInputContainer: {
              width: '100%',
            },
            listView: { marginLeft: -60 },

            textInput: {
              height: 40,
              color: '#5d5d5d',
              fontSize: 16,
              marginHorizontal: 0,
            },
            predefinedPlacesDescription: {
              color: '#1faadb',
            },
          }}
        />

          </View>
          {}
          <RBSheet
        ref={refRBSheet}
        height={
            Dimensions.get('window').height/1.5
        }
        closeDuration={.1}

        onClose={() => {
            setFullAddress('')
            setLat(0)
            setLng(0)
            console.log(fullAddress , lat , lng , '=====================')

        }}

        draggable
        closeOnPressBack
        closeOnDragDown
        customStyles={{
          wrapper: {
            backgroundColor: 'rgba(0,0,0,0.1)',
            shadowOpacity: 0.25,

          },
          draggableIcon: {
            backgroundColor: '#000',
          },
        }}
        customModalProps={{
          animationType: 'slide',
          statusBarTranslucent: true,
        }}
        customAvoidingViewProps={{
          enabled: false,
        }}>
       <KeyboardAvoidingView behavior='padding' style={{
        flex : 1,

       }}>
         <ScrollView keyboardShouldPersistTaps={'handled'}  showsVerticalScrollIndicator={false} style={tw`flex-1  `} >

<View style={{
    marginHorizontal : 12,
    gap : 18
}}>
    <Text style={tw`text-xl font-medium  ml-4 text-[#333333]`}>
        Enter Complete Address 
    </Text>

<View style={{
   alignItems : 'center',
    gap : 12,

}}>
    {

}

    <View style={tw`mx-8 w-[90%] gap-3`}>
        <Text style={tw`text-base  text-neutral-800 `}>Address Line 1</Text>

        <Controller
            name='address_line_1'
            control={control}
            defaultValue={""}
            render={({field: {onChange, value ,  }}) => (
                <TextInput
                value={value || ""}
                onChangeText={onChange}

                rules={
                {
                    required : [true , 'Address Line 1 is required']
                }
            }
                placeholder='Enter Address Line 1'
                placeholderTextColor='#333333'
                selectionColor={'gray'}
                style={tw`border-[1px]  rounded-lg h-12 px-4 text-neutral-700 ${errors.address_line_1 ? "border-red-700" : "border-neutral-400"}    `}
                />
            )}
        />

    </View>
    <View style={tw`mx-8 w-[90%] gap-3`}>
        <Text style={tw`text-base  text-neutral-800 `}>Address Line 2</Text>

        <Controller
            name='address_line_2'
            control={control}

            render={({field: {onChange, value , }}) => (
                <TextInput

                value={value}
                onChangeText={onChange}
                placeholder='Enter Address Line 2'
                placeholderTextColor='gray'
                selectionColor={'#333333'}
                style={tw`border-[1px] border-neutral-400 rounded-lg h-12 px-4 text-neutral-700  `}
                />
            )}
        />
    </View>
    <View style={tw`mx-8 w-[90%] gap-3`}>
        <Text style={tw`text-base  text-neutral-800 `}>Municipality</Text>

       <Controller
            name='municipality'

            control={control}
            render={({field: {onChange, value , }}) => (
                <TextInput
                value={value}
                onChangeText={onChange}
                placeholder='Enter Municipality'
                placeholderTextColor='gray'
                selectionColor={'#333333'}
                style={tw`border-[1px]  rounded-lg h-12 px-4 text-neutral-700 ${errors.municipality ? "border-red-700" : "border-neutral-400"}    `}
                />
            )}

       />

    </View>
    <View style={tw`mx-8 w-[90%] gap-3  `}>
        <Text style={tw`text-base  text-neutral-800 `}>Province</Text>

       <Controller
            name='province'
            control={control}

            render={({field: {onChange, value , }}) => (
                <TextInput
                value={value}
                onChangeText={onChange}
                placeholder='Enter Province'
                placeholderTextColor='gray'
                selectionColor={'#333333'}
                style={tw`border-[1px]  rounded-lg h-12 px-4 text-neutral-700 ${errors.province ? "border-red-700" : "border-neutral-400"}    `}

                />
            )}
       />

    </View>
    <View style={tw`mx-8 w-[90%] gap-3  mb-3  `}>
        <Text style={tw`text-base  text-neutral-800 `}>Postal Code</Text>
        <Controller
            name='postal_code'
            control={control}

            render={({field: {onChange, value , }}) => (
                <KeyboardAvoidingView behavior='height'>

                <TextInput
                value={value}
                onChangeText={onChange}
                placeholder='Enter Postal Code'
                placeholderTextColor='gray'
                style={tw`border-[1px]  rounded-lg h-12 px-4 text-neutral-700 ${errors.postal_code ? "border-red-700" : "border-neutral-400"}    `}

                />
                </KeyboardAvoidingView>
            )}
        />

    </View>

    <TouchableOpacity onPress={handleSubmit(addNewAddress)} style={tw`w-[90%] bg-[#086FB1] rounded-lg py-3 items-center mx-auto mb-80 `}>
        <Text style={tw`text-white font-medium text-lg `}>
         {item ? "Save Address"  : "Add Address"}
        </Text>
    </TouchableOpacity>

</View>

</View>
</ScrollView>
       </KeyboardAvoidingView>
      </RBSheet>
        </View>
      </SafeAreaView>
    );
  };

  const styles = StyleSheet.create({
    searchContainer: {
      position: 'absolute',
      top: 20,
      width: '90%',
      alignSelf: 'center',
      zIndex: 1,
    },
    searchInput: {
      height: 50,
      borderWidth: 1,
      borderColor: '#E5E5E5',
      borderRadius: 12,
      backgroundColor: 'white',
      paddingHorizontal: 15,
    },
    searchResultsList: {
      backgroundColor: 'white',
      borderRadius: 8,
      marginTop: 5,
    },
    input: {
      borderWidth: 1,
      borderColor: '#E5E5E5',
      borderRadius: 12,
      height: 50,
      paddingHorizontal: 15,
      color: '#333333',
    },
  });

  export default Address;
