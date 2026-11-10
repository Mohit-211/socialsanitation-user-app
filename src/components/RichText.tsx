import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import AppText from './AppText';
import Bullet from './Bullet';
import { space } from '../theme';
import { htmlToBlocks } from '../utils/html';

/** Shows text the office wrote in the panel's editor: headings, paragraphs and bullet lists. */
export default function RichText({ html }: { html: string }) {
  const blocks = useMemo(() => htmlToBlocks(html), [html]);
  return (
    <View style={styles.blocks}>
      {blocks.map((block, index) =>
        block.type === 'bullet' ? (
          <Bullet key={index}>{block.text}</Bullet>
        ) : (
          <AppText
            key={index}
            variant={block.type === 'heading' ? 'heading' : 'body'}
          >
            {block.text}
          </AppText>
        ),
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  blocks: { gap: space.sm },
});
