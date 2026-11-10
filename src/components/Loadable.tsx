import React from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import EmptyState from './EmptyState';
import { CircleAlert } from './icons';
import { errorMessage } from '../api/errors';
import { colors, space } from '../theme';

type Props<T> = {
  data: T | undefined;
  error: unknown;
  reload: () => void;
  children: (data: T) => React.ReactNode;
};

/** Shows the data once it has loaded; until then a spinner, or the error with a retry button. */
export default function Loadable<T>({
  data,
  error,
  reload,
  children,
}: Props<T>) {
  if (data !== undefined) {
    return <>{children(data)}</>;
  }
  if (error === undefined) {
    return (
      <ActivityIndicator
        size="large"
        color={colors.foreground}
        style={styles.spinner}
      />
    );
  }
  return (
    <EmptyState
      icon={CircleAlert}
      title="Couldn't load this"
      message={errorMessage(error)}
      action={{ title: 'Try again', onPress: reload }}
    />
  );
}

const styles = StyleSheet.create({
  spinner: { marginVertical: space.xxl },
});
