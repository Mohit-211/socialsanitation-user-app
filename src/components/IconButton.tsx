import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import AppText from './AppText';
import { colors, layout } from '../theme';

type Props = {
  icon: LucideIcon;
  /** What the button does, read out by screen readers. */
  label: string;
  onPress: () => void;
  /** A count shown on the icon, such as unread notifications. */
  badge?: number;
  color?: string;
};

export default function IconButton({
  icon: Icon,
  label,
  onPress,
  badge,
  color = colors.foreground,
}: Props) {
  const count =
    badge && badge > 0 ? (badge > 99 ? '99+' : String(badge)) : null;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={count ? `${label}, ${count} unread` : label}
      onPress={onPress}
      hitSlop={layout.hitSlop}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      <Icon size={22} color={color} strokeWidth={2} />
      {count ? (
        <View style={styles.badge}>
          <AppText
            variant="caption"
            color={colors.primaryForeground}
            style={styles.badgeText}
          >
            {count}
          </AppText>
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: layout.touch,
    height: layout.touch,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { backgroundColor: colors.muted },
  badge: {
    position: 'absolute',
    top: 4,
    right: 2,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },
  badgeText: { fontSize: 10, lineHeight: 12 },
});
