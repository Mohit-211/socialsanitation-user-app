import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import AppText from './AppText';
import { Check } from './icons';
import { colors, layout, space } from '../theme';

type Props<T extends string | number> = {
  label: string;
  options: readonly { value: T; label: string }[];
  selected: readonly T[];
  onToggle: (value: T) => void;
  error?: string;
};

/** A labelled set of square chips that can each be switched on or off. */
export default function ChoiceChips<T extends string | number>({
  label,
  options,
  selected,
  onToggle,
  error,
}: Props<T>) {
  return (
    <View style={styles.field}>
      <AppText variant="label">{label}</AppText>
      <View style={styles.wrap}>
        {options.map(option => {
          const on = selected.includes(option.value);
          return (
            <Pressable
              key={option.value}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: on }}
              onPress={() => onToggle(option.value)}
              style={({ pressed }) => [
                styles.chip,
                on && styles.chipOn,
                pressed && styles.pressed,
              ]}
            >
              {on ? (
                <Check size={16} color={colors.foreground} strokeWidth={2.5} />
              ) : null}
              <AppText variant="smallStrong">{option.label}</AppText>
            </Pressable>
          );
        })}
      </View>
      {error ? (
        <AppText variant="caption" color={colors.destructive}>
          {error}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: { gap: space.xs },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: space.xs },
  chip: {
    minHeight: layout.touch,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: space.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  chipOn: { borderColor: colors.foreground, backgroundColor: colors.brandWash },
  pressed: { backgroundColor: colors.muted },
});
