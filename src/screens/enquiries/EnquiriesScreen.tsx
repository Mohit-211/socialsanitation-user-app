import React from 'react';
import { StyleSheet, View } from 'react-native';
import { getEnquiries } from '../../api/enquiries';
import AppText from '../../components/AppText';
import Card from '../../components/Card';
import Header from '../../components/Header';
import IconButton from '../../components/IconButton';
import IconText from '../../components/IconText';
import ListView from '../../components/ListView';
import Screen from '../../components/Screen';
import StatusPill from '../../components/StatusPill';
import { Calendar, ClipboardList, MapPin, Plus } from '../../components/icons';
import { usePagedList } from '../../hooks/usePagedList';
import type { RootScreenProps } from '../../navigation/types';
import { space } from '../../theme';
import { formatDate } from '../../utils/date';
import { formatMoney } from '../../utils/format';
import { enquiryStatus } from '../../utils/status';

export default function EnquiriesScreen({
  navigation,
}: RootScreenProps<'Enquiries'>) {
  const list = usePagedList(getEnquiries);
  const request = () => navigation.navigate('EnquiryForm');
  return (
    <Screen
      scroll={false}
      header={
        <Header
          title="Inquiries"
          right={
            <IconButton
              icon={Plus}
              label="Request a service"
              onPress={request}
            />
          }
        />
      }
    >
      <ListView
        list={list}
        keyOf={enquiry => String(enquiry.id)}
        empty={{
          icon: ClipboardList,
          title: 'No inquiries yet',
          message: 'Ask for a service and the office will get back to you.',
          action: { title: 'Request a service', onPress: request },
        }}
        renderItem={enquiry => (
          <Card>
            <View style={styles.top}>
              <AppText variant="caption">
                Sent {formatDate(enquiry.created_at)}
              </AppText>
              <StatusPill {...enquiryStatus(enquiry.status)} />
            </View>
            <AppText variant="heading">
              {enquiry.services.map(service => service.name).join(', ') ||
                'General inquiry'}
            </AppText>
            {enquiry.needed_on ? (
              <IconText
                icon={Calendar}
                text={`Needed on ${formatDate(enquiry.needed_on)}`}
              />
            ) : null}
            {enquiry.address ? (
              <IconText icon={MapPin} text={enquiry.address.one_line} />
            ) : null}
            {enquiry.notes ? (
              <AppText variant="small" numberOfLines={3}>
                {enquiry.notes}
              </AppText>
            ) : null}
            {typeof enquiry.quoted_price === 'number' ? (
              <AppText variant="smallStrong">
                Quoted {formatMoney(enquiry.quoted_price)}
              </AppText>
            ) : null}
          </Card>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space.sm,
  },
});
