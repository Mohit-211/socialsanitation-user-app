import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Image, Platform, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import Home from '../screen/Home';
import MyBookings from '../screen/MyBookings';
import Profile from '../screen/Profile/Profile';
import images from '../assets/images';
import Login from '../screen/Auth/Login';
import Register from '../screen/Auth/Register';
import Splash from '../screen/splash/Splash';
import ServiceDetails from '../screen/Home/ServiceDetails';
import OTP from '../screen/Auth/OTP';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Support from '../screen/Chat/Support';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { base } from '../api/Constants';
import ChatInbox from '../screen/Chat/ChatInbox';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export const Navigator = () => {
  return (
    <Stack.Navigator initialRouteName='Splash'>
      <Stack.Screen name='Tabs' options={{ headerShown: false }}>{(props) => <MyTabs {...props} />}</Stack.Screen>
      <Stack.Screen name='Login' options={{ headerShown: false }} component={<Login />} />
      <Stack.Screen name='OTP' options={{ headerShown: false }}>
        {(props) => <OTP {...props} />}
      </Stack.Screen>
      <Stack.Screen name='Register' options={{ headerShown: false }} component={<Register />} />
      <Stack.Screen name='Splash' options={{ headerShown: false }} component={<Splash />} />

    </Stack.Navigator>

  )
}

export function MyTabs() {
  const [lastMessage, setLastMessage] = useState({})

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: Platform.OS === "ios" ? 100 : 80,
          width: "100%",
          alignSelf: "center",
        },
        tabBarItemStyle: {
          paddingVertical: Platform.OS === "android" ? 10 : 0,
        },
        tabBarActiveTintColor: "086FB1",
        tabBarActiveTintColor: "black",
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: "bold",
        },
      }}
    >
      <Tab.Screen
        options={{
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Image
                source={images.homeG}
                style={{
                  width: 24,
                  height: 24,

                }}
                resizeMode="contain"
              />
            ) : (
              <Image
              source={images.home}
              style={{
                width: 24,
                height: 24,

              }}
              resizeMode="contain"
            />
            ),
        }}
        name="Home"
        component={Home}
      />

      <Tab.Screen
        options={{
          tabBarIcon: ({ focused }) => focused ? (
            <Image
              source={images.bookingFade}
              style={{
                width: 24,
                height: 24,

              }}
              resizeMode="contain"
            />):(
              <Image
              source={images.bookings}
              style={{
                width: 24,
                height: 24,

              }}
              resizeMode="contain"
            />
            ),
        }}
        name="My Bookings"
        component={MyBookings}
      />
      <Tab.Screen
        options={{
          tabBarIcon: ({ focused }) => focused ? (
            <View>
              {lastMessage &&
                lastMessage?.source === "RECEIVER" &&
                lastMessage?.read === false && (
                  <View
                    style={{
                      position: "absolute",
                      backgroundColor: "#F29F05",
                      borderRadius: 50,
                      width: 10,
                      height: 10,
                      right: 0,
                      top: 0,
                      zIndex: 999,
                    }}
                  />
                )}
              <Image
                source={images.chatG}
                style={{
                  width: 24,
                  height: 24,

                }}
                resizeMode="contain"
              />
            </View>
          ):(
            <Image
            source={images.chat}
            style={{
              width: 24,
              height: 24,

            }}
            resizeMode="contain"
          />
          ),
        }}
        name="Chat"
        component={ChatInbox}

      />
      <Tab.Screen
        options={{
          tabBarIcon: ({ focused }) => focused ? (
            <Image
              source={images.userG}
              style={{
                width: 24,
                height: 24,

              }}
              resizeMode="contain"
            />) : (
              <Image
                source={images.profile}
                style={{
                  width: 24,
                  height: 24,

                }}
                resizeMode="contain"
              />),
        }}
        name="Profile"
        component={Profile}
      />
    </Tab.Navigator>
  );
}
