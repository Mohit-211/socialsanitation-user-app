import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import AppText from './AppText';
import { colors, layout } from '../theme';

type Props = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  destructive?: boolean;
};

/** A text link in the site's style: bold and underlined, with a full-size touch target. */
export default function LinkButton({
  title,
  onPress,
  disabled = false,
  destructive = false,
}: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={() => onPress()}
      hitSlop={layout.hitSlop}
      style={({ pressed }) => [
        styles.link,
        (pressed || disabled) && styles.dim,
      ]}
    >
      <AppText
        variant="link"
        color={destructive ? colors.destructive : undefined}
      >
        {title}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  link: {
    minHeight: layout.touch,
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  dim: { opacity: 0.5 },
});
