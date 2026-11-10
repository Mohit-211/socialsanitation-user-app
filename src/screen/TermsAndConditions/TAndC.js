import { View, Text, StatusBar, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import React, { useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { tw } from '../../utils/styling';
import { useQuery } from '@tanstack/react-query';
import axios from '../../api/axios';
import { base } from '../../api/Constants';
import LoadingScreen from '../../components/Loading';
import Entypo from 'react-native-vector-icons/Entypo';
import RenderHTML from 'react-native-render-html';

const TAndC = () => {
  const navigation = useNavigation();
  const [heading, setHeading] = useState('');
  const [content, setContent] = useState('');
  const backgroundColor = "white";

  const { data, isLoading, error } = useQuery({
    queryKey: ['termsAndConditions'],
    queryFn: async () => {
      const response = await axios.get(base.termsAndConditions);
      return response.data;
    },
    staleTime: 300000, 
  });

  useFocusEffect(
    React.useCallback(() => {
      if (data?.data) {
        setHeading(data.data.heading || 'Terms & Conditions');
        setContent(data.data.description || '');
      }
    }, [data])
  );

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaView style={tw`flex-1 bg-[${backgroundColor}]`}>
      <StatusBar backgroundColor={backgroundColor} barStyle="dark-content" />

      {}
      <View style={tw`h-[10%] flex-row items-center px-1 justify-between`}>
        {}
        <TouchableOpacity onPress={() => navigation.goBack()} style={tw`p-2`}>
          <Entypo name="chevron-small-left" size={35} color="#000" />
        </TouchableOpacity>

        {}
        <Text style={tw`text-black text-xl font-medium capitalize flex-1 text-center pr-10`}>
          {heading}
        </Text>
      </View>

      {}
      <ScrollView style={tw`flex-1 px-4`}>
        {content ? (
          <RenderHTML contentWidth={300} source={{ html: content }} baseStyle={tw`text-neutral-600`} />
        ) : (
          <View style={tw`flex-1 items-center justify-center mt-70`}>

          <Text style={tw`text-neutral-600  px-4`}>No content available</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default TAndC;
