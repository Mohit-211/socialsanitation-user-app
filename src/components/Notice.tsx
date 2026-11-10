import React from 'react';
import { StyleSheet, View } from 'react-native';
import AppText from './AppText';
import type { Tone } from './StatusPill';
import { colors, space } from '../theme';

const washes: Record<Tone, { wash: string; bar: string }> = {
  neutral: { wash: colors.surface, bar: colors.border },
  success: { wash: colors.brandWash, bar: colors.primary },
  warning: { wash: colors.warningWash, bar: colors.warning },
  danger: { wash: colors.dangerWash, bar: colors.destructive },
  info: { wash: colors.accent, bar: colors.info },
};

/** A tinted callout with a bar down its side, for something the user should know first. */
export default function Notice({
  tone = 'neutral',
  title,
  children,
}: {
  tone?: Tone;
  title?: string;
  children: string;
}) {
  const t = washes[tone];
  return (
    <View
      style={[
        styles.notice,
        { backgroundColor: t.wash, borderLeftColor: t.bar },
      ]}
    >
      {title ? <AppText variant="smallStrong">{title}</AppText> : null}
      <AppText variant="small" color={colors.foreground}>
        {children}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  notice: { gap: space.xxs, padding: space.md, borderLeftWidth: 3 },
});
