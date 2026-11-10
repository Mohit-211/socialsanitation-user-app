import { Text, View, StatusBar, TouchableOpacity, ScrollView, SafeAreaView } from "react-native";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { tw } from "../../utils/styling"; 
import RenderHTML from "react-native-render-html";
import Entypo from "react-native-vector-icons/Entypo";
import WebView from "react-native-webview";

function PrivacyPolicy() {
  const navigation = useNavigation();
  const [heading, setHeading] = useState("Privacy Policy");
  const [content, setContent] = useState(""); 
  const backgroundColor = "white";

  return (
    <SafeAreaView style={tw`flex-1 bg-[${backgroundColor}]`}>
      <StatusBar backgroundColor={backgroundColor} barStyle="dark-content" />

      {}
      <View style={tw`h-[10%] flex-row items-center px-1 justify-between`}>
        {}
        <TouchableOpacity onPress={() => navigation.goBack()} style={tw`p-0`}>
          <Entypo name="chevron-small-left" size={35} color="#000" />
        </TouchableOpacity>

        {}
        <Text style={tw`text-black text-xl font-medium flex-1 text-center pr-10`}>
          {heading}
        </Text>
      </View>

      {}
      {}
      <WebView
        source={{ uri: 'https://app.socialsanitation.com/privacy-policy' }}
        startInLoadingState={true}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        style={{marginHorizontal:4}}
      />
        {

}
      {}
    </SafeAreaView>
  );
}

export default PrivacyPolicy;
