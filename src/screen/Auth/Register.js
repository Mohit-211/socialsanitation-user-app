import { ActivityIndicator, BackHandler, Dimensions, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import images from '../../assets/images'
import { tw } from '../../utils/styling'
import { useNavigation } from '@react-navigation/native'
import { Controller, useForm } from 'react-hook-form'
import Toast from 'react-native-toast-message'
import axios from '../../api/axios'
import { base } from '../../api/Constants'
import LoadingScreen from '../../components/Loading'
import PasswordTextInput from '../../components/PasswordTextInput'
import LinearGradient from 'react-native-linear-gradient'

const Register = () => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const {
        control,
        handleSubmit,
        formState: { errors }
    } = useForm()
    const handleRegister = async (data) => {
        setLoading(true)
        if (data.password !== data.confirm_password) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Password does not match',
                text2Style: {
                    fontSize: 12,

                },
                text1Style: {
                    fontSize: 14,
                }
            })
            setLoading(false)
            return;
        }

        console.log("🚀 ~ handleRegister ~ data:", data)
        try {
            let result = await axios.post(base.register, data);

            if (result.data.status == 201) {
                setLoading(false)
                console.log("signup api response", result.data)
                Toast.show({ type: 'success', text1: result.data.message });
                navigation.navigate('OTP', {
                    email: data.email,
                    type: "signup"
                });
            } else {
                setLoading(false)

                Toast.show({ type: 'error', text1: result.data.message });
            }
        } catch (error) {
            setLoading(false)
            console.log("🚀 ~ handleRegister ~ error:", error)
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

    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', () => {
            navigation.navigate('Login');
            return true;
        }
        );

    }, []);

    return (

        <ScrollView contentContainerStyle={{ alignItems: 'flex-start' }} style={tw`flex-1 bg-white  `}>
            <Image source={images.logofigma} style={tw`w-[155px] h-[92px] mt-[70px] ml-[20px]`}
            />
            <View style={tw`items-start`}>
                <View style={tw`items-start  gap-2 my-8 ml-[20px]`}>
                    <Text style={tw`text-2xl text-neutral-700 font-medium`}>
                        Sign Up
                    </Text>
                    <Text style={tw`text-lg text-neutral-600 `}>
                        Create your account
                    </Text>
                </View>
                <View style={[tw`gap-5  `, {
                    width: Dimensions.get('window').width,
                    alignItems: 'center'
                }]}>
                    <View style={tw`w-[90%] gap-2`}>
                        <Text style={tw`text-neutral-600 text-sm`}>
                            Name
                        </Text>
                        <Controller
                            control={control}
                            name='name'
                            rules={{
                                required: true
                            }}
                            render={({ field }) => (
                                <TextInput
                                    placeholder='Name'
                                    placeholderTextColor={'#929292'}
                                    style={tw`border-[1px] rounded-full  border-neutral-300 w-full py-2 px-4  text-neutral-600 `}
                                    value={field.value}
                                    onChangeText={field.onChange}

                                />
                            )}
                        />
                    </View>
                    <View style={tw`w-[90%] gap-2`}>
                        <Text style={tw`text-neutral-600 text-sm`}>
                            Email ID
                        </Text>
                        <Controller
                            control={control}
                            name='email'
                            rules={{
                                required: true,
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                                    message: "Invalid email address"
                                }
                            }}
                            render={({ field }) => (
                                <TextInput
                                    placeholder='Email ID'
                                    placeholderTextColor={'#929292'}
                                    style={tw`border-[1px] rounded-full  border-neutral-300 w-full py-2 px-4 
            ${errors.email ? 'border-red-500' : 'border-neutral-300'
                                        }
             text-neutral-600 `}
                                    value={field.value}
                                    onChangeText={field.onChange}
                                />
                            )}
                        />
                    </View>
                    <View style={tw`w-[90%] gap-2`}>
                        <Text style={tw`text-neutral-600 text-sm`}>
                            Mobile ( Optional )
                        </Text>
                        <Controller
                            control={control}
                            name='mobile'
                            rules={{
                                required: false,

                            }}
                            render={({ field }) => (
                                <TextInput
                                    maxLength={10}
                                    keyboardType='number-pad'
                                    placeholder='Mobile Number'
                                    placeholderTextColor={'#929292'}
                                    style={tw`border-[1px] rounded-full  border-neutral-300 w-full py-2 px-4 
            ${errors.mobile ? 'border-red-500' : 'border-neutral-300'
                                        }
             text-neutral-600 `}
                                    value={field.value}
                                    onChangeText={field.onChange}
                                />
                            )}
                        />
                    </View>
                    <View style={tw`w-[90%] gap-2  `}>
                        <Text style={tw`text-neutral-600 text-sm `}>
                            Password
                        </Text>
                        <Controller
                            control={control}
                            name='password'
                            rules={{
                                required: 'Password is required'
                            }}
                            render={({ field }) => (
                                <PasswordTextInput
                                    placeholder='Password'
                                    secureTextEntry={true}
                                    errors={errors}
                                    onBlur={field.onBlur}
                                    onChange={field.onChange}
                                    value={field.value}
                                />
                            )}
                        />

                    </View>
                    <View style={tw`w-[90%] gap-2 `}>
                        <Text style={tw`text-neutral-600 text-sm `}>
                            Confirm Password
                        </Text>
                        <Controller
                            control={control}
                            name='confirm_password'
                            rules={{
                                required: 'Confirm Password is required'
                            }}
                            render={({ field }) => (
                                <PasswordTextInput
                                    placeholder='Confirm Password'
                                    secureTextEntry={true}
                                    errors={errors}
                                    onBlur={field.onBlur}
                                    onChange={field.onChange}
                                    value={field.value}
                                />
                            )}
                        />
                    </View>

                    <TouchableOpacity
                        disabled={loading}
                        onPress={handleSubmit(handleRegister)}
                        style={[
                            tw`w-[90%] rounded-full overflow-hidden mb-4`,
                            loading && { opacity: 0.6 }, 
                        ]}
                    >
                        <LinearGradient
                            colors={["#243352", "#08F624"]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={tw`w-full py-4 items-center rounded-full`}
                        >
                            <View style={tw`flex-row items-center justify-center`}>
                                {loading ? (
                                    <ActivityIndicator color="white" size="small" />
                                ) : (
                                    <Text style={tw`text-white text-lg font-semibold`}>SIGN UP</Text>
                                )}
                            </View>
                        </LinearGradient>
                    </TouchableOpacity>

                </View>
                <View style={tw`w-full my-5 items-center`}>
                    <View style={tw`flex-row items-center gap-1 justify-center w-full`}>
                        <Text style={tw`text-neutral-600 text-center`}>
                            Already have an account?
                        </Text>
                        <Text
                            onPress={() => navigation.navigate("Login")}
                            style={tw`text-[#2391B1] underline font-bold`}>
                            LOGIN
                        </Text>
                    </View>
                </View>

            </View>
        </ScrollView>
    )
}

export default Register
