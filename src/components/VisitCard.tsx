import React from 'react';
import { StyleSheet, View } from 'react-native';
import AppText from './AppText';
import Card from './Card';
import IconText from './IconText';
import StatusPill from './StatusPill';
import { Clock, MapPin } from './icons';
import type { VisitRow } from '../api/types';
import { space } from '../theme';
import { formatDay, formatTimeRange } from '../utils/date';
import { visitStatus } from '../utils/status';

/** What a visit is called: its title, else its services, else its number. */
export const visitTitle = (
  visit: Pick<VisitRow, 'title' | 'services' | 'number'>,
) =>
  visit.title ||
  visit.services.map(service => service.name).join(', ') ||
  `Booking ${visit.number}`;

export default function VisitCard({
  visit,
  onPress,
}: {
  visit: VisitRow;
  onPress: () => void;
}) {
  const status = visitStatus(visit.status);
  const day = formatDay(visit.date);
  const time = formatTimeRange(visit.start_time, visit.end_time);
  const title = visitTitle(visit);
  return (
    <Card
      onPress={onPress}
      accessibilityLabel={`${title}, ${day}, ${status.label}`}
    >
      <View style={styles.top}>
        <AppText variant="smallStrong">{day}</AppText>
        <StatusPill {...status} />
      </View>
      <AppText variant="heading">{title}</AppText>
      {time ? <IconText icon={Clock} text={time} /> : null}
      {visit.address ? <IconText icon={MapPin} text={visit.address} /> : null}
      {visit.cancel_request?.open ? (
        <StatusPill label="Cancellation requested" tone="warning" />
      ) : null}
    </Card>
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
