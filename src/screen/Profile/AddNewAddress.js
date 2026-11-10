import {
    View, Text, StatusBar, TextInput, TouchableOpacity, SafeAreaView,
    StyleSheet
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

import { base } from '../../api/Constants';
import LoadingScreen from '../../components/Loading';
import { tw } from '../../utils/styling';
import { Dropdown } from 'react-native-element-dropdown';

const AddNewAddress = (props) => {
    const navigation = useNavigation();
    const { params: { screen, addressData } } = useRoute();

    const [profileImage, setProfileImage] = useState(null);
    const [showAddress2, setShowAddress2] = useState(false);
    const [addressNew, setAddressNew] = useState("")
    const [loading, setLoading] = useState(true);
    const backgroundColor = "white";
    const [state, setState] = useState([])
    const [stateId, setStateId] = useState("")
    const [city, setCity] = useState([])
    const [cityId, setCityId] = useState("")

    useFocusEffect(
        React.useCallback(() => {
            if (screen === 'Edit') {
                getAllAddress()
            } else {
                getAllState(233);
            }
        }, [props])
    );

    const getAllState = async (id) => {
        console.log(id, "-==-id");

        try {
            const token = await AsyncStorage.getItem('token');
            const res = await axios.get(base.getAllState + id, {
                headers: {
                    'x-access-token': token,
                    'role_id': 6
                }
            });

            if (res.data.status === 200) {
                const arr = res.data.data.all_state.map(item => ({
                    label: item.name,
                    value: item.id,
                }));
                setState(arr);
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
    const getAllCity = async (id) => {
        try {

            const token = await AsyncStorage.getItem('token');
            const res = await axios.get(base.getAllCity + id, {
                headers: {
                    'x-access-token': token,
                    'role_id': 6
                }
            });

            if (res.data.status === 200) {

                const arr = res.data.data.all_city.map(item => ({
                    label: item.name,
                    value: item.id,
                }));
                setCity(arr)

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
    const getAllAddress = async () => {
        try {

            const token = await AsyncStorage.getItem('token');
            const res = await axios.get(base.getAddress + addressData?.id, {
                headers: {
                    'x-access-token': token,
                    'role_id': 6
                }
            });

            if (res.data.status === 200) {
                const data = res.data.data;
                console.log(data.country_id, "-==-=-getalladdress");
                setStateId(data.state_id); 
                setCityId(data.city_id);   
                setAddressNew(data.address);        

                getAllState(data.country_id);
                getAllCity(data.state_id);
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

    const addNewAddressApiHandler = async () => {
        let data = {
            "address": addressNew,
            "state_id": stateId,
            "city_id": cityId
        }
        if (stateId === "" || cityId === "" || addressNew === "") {
            Toast.show({ type: 'error', text1: 'Please fill address' })
        } else {
            try {
                const token = await AsyncStorage.getItem('token');
                const res = await axios.post(base.addNewAddress, data, {
                    headers: {
                        'x-access-token': token,
                        'role_id': 6
                    }
                });

                if (res.status === 201) {
                    Toast.show({
                        type: 'success',
                        text1: 'Success',
                        text2: res.data.message
                    });
                    screen === 'Booking' ? 
                    navigation.goBack():
                    navigation.navigate('EditProfile');
                } else {
                    Toast.show({
                        type: 'error',
                        text1: 'Error',
                        text2: res.data.message
                    });
                }
            } catch (error) {
                console.log("Addnew address error", error);
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: 'Something went wrong'
                });
            }
        }
    };
    const editNewAddressApiHandler = async () => {
        const formData = new FormData()
        formData.append('address',addressNew)
        formData.append('state_id',stateId)
        formData.append('city_id',cityId)
        formData.append('user_address_id',addressData?.id)

        console.log(formData,"=--=-=edit data");

        if (stateId === "" || cityId === "" || addressNew === "") {
            Toast.show({ type: 'error', text1: 'Please fill address' })
        } else {
            try {
                const token = await AsyncStorage.getItem('token');
                const res = await axios.put(base.editAddress, formData, {
                    headers: {
                        'x-access-token': token,
                        'role_id': 6
                    }
                });

                if (res.status === 201) {
                    Toast.show({
                        type: 'success',
                        text1: 'Success',
                        text2: res.data.message
                    });
                    navigation.navigate('EditProfile');
                } else {
                    Toast.show({
                        type: 'error',
                        text1: 'Error',
                        text2: res.data.message
                    });
                }
            } catch (error) {
                console.log("Addnew address error", error);
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: 'Something went wrong'
                });
            }
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
                <Text style={tw`text-black my-auto  text-xl font-medium`}>
                   {screen === "Edit" ? "     Edit  Address" : " Add New Address"}
                </Text>

            </View>

            {}
            <View style={tw`flex-1 justify-between`}>
                <View style={tw`w-[90%] self-center my-3 gap-5`}>
                    <View style={{ alignItems: 'flex-start', gap: 3, marginTop: 12 }}>
                        <Text
                            style={{

                                fontSize: 16,
                                color: '#000',
                                fontWeight: '500',
                            }}>
                            State
                        </Text>
                        <Dropdown
                            style={[styles.dropdown]}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            inputSearchStyle={styles.inputSearchStyle}
                            iconStyle={styles.iconStyle}
                            itemContainerStyle={{ borderRadius: 12, borderColor: '#E5E5E5' }}
                            data={state}
                            maxHeight={300}
                            labelField={"label"}
                            valueField={'value'}
                            placeholder={'Select State'}
                            searchPlaceholder="Search..."
                            selectedTextProps={{ ellipsizeMode: 'tail', numberOfLines: 1 }}
                            value={Number(stateId)}

                            onChange={item => {
                                console.log(item);

                                getAllCity(item.value)
                                setStateId(item.value)
                            }}

                            itemTextStyle={{ color: '#333333', borderColor: '#E5E5E5' }}
                        />
                    </View>
                    <View style={{ alignItems: 'flex-start', gap: 3, marginTop: 0 }}>
                        <Text
                            style={{

                                fontSize: 16,
                                color: '#000',
                                fontWeight: '500',
                            }}>
                            City
                        </Text>
                        <Dropdown
                            style={[styles.dropdown]}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            inputSearchStyle={styles.inputSearchStyle}
                            iconStyle={styles.iconStyle}
                            itemContainerStyle={{ borderRadius: 12, borderColor: '#E5E5E5' }}
                            data={city}
                            maxHeight={300}
                            labelField="label"
                            valueField="value"
                            placeholder={'Select City'}
                            searchPlaceholder="Search..."
                            selectedTextProps={{ ellipsizeMode: 'tail', numberOfLines: 1 }}
                            value={cityId}

                            onChange={item => {
                                setCityId(item.value)
                            }}

                            itemTextStyle={{ color: '#333333', borderColor: '#E5E5E5' }}
                        />
                    </View>
                    <View style={tw`gap-2`}>
                        <Text style={tw`text-neutral-800 font-medium`}>Address </Text>

                        <TextInput
                            placeholder="Enter your Address "
                            placeholderTextColor="#333333"
                            value={addressNew}
                            onChangeText={(e) => setAddressNew(e)}
                            style={tw`border-[0.3px] border-neutral-400 py-3 px-4 h-12 rounded-full text-neutral-700`}
                        />

                    </View>

                    {}

                </View>

                {}
                <TouchableOpacity onPress={
                    () => {
                        screen === 'Edit' ? editNewAddressApiHandler() :
                            addNewAddressApiHandler()
                    }
                } style={tw`absolute bottom-30 w-[90%] self-center`}>
                    <LinearGradient
                        colors={["#243352", "#08F624"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={tw`w-full py-4 items-center rounded-full`}
                    >
                        <Text style={tw`text-white text-lg font-semibold`}>{screen === "Edit" ? "Update Address" : " Add New Address"}</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default AddNewAddress;
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
});
