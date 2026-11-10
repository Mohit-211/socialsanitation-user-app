import React from 'react';
import { StyleSheet, View } from 'react-native';
import AppText from './AppText';
import { space } from '../theme';

/** A label over a value, for the facts on a detail screen. */
export default function DetailRow({
  label,
  value,
  children,
}: {
  label: string;
  value?: string;
  children?: React.ReactNode;
}) {
  return (
    <View style={styles.row}>
      <AppText variant="eyebrow">{label}</AppText>
      {value !== undefined ? (
        <AppText variant="body">{value}</AppText>
      ) : (
        children
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { gap: space.xxs },
});
