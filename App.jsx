import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import { MyTabs } from './src/navigation/Routes';
import Login from './src/screen/Auth/Login';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';
import Register from './src/screen/Auth/Register';
import Splash from './src/screen/splash/Splash';
import ServiceDetails from './src/screen/Home/ServiceDetails';
import BookService from './src/screen/Home/BookService';
import BookingDetails from './src/screen/MyBookings/BookingDetails';
import MyProfile from './src/screen/Profile/MyProfile';
import EditProfile from './src/screen/Profile/EditProfile';
import Settings from './src/screen/Profile/Settings';
import TAndC from './src/screen/TermsAndConditions/TAndC';
import OTP from './src/screen/Auth/OTP';
import { QueryClientProvider , QueryClient } from '@tanstack/react-query';
import ChangePassword from './src/screen/Auth/ChangePassword';
import ForgotPassword from './src/screen/Auth/ForgotPassword';
import SendOTP from './src/screen/Auth/SendOTP';
import Help from './src/screen/Help/Help';
import Address from './src/screen/Profile/Address';
import NotificationService from './src/utils/NotificationService';
import Profile from './src/screen/Profile/Profile';
import Calendar from './src/screen/Profile/Calendar';
import PrivacyPolicy from './src/screen/Profile/PrivacyPolicy';
import Language from './src/screen/Profile/Language';
import Support from './src/screen/Chat/Support';
import Notification from './src/screen/Home/Notification';
import BookingReceived from './src/screen/BookingReceived/BookingReceived';
import AddNewAddress from './src/screen/Profile/AddNewAddress';
import CheckList from './src/screen/CheckList/CheckList';
import GetQuote from './src/screen/Home/GetQuote';
import GetAllQuotesbyUser from './src/screen/Profile/GetAllQuotesbyUser';
import QuoteAnswers from './src/screen/Profile/QuoteAnswers';

const Stack = createNativeStackNavigator()

const App = () => {

  const client  = new QueryClient();
  return (
<QueryClientProvider client={client}>
  <NavigationContainer>
<NotificationService/>

<Stack.Navigator initialRouteName='Welcome'>
<Stack.Screen name='Tabs' options={{headerShown : false} }>{(props) => <MyTabs {...props}/>}</Stack.Screen>
   <Stack.Screen name='Login' options={{headerShown : false}} >{(props) => <Login/>}</Stack.Screen>
      <Stack.Screen name='Signup' options={{headerShown : false}}>{props => <Register/>}</Stack.Screen>
      <Stack.Screen name='Welcome' options={{headerShown : false}} >{props => <Splash/>}</Stack.Screen>
      <Stack.Screen name='OTP' options={{headerShown : false}} >{props => <OTP/>}</Stack.Screen>
      <Stack.Screen name='ServiceDetails' options={{headerShown : false}}>
        {props => <ServiceDetails/>}
      </Stack.Screen>
      <Stack.Screen name='GetQuote' options={{headerShown : false}}>
        {props => <GetQuote/>}
      </Stack.Screen>
      <Stack.Screen name='BookService' options={{headerShown : false}}>
        {props => <BookService/>}
      </Stack.Screen>
      <Stack.Screen name='BookingDetails' options={{headerShown : false}}>
        {props => <BookingDetails/>}
      </Stack.Screen>
      <Stack.Screen name='MyProfile' options={{headerShown : false}}>
        {props => <MyProfile/>}
      </Stack.Screen>
      <Stack.Screen name='EditProfile' options={{headerShown : false}}>
           {props => <EditProfile/>}
        </Stack.Screen>
      <Stack.Screen name='GetAllQuotesbyUser' options={{headerShown : false}}>
        {props => <GetAllQuotesbyUser/>}
      </Stack.Screen>
      <Stack.Screen name='Settings' options={{headerShown : false}}>
        {props => <Settings/>}
      </Stack.Screen>
      <Stack.Screen name='TermsConditions' options={{headerShown : false}}>
        {props => <TAndC/>}
        </Stack.Screen>
      <Stack.Screen name='ChangePassword' options={{headerShown : false}}>
        {props => <ChangePassword/>}
      </Stack.Screen>
      <Stack.Screen name='ForgotPassword' options={{headerShown : false}}>
        {props => <ForgotPassword/>}
      </Stack.Screen>
      <Stack.Screen name='SendOTP' options={{headerShown : false}}>
        {props => <SendOTP/>}
      </Stack.Screen>
      <Stack.Screen name='Help' options={{headerShown : false}}>
        {props => <Help/>}
      </Stack.Screen>
      <Stack.Screen name='Address' options={{headerShown : false}}>
        {props => <Address/>}
      </Stack.Screen>
      <Stack.Screen name='Profile' options={{headerShown : false}}>
        {props => <Profile/>}
      </Stack.Screen>
      <Stack.Screen name='Calendar' options={{headerShown : false}}>
        {props => <Calendar/>}
      </Stack.Screen>
      <Stack.Screen name='PrivacyPolicy' options={{headerShown : false}}>
        {props => <PrivacyPolicy/>}
      </Stack.Screen>
      <Stack.Screen name='Language' options={{headerShown : false}}>
        {props => <Language/>}
      </Stack.Screen>
      <Stack.Screen name='support' options={{headerShown : false}}>
        {props => <Support/>}
      </Stack.Screen>
      <Stack.Screen name='notification' options={{headerShown : false}}>
        {props => <Notification/>}
      </Stack.Screen>
      <Stack.Screen name='bookingReceived' options={{headerShown : false}}>
        {props => <BookingReceived/>}
      </Stack.Screen>
      <Stack.Screen name='AddNewAddress' options={{headerShown : false}}>
        {props => <AddNewAddress/>}
      </Stack.Screen>
      <Stack.Screen name='CheckList' options={{headerShown : false}}>
        {props => <CheckList/>}
      </Stack.Screen>
      <Stack.Screen name='QuoteAnswers' options={{headerShown : false}}>
        {props => <QuoteAnswers/>}
      </Stack.Screen>

</Stack.Navigator>
<Toast/>
  </NavigationContainer>

</QueryClientProvider>
  );
};

export default App;
