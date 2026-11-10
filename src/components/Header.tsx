import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppText from './AppText';
import IconButton from './IconButton';
import { ArrowLeft } from './icons';
import { colors, layout, space } from '../theme';

type Props = {
  title?: string;
  /** Actions on the right, usually IconButtons. */
  right?: React.ReactNode;
};

/** The bar at the top of a pushed screen: a back button, the title, and optional actions. */
export default function Header({ title, right }: Props) {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.bar, { paddingTop: insets.top }]}>
      <View style={styles.row}>
        {navigation.canGoBack() ? (
          <IconButton
            icon={ArrowLeft}
            label="Back"
            onPress={navigation.goBack}
          />
        ) : (
          <View style={styles.spacer} />
        )}
        <AppText
          variant="heading"
          numberOfLines={1}
          accessibilityRole="header"
          style={styles.title}
        >
          {title}
        </AppText>
        <View style={styles.right}>{right}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: colors.background,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  row: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: space.xxs,
    gap: space.xxs,
  },
  spacer: { width: space.md },
  title: { flex: 1 },
  right: {
    minWidth: layout.touch,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});
