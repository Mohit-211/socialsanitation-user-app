import { StatusBar, StyleSheet, Text, View, SafeAreaView, TouchableOpacity,ScrollView } from 'react-native'
import React from 'react'
import { tw } from '../../utils/styling'
import Entypo from 'react-native-vector-icons/Entypo';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function QuoteAnswers() {
    const navigation = useNavigation();
     const { allQue,heading } = useRoute().params;
    const backgroundColor = "white";

    return (
        <SafeAreaView style={[tw`flex-1`, { backgroundColor }]}>
            <StatusBar backgroundColor={backgroundColor} barStyle="dark-content" />

            {}
            <View style={tw`h-[10%] flex-row px-2 gap-14`}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={tw`p-2 items-center justify-center my-auto`}>
                    <Entypo name="chevron-small-left" size={35} color="#000" />
                </TouchableOpacity>
                <Text style={tw`text-black my-auto text-xl font-medium`}>
                 {heading}
                </Text>
            </View>
            <ScrollView style={tw`flex-1`}>
                <View style={tw`flex-1 justify-center gap-3 px-4 mt-2`}>
                    {
                        allQue?.length > 0 && allQue.map(q=>{

                            return <View key={q.id} style={tw`gap-2 flex-1 bg-neutral-50 p-3`}>
                                <Text style={tw`font-semibold`}>Que: {q.question.question}</Text>
                                <View style={tw`border-t border-neutral-200`}/>
                                <Text>ans: {q.answer}</Text>

                            </View>
                        })
                    }
                </View>
            </ScrollView>

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({})
