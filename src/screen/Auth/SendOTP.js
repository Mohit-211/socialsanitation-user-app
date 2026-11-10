import {  Image, ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import images from '../../assets/images'
import { tw } from '../../utils/styling'
import { useNavigation } from '@react-navigation/native'
import { Controller, useForm } from 'react-hook-form'
import Toast from 'react-native-toast-message'
import axios from '../../api/axios'
import { base } from '../../api/Constants'
import LoadingScreen from '../../components/Loading'
import AntDesign from 'react-native-vector-icons/AntDesign'

const SendOTP = () => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const {
        control,
        handleSubmit,
        formState : {errors}
    } = useForm()
    const handleSendOTP = async  (data) => {
        setLoading(true)
        if(!data.email){
            Toast.show({
                type : 'error',
                text1 : 'Error',
                text2 : 'Email is required',
                text2Style : {
                    fontSize : 12,

                },
                text1Style : {
                    fontSize : 14,
                }
            })
            setLoading(false)
            return;
        }
        data.type = 'forgot_password'
        console.log("🚀 ~ handleSendOTP ~ data:", data)
        try {
            let result = await axios.post(base.sendOTP, data);

            if (result.data.status==200) {
                setLoading(false)
              console.log("handleSendOTP api response",result.data)
              Toast.show({type: 'success', text1: result.data.message});
              navigation.navigate("OTP", {email : data.email , type : 'forgot_password'})
            } else {
                setLoading(false)

              Toast.show({type: 'error', text1: result.data.message});
            }
        } catch (error) {
            setLoading(false)
            console.log("🚀 ~ handleSendOTP ~ error:", error)
            Toast.show({
                type : 'error',
                text1 : 'Error',
                text2 : error?.response?.data?.message,
                text2Style : {
                    fontSize : 12,

                },
            })

        }

    }
    if(loading){
        return <LoadingScreen/>
    }

  return (
    <View style={tw`flex-1 `}>
    <StatusBar backgroundColor="#086FB1" barStyle="light-content" />
    {}

    <View style={tw`h-[10%] bg-[#086FB1] flex-row  px-4 gap-4   `}>
    <TouchableOpacity onPress={() => navigation.goBack()} style={tw`p-2    items-center justify-center  my-auto bg-transparent  `}>

  <AntDesign name="arrowleft" size={28} color="#fff" />

</TouchableOpacity>

<Text style={tw`text-white my-auto text-xl font-medium  `}>
 Send OTP To your Email
</Text>

</View>
<View style={tw`gap-5  items-center my-5 self-center `}>

    <View style={tw`w-90 gap-2 `}>
        <Text style={tw`text-neutral-600 text-sm`}>
             Email
        </Text>
        <Controller
        control={control}
        name='email'
        rules={{
            required : 'Email is required',
            pattern : {
                value : /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                message : 'Invalid email address'
            }
        }}
        render={({field}) => (
            <TextInput
            placeholder=' Enter your email'

            placeholderTextColor={'#333333'}
            style={tw`border-[1px] rounded-lg  border-neutral-300 w-full py-2 px-4  text-neutral-600 ${
                errors.email ? 'border-red-500' : 'border-neutral-300'
            } `}
           value={field.value}
              onChangeText={field.onChange}
            />
        )}
        />

            </View>

            <TouchableOpacity onPress={handleSubmit(handleSendOTP)} style={tw`w-90 bg-[#086FB1] rounded-full  py-3 items-center`}>
<Text style={tw`text-white text-lg  `}>
    Send
</Text>
            </TouchableOpacity>

     </View>

</View>

  )
}

export default SendOTP
