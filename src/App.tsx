import React from 'react';
import { StatusBar } from 'react-native';
import {
  DefaultTheme,
  NavigationContainer,
  type Theme,
} from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toaster from './components/Toaster';
import RootNavigator from './navigation/RootNavigator';
import { SessionProvider } from './session/SessionProvider';
import { colors, fonts } from './theme';

// React Navigation's own colours and fonts, from the theme. Each font weight is its own file,
// so every family is paired with its file's weight.
const navigationTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.foreground,
    background: colors.background,
    card: colors.background,
    text: colors.foreground,
    border: colors.border,
    notification: colors.primary,
  },
  fonts: {
    regular: { fontFamily: fonts.regular, fontWeight: '400' },
    medium: { fontFamily: fonts.medium, fontWeight: '500' },
    bold: { fontFamily: fonts.bold, fontWeight: '700' },
    heavy: { fontFamily: fonts.extraBold, fontWeight: '800' },
  },
};

export default function App() {
  return (
    <SafeAreaProvider>
      {/* Light screens throughout, so the status bar icons stay dark. */}
      <StatusBar barStyle="dark-content" />
      <SessionProvider>
        <NavigationContainer theme={navigationTheme}>
          <RootNavigator />
        </NavigationContainer>
        <Toaster />
      </SessionProvider>
    </SafeAreaProvider>
  );
}
