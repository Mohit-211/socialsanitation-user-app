import type {
  CompositeScreenProps,
  NavigatorScreenParams,
} from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { DocumentKind, ProfileRequestKind } from '../api/types';

export type TabParamList = {
  Home: undefined;
  Visits: undefined;
  Documents: undefined;
  Account: undefined;
};

export type RootStackParamList = {
  // Signed out
  SignIn: { email?: string } | undefined;
  SignUp: undefined;
  VerifyCode: { email: string; purpose: 'signup' | 'reset' };
  ForgotPassword: { email?: string } | undefined;
  ResetPassword: { email: string; token: string };
  // Signed in
  Tabs: NavigatorScreenParams<TabParamList> | undefined;
  Notifications: undefined;
  ServiceDetail: { id: number; name: string };
  EnquiryForm: { serviceId?: number } | undefined;
  Enquiries: undefined;
  VisitDetail: { id: number };
  CancelVisit: { id: number };
  DocumentDetail: { kind: DocumentKind; id: number; justSigned?: boolean };
  SignDocument: { kind: DocumentKind; id: number; url: string };
  Addresses: undefined;
  AddressForm: { id?: number } | undefined;
  AccountRequests: undefined;
  AccountRequestForm: { kind?: ProfileRequestKind } | undefined;
  ChangePassword: undefined;
  Help: undefined;
  // Either way
  Content: { kind: 'about' | 'terms' };
  PrivacyPolicy: undefined;
};

export type RootScreenProps<Name extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Name>;

export type TabScreenProps<Name extends keyof TabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<TabParamList, Name>,
    NativeStackScreenProps<RootStackParamList>
  >;

// Types useNavigation() and <Link> across the app.
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
