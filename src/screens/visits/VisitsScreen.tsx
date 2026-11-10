import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { getVisits, type VisitFilter } from '../../api/visits';
import Heading from '../../components/Heading';
import ListView from '../../components/ListView';
import Screen from '../../components/Screen';
import SegmentedControl from '../../components/SegmentedControl';
import VisitCard from '../../components/VisitCard';
import { CalendarDays } from '../../components/icons';
import { usePagedList } from '../../hooks/usePagedList';
import type { TabScreenProps } from '../../navigation/types';
import { space } from '../../theme';

const FILTERS = [
  { value: 'UPCOMING', label: 'Upcoming' },
  { value: 'COMPLETED', label: 'Past' },
] as const;

export default function VisitsScreen({ navigation }: TabScreenProps<'Visits'>) {
  const [filter, setFilter] = useState<VisitFilter>('UPCOMING');
  const list = usePagedList(
    useCallback((page: number) => getVisits(filter, page), [filter]),
  );

  return (
    <Screen scroll={false} inTabs>
      <View style={styles.top}>
        <Heading eyebrow="Your visits" title="Visits" size="display" />
        <SegmentedControl
          options={FILTERS}
          value={filter}
          onChange={setFilter}
        />
      </View>
      <ListView
        inTabs
        list={list}
        keyOf={visit => String(visit.id)}
        empty={
          filter === 'UPCOMING'
            ? {
                icon: CalendarDays,
                title: 'No upcoming visits',
                message:
                  'When the office books a visit for you, it shows up here.',
                action: {
                  title: 'Request a service',
                  onPress: () => navigation.navigate('EnquiryForm'),
                },
              }
            : {
                icon: CalendarDays,
                title: 'No past visits yet',
                message: 'Finished and cancelled visits show up here.',
              }
        }
        renderItem={visit => (
          <VisitCard
            visit={visit}
            onPress={() => navigation.navigate('VisitDetail', { id: visit.id })}
          />
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: { gap: space.lg, paddingHorizontal: space.gutter, paddingTop: space.lg },
});
