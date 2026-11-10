import {
    View, Text, StatusBar, TextInput, TouchableOpacity, SafeAreaView,
    ScrollView,
    Pressable
} from 'react-native';
import React, { useCallback, useState } from 'react';
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
import { Image } from 'react-native';
import images from '../../assets/images';

const GetAllQuotesbyUser = (props) => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false)
    const [allQuotes, setAllQuotes] = useState([])

    const backgroundColor = "white";

    const getAllQuotes = async () => {
        try {
            setLoading(true)
            const token = await AsyncStorage.getItem('token');
            const response = await axios.get(base.allQuotesByUser, {
                headers: {
                    'x-access-token': token,
                    role_id: 6
                }
            })
            console.log("response quotes", token)
            setAllQuotes(response.data.data)
            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.log("all quote error", error)
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

    useFocusEffect(useCallback(() => {
        getAllQuotes()
    }, []))

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
                    All Quotes
                </Text>
            </View>
            <ScrollView style={tw`flex-1`}>

                {allQuotes?.length > 0 ?
                    (<View style={tw`flex-1 justify-center gap-2 px-4 mt-2`}>
                        {
                            allQuotes?.map(q => {
                                const heading = q.answers.find(a => a.question.question === "Which service are you requesting?")?.answer

                                return <Pressable key={q.id} style={tw`bg-neutral-50 rounded-lg p-3 flex-row justify-between `} onPress={() => navigation.navigate("QuoteAnswers", { allQue: q.answers, heading })}>
                                    <View>

                                        <View style={tw`flex-row gap-2`}>
                                            <Text style={tw`font-semibold`}>{heading}</Text>
                                            <Text style={tw`${q.status === "pending" ? "bg-yellow-100 text-yellow-500" : q.status === "rejected" ? "bg-red-100 text-red-500" : "bg-green-100 text-green-500"} text-xs capitalize rounded-full px-3 py-0.5`}>{q.status}</Text>

                                        </View>
                                        <Text style={tw`text-xs mt-3 text-neutral-500`}>Last Updated At :{q.updatedAt?.split("T")?.[0]}</Text>
                                    </View>
                                    <View style={tw``}>
                                        <Image source={images.arrowRight} tintColor={'#000'} style={tw`w-3 h-3  `} />
                                    </View>
                                </Pressable>
                            })
                        }

                    </View>) : (<View style={tw`flex-1 flex-col justify-center items-center `}>
                        <Text style={tw`text-neutral-500`}>No Quotes present.</Text>
                    </View>)}

            </ScrollView>

        </SafeAreaView>
    );
};

export default GetAllQuotesbyUser;
