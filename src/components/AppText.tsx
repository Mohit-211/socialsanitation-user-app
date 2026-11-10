import React from 'react';
import { Text, type TextProps } from 'react-native';
import { text, type TextVariant } from '../theme';

type Props = TextProps & {
  variant?: TextVariant;
  color?: string;
};

/** Text in one of the theme's styles. */
export default function AppText({
  variant = 'body',
  color,
  style,
  ...props
}: Props) {
  return (
    <Text {...props} style={[text[variant], color ? { color } : null, style]} />
  );
}
