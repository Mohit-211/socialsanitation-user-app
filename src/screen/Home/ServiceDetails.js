import { View, Text, Image, TouchableOpacity, StatusBar, ScrollView, SafeAreaView, Platform } from 'react-native'
import React from 'react'
import images from '../../assets/images'
import { tw } from '../../utils/styling'
import { useNavigation, useRoute } from '@react-navigation/native'
import Feather from 'react-native-vector-icons/Feather'
import { imgURL } from '../../api/Constants'
import RenderHTML from 'react-native-render-html'
import LinearGradient from "react-native-linear-gradient";
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const ServiceDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const item = route?.params?.item || {};
  console.log("######@", item)

  return (
    <SafeAreaView style={tw`flex-1`}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, alignItems: 'center' }}
        style={tw`bg-white ${item?.service_attachments?.length === 0 ? "pt-6" : ""}`}
      >
        {}
        <View style={{ position: 'relative', width: '100%', alignItems: 'center' }}>
          {item?.service_attachments?.length > 0 ? (
            <Image
              style={{ height: 300, width: '100%', resizeMode: 'cover' }}
              source={{ uri: imgURL + item?.service_attachments[0]?.file_name }}
            />
          ) : (
            <Image
              style={{ height: 300, width: '100%', resizeMode: 'cover' }}
              source={images.SplashLogo}
            />
          )}

          {}
          <View style={{ position: 'absolute', top: Platform.OS == 'android' ? 66 : 30, left: 10, width: '100%', flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ width: 40, height: 40, justifyContent: 'center', alignItems: 'center' }}
            >
            <Image
              style={{ height: 20, width:30,tintColor:'#fff' }}
              source={images.back}
            />
            </TouchableOpacity>

            <Text style={{ color: '#00000090', fontSize: 20, fontWeight: 'bold', marginLeft: 80 }}>
              Service Details
            </Text>
          </View>
        </View>

        {}
        <View style={tw`w-[90%] `}>
          <Text style={tw`text-2xl text-neutral-700 self-start font-medium mt-2`}>
            {item?.name}
          </Text>
          {

}
          <View>
          <RenderHTML 
           contentWidth={300}
             source={{ html: item?.description || "" }} baseStyle={[tw`text-neutral-600`]} />
          </View>
          {}
          <View style={tw`self-start mt-1 mb-0`}>
            <Text style={tw`text-neutral-700 font-medium text-xl`}>
              Photo Gallery
            </Text>
            <View style={tw`flex-row flex-wrap gap-4`}>
              {item?.service_attachments?.map((i, index) => (
                <Image
                  key={index}
                  style={{ height: 120, width: '100%', borderRadius: 8, marginVertical: 8 }}
                  source={{ uri: imgURL + i.file_name }}

                />
              ))}
            </View>
          </View>
          <View style={tw`self-start mt-1 mb-4`}>
            <Text style={tw`text-neutral-700 font-medium text-xl`}>
              Reviews
            </Text>

            {item?.reviews && item?.reviews.length > 0 ? (
              item.reviews.map((review, index) => (
                <View key={index} style={tw`mt-4`}>
                  <Text style={tw`text-neutral-900 font-semibold text-lg`}>
                    {review.user_name || "Anonymous"}
                  </Text>
                  <View style={tw`flex-row mt-1`}>
                    {[...Array(review.rating > 0 ? Math.round(review.rating) : 5)].map((_, i) => (
                      <FontAwesome key={i} name="star" size={20} color="gold" />
                    ))}
                  </View>
                  <Text style={tw`text-neutral-700 mt-2`}>
                    {review.comment || "No review text available"}
                  </Text>
                </View>
              ))
            ) : (
              <View style={tw`mt-4`}>
                <Text style={tw`text-neutral-700 italic`}>No reviews available</Text>
              </View>
            )}
          </View>
          {}
          <TouchableOpacity
            onPress={() => navigation.navigate("BookService", { item })}
            style={tw`w-full rounded-full overflow-hidden mb-4`}
          >
            <LinearGradient
              colors={["#243352", "#08F624"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={tw`w-full py-3 items-center rounded-full`}
            >
              <Text style={tw`text-white font-medium text-xl`}>Book Service</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("GetQuote", { item })}
            style={tw`w-full rounded-full overflow-hidden mb-8`}
          >
            <LinearGradient
              colors={["#243352", "#08F624"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={tw`w-full py-3 items-center rounded-full`}
            >
              <Text style={tw`text-white font-medium text-xl`}>Get A Quote</Text>
            </LinearGradient>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default ServiceDetails;
