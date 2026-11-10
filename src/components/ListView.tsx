import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import EmptyState from './EmptyState';
import { CircleAlert } from './icons';
import { errorMessage } from '../api/errors';
import { colors, space } from '../theme';

/** What a list shows and how it reloads: a paged list from usePagedList, or a filtered one. */
export type ListSource<T> = {
  items: T[];
  loading: boolean;
  error: unknown;
  refreshing: boolean;
  reload: () => void;
  refresh: () => void;
  loadMore?: () => void;
  loadingMore?: boolean;
};

type Props<T> = {
  list: ListSource<T>;
  keyOf: (item: T) => string;
  renderItem: (item: T) => React.ReactElement;
  /** What the list shows when it is empty. */
  empty: React.ComponentProps<typeof EmptyState>;
  /** Scrolls with the list, above the first item. */
  header?: React.ReactElement;
  inTabs?: boolean;
};

/** A list of cards with pull to refresh, loading more at the end, and empty and error states. */
export default function ListView<T>({
  list,
  keyOf,
  renderItem,
  empty,
  header,
  inTabs = false,
}: Props<T>) {
  const insets = useSafeAreaInsets();
  return (
    <FlatList
      data={list.items}
      keyExtractor={keyOf}
      renderItem={({ item }) => renderItem(item)}
      ListHeaderComponent={header}
      ListEmptyComponent={
        list.loading ? (
          <ActivityIndicator
            style={styles.spinner}
            size="large"
            color={colors.foreground}
          />
        ) : list.error ? (
          <EmptyState
            icon={CircleAlert}
            title="Couldn't load this"
            message={errorMessage(list.error)}
            action={{ title: 'Try again', onPress: list.reload }}
          />
        ) : (
          <EmptyState {...empty} />
        )
      }
      ListFooterComponent={
        list.loadingMore ? (
          <ActivityIndicator style={styles.spinner} color={colors.foreground} />
        ) : undefined
      }
      ItemSeparatorComponent={Gap}
      onEndReached={list.loadMore}
      onEndReachedThreshold={0.5}
      refreshControl={
        <RefreshControl
          refreshing={list.refreshing}
          onRefresh={list.refresh}
          tintColor={colors.foreground}
          colors={[colors.foreground]}
        />
      }
      contentContainerStyle={[
        styles.content,
        { paddingBottom: space.xl + (inTabs ? 0 : insets.bottom) },
      ]}
    />
  );
}

function Gap() {
  return <View style={styles.gap} />;
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    paddingHorizontal: space.gutter,
    paddingTop: space.lg,
  },
  gap: { height: space.sm },
  spinner: { marginVertical: space.xl },
});
