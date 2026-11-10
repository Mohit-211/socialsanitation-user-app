import {
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
  } from "react-native";
  import React from "react";
  import LinearGradient from "react-native-linear-gradient";
  import images from "../../assets/images";
  import { useNavigation } from "@react-navigation/native";

  const { height, width } = Dimensions.get("window");

  const BookingReceived = () => {
    const navigation = useNavigation();
    return (
      <View style={styles.mainContainer}>
        <Image source={images.check} style={styles.checkIcon} />
        <Text style={styles.titleTxt}>Booking Received</Text>
        <Text style={styles.paraTxt}>
        We have received your booking request once we approve the appointment you 
        will get notified
        </Text>

        <View style={styles.buttonWrapper}>
          <LinearGradient
            style={styles.linerGradientContainer}
            colors={["rgba(36, 51, 82, 1)", "rgba(8, 246, 36, 1)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <TouchableOpacity
              onPress={() => navigation.navigate("Home")}
              style={styles.submitBtn}
              activeOpacity={0.9}
            >
              <Text style={[styles.submitBtnTxt, { color: "rgba(36,120, 36, 1)" }]}>Back to Home</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </View>
    );
  };

  export default BookingReceived;

  const styles = StyleSheet.create({
    mainContainer: {
      backgroundColor: "#ffff",
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingBottom: 20, 
    },
    titleTxt: {
      fontSize: width / 15,
      color: "#000",
      fontWeight: "700",
    },
    paraTxt: {
      fontSize: 12,
      color: "#000",
      fontWeight: "400",
      width: width / 2,
      textAlign: "center",
      marginTop: "3%",
    },
    checkIcon: {
      height: 70,
      width: 70,
      marginBottom: "5%",
    },
    buttonWrapper: {
      position: "absolute",
      bottom: height / 25, 
      width: width - 55,

    },
    linerGradientContainer: {
      height: height / 14,
      borderRadius: 50,
      justifyContent: "center",
      alignItems: "center",
    },
    submitBtn: {
      backgroundColor: "#fff",
      height: "93%",
      width: "99%",
      borderRadius: 50,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 2, 
      borderColor: "transparent", 
      paddingVertical: 6,
      padding: 30,
    },
    submitBtnTxt: {
      color: "#000",
      fontSize: width / 25,
    },

  });
