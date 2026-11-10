import React from 'react';
import { View } from 'react-native';
import AppText from './AppText';
import { styles as theme } from '../theme';

/** The site's eyebrow: a short green bar, then a small uppercase label. */
export default function Eyebrow({ children }: { children: string }) {
  return (
    <View style={theme.eyebrowRow}>
      <View style={theme.eyebrowBar} />
      <AppText variant="eyebrow">{children}</AppText>
    </View>
  );
}
