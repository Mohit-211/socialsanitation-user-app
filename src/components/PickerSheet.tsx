import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import AppText from './AppText';
import IconButton from './IconButton';
import { Check, X } from './icons';
import { colors, space, styles as theme } from '../theme';

export type Option<T> = { value: T; label: string };

type Props<T extends string | number> = {
  title: string;
  visible: boolean;
  onClose: () => void;
  options: readonly Option<T>[];
  selected: T | null;
  onPick: (option: Option<T>) => void;
  /** Shows a search box. The caller filters or fetches the options as the text changes. */
  search?: { value: string; onChange: (text: string) => void };
  loading?: boolean;
  emptyText: string;
};

/** A sheet listing options to pick one from, with an optional search box. */
export default function PickerSheet<T extends string | number>({
  title,
  visible,
  onClose,
  options,
  selected,
  onPick,
  search,
  loading = false,
  emptyText,
}: Props<T>) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaProvider>
        <SafeAreaView style={theme.screen}>
          <View style={styles.top}>
            <AppText variant="heading" style={styles.fill}>
              {title}
            </AppText>
            <IconButton icon={X} label="Close" onPress={onClose} />
          </View>
          {search ? (
            <TextInput
              value={search.value}
              onChangeText={search.onChange}
              placeholder="Search"
              placeholderTextColor={colors.mutedForeground}
              autoCorrect={false}
              autoFocus
              accessibilityLabel={`Search ${title}`}
              style={[theme.formInput, styles.search]}
            />
          ) : null}
          <FlatList
            data={options}
            keyExtractor={item => String(item.value)}
            keyboardShouldPersistTaps="handled"
            ItemSeparatorComponent={Separator}
            ListEmptyComponent={
              loading ? (
                <ActivityIndicator
                  style={styles.empty}
                  color={colors.foreground}
                />
              ) : (
                <AppText variant="small" style={styles.empty}>
                  {emptyText}
                </AppText>
              )
            }
            renderItem={({ item }) => {
              const isSelected = item.value === selected;
              return (
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected }}
                  onPress={() => onPick(item)}
                  style={({ pressed }) => [
                    styles.option,
                    pressed && styles.pressed,
                  ]}
                >
                  <AppText
                    variant={isSelected ? 'bodyStrong' : 'body'}
                    style={styles.fill}
                  >
                    {item.label}
                  </AppText>
                  {isSelected ? (
                    <Check
                      size={20}
                      color={colors.foreground}
                      strokeWidth={2.5}
                    />
                  ) : null}
                </Pressable>
              );
            }}
          />
        </SafeAreaView>
      </SafeAreaProvider>
    </Modal>
  );
}

function Separator() {
  return <View style={[theme.hairline, styles.separator]} />;
}

const styles = StyleSheet.create({
  top: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: space.gutter,
    paddingRight: space.xxs,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  fill: { flex: 1 },
  search: {
    marginHorizontal: space.gutter,
    marginTop: space.md,
    marginBottom: space.xs,
  },
  option: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    paddingHorizontal: space.gutter,
  },
  pressed: { backgroundColor: colors.muted },
  separator: { marginLeft: space.gutter },
  empty: { padding: space.gutter },
});
