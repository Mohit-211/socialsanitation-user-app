import { View, Text, Image, TouchableOpacity, Platform, StyleSheet, BackHandler } from 'react-native'
import React, { useEffect, useState } from 'react'
import { tw } from '../../utils/styling'
import images from '../../assets/images'
import AntDesign from 'react-native-vector-icons/AntDesign';
import {
    CodeField,
    Cursor,
    useBlurOnFulfill,
    useClearByFocusCell,
  } from 'react-native-confirmation-code-field';
import { useNavigation, useRoute } from '@react-navigation/native';
import { base } from '../../api/Constants';
import axios from '../../api/axios';
import Toast from 'react-native-toast-message';
import LoadingScreen from '../../components/Loading';

const OTP = () => {
const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
    const CELL_COUNT = 4;
    const { email, type } = useRoute().params

    console.log("🚀 ~ OTP ~ email and type:", email , type)

    const [value, setValue] = useState('');
    const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
      value,
      setValue,
    });

    const otp_verification = async () => {
      setLoading(true)
     try {
       if (value == "") {
         Toast.show({ type: "error", text1: "Please enter OTP" });

       }
       else {

         let body = {

           email: email,
           otp: value,
           type: type == "signup" ? "email_varification" : "forgot_password"

         };
         console.log(body, '-body');

         let result = await axios.post(base.verifyOTP, body);
         console.log(result.data)
         if (result.data.status==200) {
            setLoading(false)
           console.log("signup api response",)
           ;
           Toast.show({ type: 'success', text1: result.data.message });
           type == "signup" ?
             navigation.navigate("Login") :
             navigation.navigate('ForgotPassword', {
               email: email,
               token: result?.data?.data?.token
             });
         } else {
            setLoading(false)
           console.log("signup api error",)
           Toast.show({ type: 'error', text1: result.data.message });
         }
       }
     } catch (error) {
        setLoading(false)
      console.log("🚀 ~ constotp_verification= ~ error:", error.response.data.message)
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error?.response?.data?.message,
        text2Style: {
          fontSize: 12,

        },
      })
     }
    }

    const resendOTP = async () => {
      try {
        setLoading(true)
        const res = await axios.post(base.sendOTP, {email , type : type == "signup" ? "email_varification" : "forgot_password"})
        console.log(res.data);
        setLoading(false)
        Toast.show({ type: 'success', text1: res.data.message });
      } catch (error) {
        setLoading(false)
        console.log("🚀 ~ resendOTP ~ error:", error)
        Toast.show({ type: 'error', text1: error?.response?.data?.message });
      }
    }

    const _goBack = () => {
      type=="forgot"?
      navigation.navigate('ForgotPassword'):
      navigation.navigate("Signup")
    };

    useEffect(() => {

      const backAction = () => {
        _goBack();

        return true;
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );

      return () => backHandler.remove();
    }, [props]);

    if(loading){
      return <LoadingScreen/>
    }

  return (
    <View style={tw`flex-1 bg-[#FFFFFF] `}>
    <View style={tw`px-4  ${Platform.OS == 'android' && 'pt-4'} items-start  `}>
    <TouchableOpacity onPress={() => navigation.goBack()} style={tw`p-2    items-center justify-center  my-auto bg-transparent  `}>

  <AntDesign name="arrowleft" size={28} color="#000" />

</TouchableOpacity>
    </View>
    <View style={tw`items-center my-8 `}>
        <Text
        style={tw`text-2xl font-medium text-neutral-700 text-center  `}

        >
            OTP Verification
        </Text>
        <Text
        style={tw` text-neutral-600 text-center mt-2  w-[80%]`}
        >
        Please enter OTP sent to your given email ID <Text style={tw`font-semibold`}>{email}</Text>
        </Text>
        {console.log(value)}
    </View>
      <View style={tw`w-[80%] self-center  `}>
      <CodeField
        ref={ref}

        {...props}

        value={value}
        onChangeText={setValue}
        cellCount={CELL_COUNT}

        rootStyle={styles.codeFieldRoot}
        keyboardType="number-pad"

        textContentType="oneTimeCode"
        autoComplete={Platform.select({ android: 'sms-otp', default: 'one-time-code' })}
       RootProps={{
        shouldRasterizeIOS: true,

       }}
        renderCell={({index, symbol, isFocused}) => (
          <Text
            key={index}
            style={[styles.cell, isFocused && styles.focusCell, tw`bg-sky-100  justify-center  items-center`]}
            onLayout={getCellOnLayoutHandler(index)}>
            {symbol || (isFocused ? <Cursor/> : null)}

          </Text>
        )}
      />

          <View style={tw`my-12 gap-6  `}>
            <TouchableOpacity onPress={otp_verification} style={tw`bg-[#086FB1]  py-3 rounded-full `}>
                <Text style={tw`text-lg text-center  text-white `}>
                    Verify OTP
                </Text>
            </TouchableOpacity>
            <Text onPress={resendOTP}
            style={tw`text-center text-[#086FBA] underline text-lg font-medium `}
            >
                Resend OTP
            </Text>
          </View> 
      </View>
    </View>
  )
}

export default OTP

const styles = StyleSheet.create({
    root: {flex: 1, padding: 20},
    title: {textAlign: 'center', fontSize: 30},
    codeFieldRoot: {marginTop: 20 , height : 80},
    cell: {
        padding : 20,
      width: 70,
      lineHeight: 38,
      justifyContent: 'center',

      fontSize: 24,
      borderWidth: 2,
      borderRadius: 8,
      borderColor: '#00000030',
      textAlign: 'center',
      color : '#000000',

    },
    focusCell: {
      borderColor: '#000',
    },
  });
