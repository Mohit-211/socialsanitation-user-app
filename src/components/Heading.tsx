import React from 'react';
import { StyleSheet, View } from 'react-native';
import AppText from './AppText';
import Eyebrow from './Eyebrow';
import { space } from '../theme';

type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  /** `display` for the top of a tab, `title` for a section within a screen. */
  size?: 'display' | 'title' | 'heading';
  /** Shown at the end of the title row, such as a "See all" link. */
  action?: React.ReactNode;
};

/** An eyebrow, a title in Sora, and an optional line of description, as the site opens each section. */
export default function Heading({
  eyebrow,
  title,
  description,
  size = 'title',
  action,
}: Props) {
  return (
    <View style={styles.block}>
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <View style={styles.row}>
        <AppText variant={size} accessibilityRole="header" style={styles.title}>
          {title}
        </AppText>
        {action}
      </View>
      {description ? <AppText variant="small">{description}</AppText> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  block: { gap: space.xs },
  row: { flexDirection: 'row', alignItems: 'flex-end', gap: space.sm },
  title: { flex: 1 },
});
