import React from 'react';
import { StyleSheet, View } from 'react-native';
import { getProfileRequests } from '../../api/account';
import AppText from '../../components/AppText';
import Card from '../../components/Card';
import Header from '../../components/Header';
import IconButton from '../../components/IconButton';
import ListView from '../../components/ListView';
import Notice from '../../components/Notice';
import Screen from '../../components/Screen';
import StatusPill from '../../components/StatusPill';
import { Plus, UserCog } from '../../components/icons';
import { usePagedList } from '../../hooks/usePagedList';
import type { RootScreenProps } from '../../navigation/types';
import { space } from '../../theme';
import { formatDate } from '../../utils/date';
import { requestStatus } from '../../utils/status';

export default function AccountRequestsScreen({
  navigation,
}: RootScreenProps<'AccountRequests'>) {
  const list = usePagedList(getProfileRequests);
  const ask = () => navigation.navigate('AccountRequestForm');
  return (
    <Screen
      scroll={false}
      header={
        <Header
          title="Account changes"
          right={
            <IconButton icon={Plus} label="Request a change" onPress={ask} />
          }
        />
      }
    >
      <ListView
        list={list}
        keyOf={request => String(request.id)}
        empty={{
          icon: UserCog,
          title: 'No requests yet',
          message:
            'Ask the office to change your name, email or phone, or to delete your account. Their reply shows up on this page.',
          action: { title: 'Request a change', onPress: ask },
        }}
        renderItem={request => (
          <Card>
            <View style={styles.top}>
              <AppText variant="bodyStrong" style={styles.fill}>
                {request.kind_name}
              </AppText>
              <StatusPill {...requestStatus(request.status)} />
            </View>
            {request.details ? (
              <AppText variant="small">{request.details}</AppText>
            ) : null}
            {request.office_note ? (
              <Notice title="From the office">{request.office_note}</Notice>
            ) : null}
            <AppText variant="caption">
              Sent {formatDate(request.created_at)}
            </AppText>
          </Card>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  fill: { flex: 1 },
});
