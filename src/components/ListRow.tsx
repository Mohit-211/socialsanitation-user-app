import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import AppText from './AppText';
import { ChevronRight } from './icons';
import { colors, space } from '../theme';

type Props = {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  /** Shown at the right edge instead of, or before, the chevron. */
  trailing?: React.ReactNode;
  onPress?: () => void;
  destructive?: boolean;
};

/** One row of a settings-style list: icon, title, optional subtitle, and a chevron when it opens something. */
export default function ListRow({
  title,
  subtitle,
  icon: Icon,
  trailing,
  onPress,
  destructive = false,
}: Props) {
  const tint = destructive ? colors.destructive : colors.foreground;
  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : undefined}
      disabled={!onPress}
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      {Icon ? (
        <View style={styles.icon}>
          <Icon size={20} color={tint} strokeWidth={2} />
        </View>
      ) : null}
      <View style={styles.text}>
        <AppText variant="bodyStrong" color={tint}>
          {title}
        </AppText>
        {subtitle ? <AppText variant="small">{subtitle}</AppText> : null}
      </View>
      {trailing}
      {onPress && !destructive ? (
        <ChevronRight size={20} color={colors.mutedForeground} />
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    paddingVertical: space.sm,
    paddingHorizontal: space.gutter,
    backgroundColor: colors.background,
  },
  pressed: { backgroundColor: colors.muted },
  icon: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  text: { flex: 1, gap: 2 },
});
