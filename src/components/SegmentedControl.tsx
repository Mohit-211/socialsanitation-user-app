import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import AppText from './AppText';
import { colors, layout, space } from '../theme';

type Props<T extends string> = {
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
};

/** Tabs within a screen. The chosen one is underlined with the site's green bar. */
export default function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: Props<T>) {
  return (
    <View accessibilityRole="tablist" style={styles.row}>
      {options.map(option => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            onPress={() => onChange(option.value)}
            style={styles.tab}
          >
            <AppText
              variant="label"
              color={selected ? colors.foreground : colors.mutedForeground}
            >
              {option.label}
            </AppText>
            <View style={[styles.bar, selected && styles.barSelected]} />
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    minHeight: layout.touch,
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: space.sm,
  },
  bar: { alignSelf: 'stretch', height: 2, marginBottom: -1 },
  barSelected: { backgroundColor: colors.primary },
});
