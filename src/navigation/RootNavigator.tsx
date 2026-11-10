import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoadingScreen from '../components/LoadingScreen';
import { useSession } from '../session/SessionProvider';
import TabNavigator from './TabNavigator';
import type { RootStackParamList } from './types';
import SignInScreen from '../screens/auth/SignInScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';
import VerifyCodeScreen from '../screens/auth/VerifyCodeScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import ResetPasswordScreen from '../screens/auth/ResetPasswordScreen';
import NotificationsScreen from '../screens/home/NotificationsScreen';
import ServiceDetailScreen from '../screens/home/ServiceDetailScreen';
import EnquiryFormScreen from '../screens/enquiries/EnquiryFormScreen';
import EnquiriesScreen from '../screens/enquiries/EnquiriesScreen';
import VisitDetailScreen from '../screens/visits/VisitDetailScreen';
import CancelVisitScreen from '../screens/visits/CancelVisitScreen';
import DocumentDetailScreen from '../screens/documents/DocumentDetailScreen';
import SignDocumentScreen from '../screens/documents/SignDocumentScreen';
import AddressesScreen from '../screens/account/AddressesScreen';
import AddressFormScreen from '../screens/account/AddressFormScreen';
import AccountRequestsScreen from '../screens/account/AccountRequestsScreen';
import AccountRequestFormScreen from '../screens/account/AccountRequestFormScreen';
import ChangePasswordScreen from '../screens/account/ChangePasswordScreen';
import HelpScreen from '../screens/account/HelpScreen';
import ContentScreen from '../screens/account/ContentScreen';
import PrivacyPolicyScreen from '../screens/account/PrivacyPolicyScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

/** Signed-in and signed-out screens are separate sets; the session decides which one exists. */
export default function RootNavigator() {
  const { status } = useSession();
  if (status === 'loading') {
    return <LoadingScreen />;
  }
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {status === 'signedIn' ? (
        <Stack.Group>
          <Stack.Screen name="Tabs" component={TabNavigator} />
          <Stack.Screen name="Notifications" component={NotificationsScreen} />
          <Stack.Screen name="ServiceDetail" component={ServiceDetailScreen} />
          <Stack.Screen name="EnquiryForm" component={EnquiryFormScreen} />
          <Stack.Screen name="Enquiries" component={EnquiriesScreen} />
          <Stack.Screen name="VisitDetail" component={VisitDetailScreen} />
          <Stack.Screen name="CancelVisit" component={CancelVisitScreen} />
          <Stack.Screen
            name="DocumentDetail"
            component={DocumentDetailScreen}
          />
          <Stack.Screen
            name="SignDocument"
            component={SignDocumentScreen}
            options={{ animation: 'slide_from_bottom' }}
          />
          <Stack.Screen name="Addresses" component={AddressesScreen} />
          <Stack.Screen name="AddressForm" component={AddressFormScreen} />
          <Stack.Screen
            name="AccountRequests"
            component={AccountRequestsScreen}
          />
          <Stack.Screen
            name="AccountRequestForm"
            component={AccountRequestFormScreen}
          />
          <Stack.Screen
            name="ChangePassword"
            component={ChangePasswordScreen}
          />
          <Stack.Screen name="Help" component={HelpScreen} />
        </Stack.Group>
      ) : (
        <Stack.Group>
          {/* After signing out, Sign in slides in as if going back. */}
          <Stack.Screen
            name="SignIn"
            component={SignInScreen}
            options={{ animationTypeForReplace: 'pop' }}
          />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="VerifyCode" component={VerifyCodeScreen} />
          <Stack.Screen
            name="ForgotPassword"
            component={ForgotPasswordScreen}
          />
          <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
        </Stack.Group>
      )}
      <Stack.Screen name="Content" component={ContentScreen} />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
    </Stack.Navigator>
  );
}
