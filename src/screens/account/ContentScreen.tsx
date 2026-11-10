import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { getAbout, getTerms } from '../../api/site';
import EmptyState from '../../components/EmptyState';
import Header from '../../components/Header';
import Heading from '../../components/Heading';
import Loadable from '../../components/Loadable';
import RichText from '../../components/RichText';
import Screen from '../../components/Screen';
import { Info, ScrollText } from '../../components/icons';
import { useRequest } from '../../hooks/useRequest';
import type { RootScreenProps } from '../../navigation/types';
import { colors, space } from '../../theme';

const PAGES = {
  about: { title: 'About us', load: getAbout, icon: Info },
  terms: { title: 'Terms and conditions', load: getTerms, icon: ScrollText },
};

/** About us or the terms: sections the office writes in the admin panel. */
export default function ContentScreen({ route }: RootScreenProps<'Content'>) {
  const page = PAGES[route.params.kind];
  const content = useRequest(page.load);
  return (
    <Screen
      header={<Header title={page.title} />}
      refreshing={content.refreshing}
      onRefresh={content.refresh}
    >
      <Loadable {...content}>
        {sections =>
          sections.length === 0 ? (
            <EmptyState
              icon={page.icon}
              title="Nothing here yet"
              message="Please check back soon."
            />
          ) : (
            sections.map(section => (
              <View key={section.id} style={styles.section}>
                <Heading title={section.heading} />
                <RichText html={section.description} />
                {section.images?.map(image => (
                  <Image
                    key={image.id}
                    source={{ uri: image.url }}
                    style={styles.image}
                    accessibilityIgnoresInvertColors
                  />
                ))}
              </View>
            ))
          )
        }
      </Loadable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  section: { gap: space.sm },
  image: { width: '100%', aspectRatio: 16 / 9, backgroundColor: colors.muted },
});
