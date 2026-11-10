import { ActivityIndicator, Dimensions, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import images from '../../assets/images'
import { tw } from '../../utils/styling'
import { useNavigation, useRoute } from '@react-navigation/native'
import { Controller, useForm } from 'react-hook-form'
import Toast from 'react-native-toast-message'
import axios from '../../api/axios'
import { base } from '../../api/Constants'
import PasswordTextInput from '../../components/PasswordTextInput'
import LinearGradient from 'react-native-linear-gradient'

const ForgotPassword = () => {
    const navigation = useNavigation();
    const { email, token } = useRoute().params || {}
    const [loading, setLoading] = useState(false);
    const {
        control,
        handleSubmit,
        formState: { errors }
    } = useForm()

    const handleForgotPassword = async (data) => {
        setLoading(true)
        if (!data.password || !data.confirm_password) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Please fill all the fields',
            })
            setLoading(false)
            return;
        }

        if (data.password !== data.confirm_password) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Password does not match',
            })
            setLoading(false)
            return;
        }

        if (!email || !token) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Invalid password reset session. Please request OTP again.',
            })
            setLoading(false)
            navigation.navigate('SendOTP')
            return;
        }

        data.token = token;
        data.email = email;
        try {
            let result = await axios.post(base.forgotPassword, data);

            if (result.data.status == 200) {
                setLoading(false)
                Toast.show({ type: 'success', text1: result.data.message });
                navigation.navigate("Login")
            } else {
                setLoading(false)

                Toast.show({ type: 'error', text1: result.data.message });
            }
        } catch (error) {
            setLoading(false)
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: error?.response?.data?.message,
            })

        }

    }

    return (
        <ScrollView contentContainerStyle={{ alignItems: 'flex-start' }} style={tw`flex-1 bg-white`}>
            <Image source={images.logofigma} style={tw`w-[155px] h-[92px] mt-[70px] ml-[20px]`} />
            <View style={tw`items-center`}>
                <View style={tw`self-start gap-2 my-12 pl-8`}>
                    <Text style={tw`text-2xl text-neutral-700 font-medium`}>
                        Create New Password
                    </Text>
                    <Text style={tw`text-lg text-neutral-600`}>
                        Set a new password for your account
                    </Text>
                </View>

                <View
                    style={[
                        tw`gap-5`,
                        {
                            width: Dimensions.get('window').width,
                            alignItems: 'center',
                        },
                    ]}
                >
                    <View style={tw`w-[90%] gap-2`}>
                        <Text style={tw`text-neutral-600 text-sm`}>
                            Password
                        </Text>
                        <Controller
                            control={control}
                            name='password'
                            rules={{
                                required: 'Password is required',
                            }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <PasswordTextInput
                                    placeholder='Password'
                                    secureTextEntry={true}
                                    errors={errors}
                                    onBlur={onBlur}
                                    onChange={onChange}
                                    value={value}
                                    style={tw`border-[1px] rounded-full border-neutral-300 w-full mx-8 self-center py-2 px-4 ${errors.password ? 'border-red-500' : 'border-neutral-300'
                                        } text-neutral-600`}
                                />
                            )}
                        />
                    </View>

                    <View style={tw`w-[90%] gap-2`}>
                        <Text style={tw`text-neutral-600 text-sm`}>
                            Confirm Password
                        </Text>
                        <Controller
                            control={control}
                            name='confirm_password'
                            rules={{
                                required: 'Confirm Password is required',
                            }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <PasswordTextInput
                                    placeholder='Confirm Password'
                                    secureTextEntry={true}
                                    errors={errors}
                                    onBlur={onBlur}
                                    onChange={onChange}
                                    value={value}
                                    style={tw`border-[1px] rounded-full border-neutral-300 w-full mx-8 self-center py-2 px-4 ${errors.confirm_password ? 'border-red-500' : 'border-neutral-300'
                                        } text-neutral-600`}
                                />
                            )}
                        />
                    </View>

                    <TouchableOpacity
                        disabled={loading}
                        onPress={handleSubmit(handleForgotPassword)}
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
                                    <Text style={tw`text-white text-lg font-semibold`}>Submit</Text>
                                )}
                            </View>
                        </LinearGradient>
                    </TouchableOpacity>

                    <Text
                        onPress={() => navigation.goBack()}
                        style={tw`text-neutral-600 text-center`}
                    >
                        Back to previous screen
                    </Text>
                </View>
            </View>
        </ScrollView>
    )
}

export default ForgotPassword
