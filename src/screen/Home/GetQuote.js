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
import React, { useCallback, useEffect, useRef, useState } from 'react';
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
export default function GetQuote() {
    const [value, setValue] = useState(null);
    const [isFocus, setIsFocus] = useState(false);
    const navigation = useNavigation();
    const { item } = useRoute().params;

    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);
    const [allQuestions, setAllQuestions] = useState([])
    const [allAnswers, setAllAnswers] = useState([])
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
    console.log('Service Item', item);
    useEffect(() => {
        if (item) {
            setPrice(item.price); 
            setTax(10); 
        }
    }, [item]);

    const taxAmount = (price * tax) / 100;
    const totalPayable = price + taxAmount;
    const [multiUrl, setMultiUrl] = useState([])

    const submitQuotes = async () => {
        try {
            setLoading(true)
            const token = await AsyncStorage.getItem('token');
            console.log("all answers",allAnswers)
            const dataToSend = {
                answers:allAnswers
            }
            const response = await axios.post(base.quoteSubmit, dataToSend, {
                headers: {
                    'x-access-token': token,
                    role_id: 6
                }
            })
            console.log("submit response", response.data)
            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: response?.data?.message,
                text1Style: {
                    fontSize: 12
                },
            })
            navigation.goBack()
            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.log("submit error", error)
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: error?.response?.data?.message,
                text1Style: {
                    fontSize: 12
                },
            })
        }

    }

    const fetchQuoteQuestions = async () => {
        try {
            setLoading(true)
            const token = await AsyncStorage.getItem('token');
            const response = await axios.get(base.getQuoteQuestions, {
                headers: {
                    'x-access-token': token,
                    role_id: 6
                }
            })
            const questionsAll = response.data?.data?.map((q) => ({ id: q.id, question: q.question }))
            setAllQuestions(questionsAll)
            const answers = questionsAll.map(q => {
                if (q.question === "Which service are you requesting?") {
                    return ({ questionId: q.id, answer: item?.name })
                }

                return ({ questionId: q.id, answer: "" })
            })
            setAllAnswers(answers)
            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.log("quote error", error)
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: error?.response?.data?.message,
                text1Style: {
                    fontSize: 12
                },
            })
        }
    }

    useEffect(() => {
        SQIPCore.setSquareApplicationId('REDACTED');
    }, []);

    useFocusEffect(useCallback(() => {

        fetchQuoteQuestions()

    }, []))

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
                <Text style={[tw`text-black my-auto text-xl font-medium left-1/1.3`]}>
                    Get A Quote
                </Text>
            </View>

            <View
                style={tw` mb-4 gap-4 mx-8   flex-row items-center border-[1px] px-2 py-2 rounded-xl border-neutral-400 `}>
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
                    <Text style={tw`text-lg text-neutral-700 font-medium self-start `}>
                        {item.name}
                    </Text>
                    {}
                </View>
            </View>

            <ScrollView
                contentContainerStyle={{ alignItems: 'center' }}
                style={tw`flex-1  `}>
                <View style={tw`mx-8 gap-2 `}>

                    {allQuestions.length > 0 && allQuestions.map((q) => {
                        const answer = allAnswers?.find(a => a.questionId === q.id)?.answer

                        const handleChange = (text) => {
                            setAllAnswers(prev => {
                                if (!prev) return []
                                return prev.map((p) => {
                                    if (p.questionId === q.id) {
                                        return ({ ...p, answer: text })
                                    }
                                    return p
                                })
                            })
                        }

                        return <View key={q.id} style={{ alignItems: 'flex-start', gap: 3, marginVertical: 5 }}>
                            <Text
                                style={{
                                    marginHorizontal: 5,
                                    fontSize: 16,
                                    color: '#000',
                                    fontWeight: '500',
                                    marginBottom: 5
                                }}>
                                {q.question}
                            </Text>
                            <TextInput
                                placeholder="Answer the above question"
                                placeholderTextColor="#7d828a"
                                value={answer}
                                onChangeText={text => handleChange(text)}
                                style={{
                                    justifyContent: 'space-between',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    height: 50,
                                    color: '#333333',
                                    borderWidth: 1,
                                    borderColor: '#E5E5E5',
                                    borderRadius: 30,
                                    width: '100%',
                                    paddingHorizontal: 20,
                                    paddingVertical: 10
                                }}
                            />

                        </View>
                    }
                    )}

                    <TouchableOpacity onPress={submitQuotes} style={tw`my-3 rounded-full`}>
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
                                Submit
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
        height: 120,
        width: '100%',
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
