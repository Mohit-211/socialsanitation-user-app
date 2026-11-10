import { StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import { tw } from '../utils/styling';
import AntDesign from 'react-native-vector-icons/AntDesign';

const PasswordTextInput = ({errors , onBlur , onChange , value , placeholder , secureTextEntry}) => {
  const [isSecure, setIsSecure] = useState(secureTextEntry);

  const toggleEye = () => {
    setIsSecure(!isSecure);
  };
  return (
    <>

    <TextInput
    placeholder={placeholder}
    secureTextEntry={isSecure}
    placeholderTextColor={'#929292'}
    style={tw`border-[1px] rounded-full  border-neutral-300 h-13 w-full mx-8 self-center py-2 px-4  text-neutral-600 ${
        errors?.password ? 'border-red-500' : 'border-neutral-300'
    } `}
    maxLength={20}
    onBlur={onBlur}
    onChangeText={onChange}
    value={value}
    />
    {
      secureTextEntry && (
       <AntDesign name={isSecure ? 'eye' : 'eyeo'} size={24} color="grey" onPress={toggleEye} style={tw`absolute right-3 bottom-3`}/>
      )
    }
    </>
  )
}

export default PasswordTextInput

const styles = StyleSheet.create({})
