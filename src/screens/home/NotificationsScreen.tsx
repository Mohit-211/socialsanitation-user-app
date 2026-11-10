import React from 'react';
import { StyleSheet, View } from 'react-native';
import { errorMessage } from '../../api/errors';
import {
  getNotifications,
  markAllRead,
  markRead,
} from '../../api/notifications';
import type { AppNotification } from '../../api/types';
import AppText from '../../components/AppText';
import Card from '../../components/Card';
import Header from '../../components/Header';
import IconButton from '../../components/IconButton';
import ListView from '../../components/ListView';
import Screen from '../../components/Screen';
import { notify } from '../../components/Toaster';
import { CheckCheck, Inbox, X } from '../../components/icons';
import { usePagedList } from '../../hooks/usePagedList';
import type { RootScreenProps, TabParamList } from '../../navigation/types';
import { colors, space, styles as theme } from '../../theme';
import { formatDateTime } from '../../utils/date';

// Notifications carry no IDs, so a tap opens the tab the notification is about.
const VISIT_TYPES = ['SERVICE BOOKED', 'BOOKING REJECTED', 'BOOKING ACCEPTED'];
const DOCUMENT_TYPES = [
  'DOCUMENT SHARED',
  'INVOICE SENT',
  'PAYMENT REMINDER',
  'PAYMENT RECEIVED',
];

const tabFor = (type: string): keyof TabParamList | null =>
  VISIT_TYPES.includes(type)
    ? 'Visits'
    : DOCUMENT_TYPES.includes(type)
      ? 'Documents'
      : null;

export default function NotificationsScreen({
  navigation,
}: RootScreenProps<'Notifications'>) {
  const list = usePagedList(getNotifications);

  // Reading a notification removes it from the inbox, so it leaves the list at once.
  const read = (item: AppNotification) => {
    list.remove(item.id);
    markRead(item.id).catch(e => {
      notify.error(errorMessage(e));
      list.refresh();
    });
  };

  const open = (item: AppNotification) => {
    read(item);
    const tab = tabFor(item.type);
    if (tab) {
      navigation.navigate('Tabs', { screen: tab });
    }
  };

  const readAll = async () => {
    try {
      const { message } = await markAllRead();
      notify.success(message || 'All notifications marked as read.');
      list.refresh();
    } catch (e) {
      notify.error(errorMessage(e));
    }
  };

  return (
    <Screen
      scroll={false}
      header={
        <Header
          title="Notifications"
          right={
            list.items.length > 0 ? (
              <IconButton
                icon={CheckCheck}
                label="Mark all as read"
                onPress={readAll}
              />
            ) : null
          }
        />
      }
    >
      <ListView
        list={list}
        keyOf={item => String(item.id)}
        empty={{
          icon: Inbox,
          title: "You're all caught up",
          message:
            'News about your visits, documents and invoices shows up here.',
        }}
        renderItem={item => (
          <Card
            onPress={() => open(item)}
            accessibilityLabel={`${item.title}. ${item.body}`}
          >
            <View style={styles.row}>
              <View style={[theme.bullet, styles.dot]} />
              <View style={styles.text}>
                <AppText variant="bodyStrong">{item.title}</AppText>
                <AppText variant="small" color={colors.foreground}>
                  {item.body}
                </AppText>
                <AppText variant="caption">
                  {formatDateTime(item.created_at)}
                </AppText>
              </View>
              <IconButton
                icon={X}
                label="Mark as read"
                color={colors.mutedForeground}
                onPress={() => read(item)}
              />
            </View>
          </Card>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: space.sm },
  dot: { marginTop: 9 },
  text: { flex: 1, gap: space.xxs },
});
