import {
    ActivityIndicator,
    Dimensions,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
  } from "react-native";
  import React, { useEffect, useState } from "react";
  import LinearGradient from "react-native-linear-gradient";
  import { useNavigation, useRoute } from "@react-navigation/native";

  import AsyncStorage from "@react-native-async-storage/async-storage";

  import axios from "../../api/axios";
import { base } from "../../api/Constants";
import images from "../../assets/images";
  const { height, width } = Dimensions.get("window");

  const CheckList = () => {
    const navigation = useNavigation(); 
    const route = useRoute();
    const { id } = route.params;

  console.log(id,'alert');

  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [checklist, setChecklist] = useState([]); 

    useEffect(() => {
          fetchAllServiceList();
      }, []);
    const fetchAllServiceList = async() => {

      try {
        const token = await AsyncStorage.getItem("token");
        console.log("TOKENNNNN", token);

        const response = await axios.get(`${base.getAllServiceCheckList}/${id}`, {

        });
        if (response?.status  === 200) {

                console.log("on fetching checklist:", response.data);
                setChecklist(response.data.data);
              } else {
                console.log("Unexpected response status on fetching checklist:", response.status);
              }
            } catch (error) {
              if (error.response) {
                console.error("API Error Response on fetching checklist:", error.response.data);
              } else if (error.request) {
                console.error("API Error: No response received on fetching checklist", error.request);
              } else {
                console.error("API Error: Request setup issue", error.message);
              }
            } finally {
              setLoading(false);
    }
    };

    return (
      <SafeAreaView style={styles.container}>
        {}
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerBackBtn} onPress={() => navigation.goBack()}>
            <Image source={images.back} style={styles.headerBackBtn} />
          </TouchableOpacity>
          <Text style={styles.titleTxt}>Checklist</Text>
        </View>

        {}
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {loading ? (
          <ActivityIndicator size="large" color="#432C1F" />
        ) : checklist.length > 0 ? (
          checklist.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.checklistItem}

            >
              <View style={styles.checkboxContainer}>
                {item.is_completed ? (
                  <>
                    <Image source={images.check} style={styles.checkboxImage} />
                  </>
                ) : (

                   <View style={{height:20,width:20,borderWidth:1,borderRadius:20}}>
                    </View>

                )}
              </View>
              <Text style={styles.itemText}>{item.task}</Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noDataText}>No checklist available</Text>
        )}
        </ScrollView>

      </SafeAreaView>
    );
  };

  export default CheckList;

  const styles = StyleSheet.create({
    container: {
      paddingHorizontal: "5%",
      backgroundColor: "#fff",
      flex: 1,
    },
    header: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      height: height / 13,
    },
    headerBackBtn: {
      height: height / 50,
      width: width / 20,
      position: "absolute",
      left: "3%",
    },
    titleTxt: {
      fontSize: width / 22,
      color: "#432C1F",
      fontWeight: "700",
      alignSelf: "center",
    },
    checklistItem: {
      flexDirection: "row",
      alignItems: "center",
      borderColor: "#ECECEC",
      borderWidth: 1,
      padding: 15,
      borderRadius: 30,
      marginTop: "5%",
      marginHorizontal:20
    },
    checkboxContainer: {
      height: 20,
      width: 20,
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
    },
    checkboxImage: {
      height: "100%",
      width: "100%",
      position: "absolute",
    },
    checkIcon: {
      height: "50%",
      width: "50%",
    },
    itemText: {
      fontSize: width / 25,
      fontWeight: "400",
      color: "#000",
      marginLeft: "3%",
    },
    noDataText: {
      textAlign: "center",
      marginTop: 20,
      fontSize: width / 25,
      color: "#888",
    },
    submitContainer: {
      position: "relative",
      bottom: 20,
    },
    submitButton: {
      borderRadius: 30,
      marginTop: "2%",
      padding: 15,
      alignItems: "center",
      marginHorizontal:20
    },
    submitText: {
      fontSize: width / 25,
      fontWeight: "700",
      color: "#fff",
    },
  });
