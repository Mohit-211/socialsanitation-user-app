import React from 'react';
import { StyleSheet, View } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import AppText from './AppText';
import { colors, space } from '../theme';

/** A small icon and a line of text, for facts such as a time or an address. */
export default function IconText({
  icon: Icon,
  text,
}: {
  icon: LucideIcon;
  text: string;
}) {
  return (
    <View style={styles.row}>
      <Icon
        size={16}
        color={colors.mutedForeground}
        strokeWidth={2}
        style={styles.icon}
      />
      <AppText variant="small" style={styles.text}>
        {text}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: space.xs },
  icon: { marginTop: 2 },
  text: { flex: 1 },
});
