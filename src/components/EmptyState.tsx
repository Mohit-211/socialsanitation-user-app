import React from 'react';
import { StyleSheet, View } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import AppText from './AppText';
import Button from './Button';
import { colors, space } from '../theme';

type Props = {
  icon: LucideIcon;
  title: string;
  message?: string;
  action?: { title: string; onPress: () => void };
};

/** What a list or screen shows when it has nothing yet, or could not load. */
export default function EmptyState({
  icon: Icon,
  title,
  message,
  action,
}: Props) {
  return (
    <View style={styles.block}>
      <View style={styles.icon}>
        <Icon size={26} color={colors.foreground} strokeWidth={1.75} />
      </View>
      <AppText variant="heading" style={styles.center}>
        {title}
      </AppText>
      {message ? (
        <AppText variant="small" style={styles.center}>
          {message}
        </AppText>
      ) : null}
      {action ? (
        <Button
          title={action.title}
          onPress={action.onPress}
          variant="outline"
          compact
          style={styles.action}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    alignItems: 'center',
    gap: space.xs,
    paddingVertical: space.xxl,
    paddingHorizontal: space.lg,
  },
  icon: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: space.xs,
    backgroundColor: colors.brandWash,
  },
  center: { textAlign: 'center' },
  action: { marginTop: space.sm },
});
