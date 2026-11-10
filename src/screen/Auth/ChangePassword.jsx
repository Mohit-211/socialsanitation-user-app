import { Image, SafeAreaView, ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { tw } from '../../utils/styling'
import { useNavigation } from '@react-navigation/native'
import { Controller, useForm } from 'react-hook-form'
import Toast from 'react-native-toast-message'
import axios from '../../api/axios'
import { base } from '../../api/Constants'
import LoadingScreen from '../../components/Loading'
import AsyncStorage from '@react-native-async-storage/async-storage'
import PasswordTextInput from '../../components/PasswordTextInput'
import LinearGradient from 'react-native-linear-gradient'
import Entypo from 'react-native-vector-icons/Entypo';

const ChangePassword = () => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const {
        control,
        handleSubmit,
        formState: { errors }
    } = useForm()

    const backgroundColor = "#ffffff"; 

    const handleChangePassword = async (data) => {
        setLoading(true)
        if (data.new_password !== data.confirm_password) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Password does not match',
                text2Style: { fontSize: 12 },
                text1Style: { fontSize: 14 }
            })
            setLoading(false)
            return;
        }
        console.log("🚀 ~ handleConfirmPassword ~ data:", data)
        try {
            let result = await axios.post(base.changePassword, data, {
                headers: {
                    'x-access-token': await AsyncStorage.getItem('token')
                }
            });

            if (result.data.status == 200) {
                setLoading(false)
                console.log("handleConfirmPassword api response", result.data)
                await AsyncStorage.setItem('token', result.data.data.tokens.access.token)
                Toast.show({ type: 'success', text1: result.data.message });
                navigation.goBack()
            } else {
                setLoading(false)
                Toast.show({ type: 'error', text1: result.data.message });
            }
        } catch (error) {
            setLoading(false)
            console.log("🚀 ~ handleConfirmPassword ~ error:", error)
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: error?.response?.data?.message,
                text2Style: { fontSize: 12 }
            })
        }
    }
    if (loading) {
        return <LoadingScreen />
    }

    return (
        <SafeAreaView style={[tw`flex-1`, { backgroundColor }]}>
            <StatusBar backgroundColor={backgroundColor} barStyle="dark-content" />

            {}
            <View style={[tw`h-[10%] flex-row px-1 gap-2`, { backgroundColor }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={tw`p-2 items-center justify-center my-auto bg-transparent`}>
                    <Entypo name="chevron-small-left" size={35} color="#000" />
                </TouchableOpacity>
                <Text style={tw`text-black my-auto text-xl font-medium ml-15`}>
                    Change Password
                </Text>
            </View>

            <View style={tw`gap-5 items-center my-1 self-center w-80 max-w-md`}>

                {}
                <View style={tw`w-full`}>
                    <Text style={tw`text-neutral-600 text-sm mb-1`}>Current Password</Text>
                    <Controller
                        control={control}
                        name="old_password"
                        rules={{ required: true }}
                        render={({ field }) => (
                            <PasswordTextInput
                                placeholder="Current Password"
                                secureTextEntry
                                errors={errors}
                                onBlur={field.onBlur}
                                onChange={field.onChange}
                                value={field.value}
                                style={tw`border border-gray-300 rounded-lg p-3 text-base`}
                            />
                        )}
                    />
                </View>

                {}
                <View style={tw`w-full`}>
                    <Text style={tw`text-neutral-600 text-sm mb-1`}>New Password</Text>
                    <Controller
                        control={control}
                        name="new_password"
                        rules={{ required: "Password is required" }}
                        render={({ field }) => (
                            <PasswordTextInput
                                placeholder="New Password"
                                secureTextEntry
                                errors={errors}
                                onBlur={field.onBlur}
                                onChange={field.onChange}
                                value={field.value}
                                style={tw`border border-gray-300 rounded-lg p-3 text-base`}
                            />
                        )}
                    />
                </View>

                {}
                <View style={tw`w-full`}>
                    <Text style={tw`text-neutral-600 text-sm mb-1`}>Confirm New Password</Text>
                    <Controller
                        control={control}
                        name="confirm_password"
                        rules={{ required: "Confirm Password is required" }}
                        render={({ field }) => (
                            <PasswordTextInput
                                placeholder="Confirm New Password"
                                secureTextEntry
                                errors={errors}
                                onBlur={field.onBlur}
                                onChange={field.onChange}
                                value={field.value}
                                style={tw`border border-gray-300 rounded-lg p-3 text-base`}
                            />
                        )}
                    />
                </View>

                {}
                <TouchableOpacity
                    onPress={handleSubmit(handleChangePassword)}
                    style={tw`w-full rounded-full`}>

                    <LinearGradient
                        colors={["#243352", "#08F624"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={tw`w-full py-3 items-center rounded-full`}>

                        <Text style={tw`text-white text-lg font-semibold`}>UPDATE PASSWORD</Text>

                    </LinearGradient>

                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default ChangePassword
