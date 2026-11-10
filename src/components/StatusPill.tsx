import React from 'react';
import { StyleSheet, View } from 'react-native';
import AppText from './AppText';
import { colors, space } from '../theme';

export type Tone = 'neutral' | 'success' | 'warning' | 'danger' | 'info';

const tones: Record<Tone, { wash: string; dot: string; text: string }> = {
  neutral: {
    wash: colors.muted,
    dot: colors.mutedForeground,
    text: colors.foreground,
  },
  success: {
    wash: colors.brandWash,
    dot: colors.success,
    text: colors.foreground,
  },
  warning: {
    wash: colors.warningWash,
    dot: colors.warning,
    text: colors.warningText,
  },
  danger: {
    wash: colors.dangerWash,
    dot: colors.destructive,
    text: colors.dangerText,
  },
  info: {
    wash: colors.accent,
    dot: colors.info,
    text: colors.accentForeground,
  },
};

/** A small status label. The text always carries the meaning; the colour only backs it up. */
export default function StatusPill({
  label,
  tone = 'neutral',
}: {
  label: string;
  tone?: Tone;
}) {
  const t = tones[tone];
  return (
    <View style={[styles.pill, { backgroundColor: t.wash }]}>
      <View style={[styles.dot, { backgroundColor: t.dot }]} />
      <AppText variant="eyebrow" color={t.text}>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: space.xxs,
    paddingHorizontal: space.xs,
  },
  dot: { width: 6, height: 6 },
});
