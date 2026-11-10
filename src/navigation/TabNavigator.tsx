import React from 'react';
import { StyleSheet, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { LucideIcon } from 'lucide-react-native';
import {
  CalendarDays,
  CircleUserRound,
  FileText,
  House,
} from '../components/icons';
import AccountScreen from '../screens/account/AccountScreen';
import DocumentsScreen from '../screens/documents/DocumentsScreen';
import HomeScreen from '../screens/home/HomeScreen';
import VisitsScreen from '../screens/visits/VisitsScreen';
import { colors, fonts } from '../theme';
import type { TabParamList } from './types';

const Tab = createBottomTabNavigator<TabParamList>();

// The chosen tab's icon sits on a square of the brand wash.
const tabIcon = (Icon: LucideIcon) =>
  function TabIcon({ focused, color }: { focused: boolean; color: string }) {
    return (
      <View style={[styles.indicator, focused && styles.indicatorOn]}>
        <Icon size={22} color={color} strokeWidth={focused ? 2.25 : 1.75} />
      </View>
    );
  };

const HomeIcon = tabIcon(House);
const VisitsIcon = tabIcon(CalendarDays);
const DocumentsIcon = tabIcon(FileText);
const AccountIcon = tabIcon(CircleUserRound);

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.foreground,
        tabBarInactiveTintColor: colors.mutedForeground,
        tabBarStyle: styles.bar,
        tabBarIconStyle: styles.iconBox,
        tabBarLabelStyle: styles.label,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarIcon: HomeIcon }}
      />
      <Tab.Screen
        name="Visits"
        component={VisitsScreen}
        options={{ tabBarIcon: VisitsIcon }}
      />
      <Tab.Screen
        name="Documents"
        component={DocumentsScreen}
        options={{ tabBarIcon: DocumentsIcon }}
      />
      <Tab.Screen
        name="Account"
        component={AccountScreen}
        options={{ tabBarIcon: AccountIcon }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  bar: { backgroundColor: colors.background, borderTopColor: colors.border },
  iconBox: { width: 56, height: 28 },
  indicator: {
    width: 56,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicatorOn: { backgroundColor: colors.brandWash },
  // A static font file per weight: the weight must match the file, or iOS picks another face.
  label: {
    fontFamily: fonts.bold,
    fontWeight: '700',
    fontSize: 11,
    marginTop: 2,
  },
});
