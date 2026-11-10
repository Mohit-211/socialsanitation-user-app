import React from 'react';
import { StyleSheet, View } from 'react-native';
import AppText from './AppText';
import { space, styles as theme, type TextVariant } from '../theme';

/** A line of a list, marked with the site's small green square. */
export default function Bullet({
  children,
  variant = 'body',
}: {
  children: React.ReactNode;
  variant?: TextVariant;
}) {
  return (
    <View style={styles.row}>
      <View
        style={[
          theme.bullet,
          variant === 'body' ? styles.markBody : styles.markSmall,
        ]}
      />
      <AppText variant={variant} style={styles.text}>
        {children}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: space.sm },
  // Centres the square on the first line of text.
  markBody: { marginTop: 9 },
  markSmall: { marginTop: 7 },
  text: { flex: 1 },
});
