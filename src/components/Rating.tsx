import React from 'react';
import { StyleSheet, View } from 'react-native';
import AppText from './AppText';
import { Star } from './icons';
import { colors, space } from '../theme';

/** 4.8 (12 reviews), or nothing while a service has no reviews. */
export default function Rating({
  average,
  count,
}: {
  average: number | null;
  count: number | null;
}) {
  if (!count || average === null) {
    return null;
  }
  return (
    <View
      style={styles.row}
      accessibilityLabel={`Rated ${average.toFixed(1)} out of 5 from ${count} reviews`}
    >
      <Star size={16} color={colors.warning} fill={colors.warning} />
      <AppText variant="smallStrong">{average.toFixed(1)}</AppText>
      <AppText variant="small">
        ({count} {count === 1 ? 'review' : 'reviews'})
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: space.xxs },
});
