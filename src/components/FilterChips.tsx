import React from 'react';
import { Pressable, ScrollView, StyleSheet } from 'react-native';
import AppText from './AppText';
import { colors, layout, space } from '../theme';

type Props<T extends string> = {
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
};

/** A row of filters that scrolls sideways. The chosen one is filled in dark. */
export default function FilterChips<T extends string>({
  options,
  value,
  onChange,
}: Props<T>) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
      accessibilityRole="tablist"
    >
      {options.map(option => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            onPress={() => onChange(option.value)}
            style={({ pressed }) => [
              styles.chip,
              selected && styles.selected,
              pressed && !selected && styles.pressed,
            ]}
          >
            <AppText
              variant="smallStrong"
              color={selected ? colors.background : colors.foreground}
            >
              {option.label}
            </AppText>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { gap: space.xs },
  chip: {
    minHeight: layout.touch - 8,
    justifyContent: 'center',
    paddingHorizontal: space.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  selected: {
    backgroundColor: colors.foreground,
    borderColor: colors.foreground,
  },
  pressed: { backgroundColor: colors.muted },
});
