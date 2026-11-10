import React, { useEffect } from 'react';
import { View, Image, StyleSheet, Dimensions, StatusBar, PermissionsAndroid, ImageBackground } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import images from '../../assets/images';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { check, PERMISSIONS, RESULTS, request } from 'react-native-permissions';
import { base } from '../../api/Constants';

const Splash = () => {
  const navigation = useNavigation();

  useFocusEffect(() => {

    const timer = setTimeout(() => {
      AsyncStorage.getItem('token').then((token) => {
        console.log(token,"-=-=-=-=token splash");

        if (token) {
          navigation.replace('Tabs');
        } else {
          navigation.replace('Login');
        }
      }
      );
    }, 2000);

    return () => clearTimeout(timer);
  });

  async function requestLocationPermission() {
    try {
      const result = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);

      if (result === RESULTS.GRANTED) {
        console.log("You can use the location");

      } else if (result === RESULTS.DENIED) {
        const requestResult = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);

        if (requestResult === RESULTS.GRANTED) {
          console.log("You can use the location");

        } else {
          console.log("location permission denied");

        }
      } else if (result === RESULTS.BLOCKED) {
        console.log("location permission denied");

      }
    } catch (err) {
      console.warn(err);
    }
  }

  return (
    <View style={styles.container}>

      <StatusBar
        backgroundColor="white"
        barStyle="dark-content"
      />
   <Image
        source={images.SplashLogo}
        style={{
            alignSelf : 'center',     
          zIndex : 5,
          position : 'absolute',
          top : '10%',
          opacity : 1

        }}
   />
   <LinearGradient

          colors={[
            "rgba(256, 256, 256, 1)",
            "rgba(256, 256, 256, 0.8)",
            "rgba(256, 256, 256, 0.4)",
          ]}
        style={styles.linearGradient}
   >

      </LinearGradient>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    resizeMode : 'cover'

  },
  linearGradient: {
    flex: 1,

  },
});

export default Splash;
