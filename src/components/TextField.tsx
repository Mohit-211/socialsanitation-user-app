import React, { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';
import AppText from './AppText';
import { Eye, EyeOff } from './icons';
import { colors, layout, space, styles as theme } from '../theme';

type Props = TextInputProps & {
  label: string;
  error?: string;
  hint?: string;
  /** A password field: hidden, with a show/hide button. */
  secret?: boolean;
  ref?: React.Ref<React.ComponentRef<typeof TextInput>>;
};

/** A labelled input in the site's form style: an uppercase label over a square, bordered field. */
export default function TextField({
  label,
  error,
  hint,
  secret = false,
  style,
  multiline,
  ref,
  ...props
}: Props) {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(secret);
  return (
    <View style={styles.field}>
      <AppText variant="label">{label}</AppText>
      <View
        style={[
          theme.formInputBox,
          focused && theme.formInputFocused,
          error ? theme.formInputInvalid : null,
        ]}
      >
        <TextInput
          {...props}
          ref={ref}
          multiline={multiline}
          secureTextEntry={hidden}
          placeholderTextColor={colors.mutedForeground}
          accessibilityLabel={label}
          onFocus={e => {
            setFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={e => {
            setFocused(false);
            props.onBlur?.(e);
          }}
          style={[
            theme.formInputText,
            multiline && styles.multiline,
            secret && styles.withToggle,
            style,
          ]}
        />
        {secret ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={hidden ? 'Show password' : 'Hide password'}
            onPress={() => setHidden(!hidden)}
            hitSlop={layout.hitSlop}
            style={styles.toggle}
          >
            {hidden ? (
              <Eye size={20} color={colors.mutedForeground} />
            ) : (
              <EyeOff size={20} color={colors.mutedForeground} />
            )}
          </Pressable>
        ) : null}
      </View>
      {error ? (
        <AppText variant="caption" color={colors.destructive}>
          {error}
        </AppText>
      ) : hint ? (
        <AppText variant="caption">{hint}</AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: { gap: space.xs },
  multiline: { minHeight: 112, textAlignVertical: 'top' },
  withToggle: { paddingRight: 52 },
  toggle: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
