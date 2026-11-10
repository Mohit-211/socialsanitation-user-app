import React, { useState } from 'react';
import { Modal, Platform, Pressable, StyleSheet, View } from 'react-native';
import DateTimePicker, {
  DateTimePickerAndroid,
} from '@react-native-community/datetimepicker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Button from './Button';
import FieldTrigger from './FieldTrigger';
import { Calendar } from './icons';
import { colors, space } from '../theme';
import { formatDate } from '../utils/date';

type Props = {
  label: string;
  value: Date | null;
  onChange: (date: Date) => void;
  minimumDate?: Date;
  error?: string;
};

/** Picks a calendar date: Android's date dialog, or an inline calendar in a sheet on iOS. */
export default function DateField({
  label,
  value,
  onChange,
  minimumDate,
  error,
}: Props) {
  const [draft, setDraft] = useState<Date | null>(null);
  const insets = useSafeAreaInsets();
  const start = value ?? minimumDate ?? new Date();

  const open = () => {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: start,
        mode: 'date',
        minimumDate,
        onValueChange: (_event, date) => onChange(date),
      });
    } else {
      setDraft(start);
    }
  };

  return (
    <>
      <FieldTrigger
        label={label}
        value={value ? formatDate(value) : undefined}
        placeholder="MM/DD/YYYY"
        icon={Calendar}
        onPress={open}
        error={error}
      />
      {Platform.OS === 'ios' ? (
        <Modal
          visible={draft !== null}
          transparent
          animationType="fade"
          onRequestClose={() => setDraft(null)}
        >
          <Pressable
            accessibilityLabel="Close"
            style={styles.overlay}
            onPress={() => setDraft(null)}
          />
          <View
            style={[styles.sheet, { paddingBottom: space.md + insets.bottom }]}
          >
            {draft ? (
              <DateTimePicker
                value={draft}
                mode="date"
                display="inline"
                minimumDate={minimumDate}
                themeVariant="light"
                accentColor={colors.foreground}
                onValueChange={(_event, date) => setDraft(date)}
              />
            ) : null}
            <View style={styles.actions}>
              <Button
                title="Cancel"
                variant="outline"
                onPress={() => setDraft(null)}
                style={styles.action}
              />
              <Button
                title="Done"
                onPress={() => {
                  if (draft) {
                    onChange(draft);
                  }
                  setDraft(null);
                }}
                style={styles.action}
              />
            </View>
          </View>
        </Modal>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: colors.overlay },
  sheet: {
    backgroundColor: colors.background,
    paddingHorizontal: space.md,
    paddingTop: space.md,
    gap: space.md,
  },
  actions: { flexDirection: 'row', gap: space.sm },
  action: { flex: 1 },
});
