import React, { useCallback, useState } from 'react';
import { Image, Modal, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { Visit } from '../../api/types';
import { getVisit } from '../../api/visits';
import AppText from '../../components/AppText';
import Bullet from '../../components/Bullet';
import Button from '../../components/Button';
import Card from '../../components/Card';
import DetailRow from '../../components/DetailRow';
import Eyebrow from '../../components/Eyebrow';
import Header from '../../components/Header';
import Heading from '../../components/Heading';
import IconButton from '../../components/IconButton';
import Loadable from '../../components/Loadable';
import Notice from '../../components/Notice';
import Screen from '../../components/Screen';
import StatusPill from '../../components/StatusPill';
import { visitTitle } from '../../components/VisitCard';
import { X } from '../../components/icons';
import { useRequest } from '../../hooks/useRequest';
import type { RootScreenProps } from '../../navigation/types';
import { colors, space } from '../../theme';
import {
  formatDate,
  formatDateTime,
  formatDay,
  formatTimeRange,
} from '../../utils/date';
import {
  canRequestCancellation,
  jobTitle,
  visitStatus,
} from '../../utils/status';

export default function VisitDetailScreen({
  navigation,
  route,
}: RootScreenProps<'VisitDetail'>) {
  const { id } = route.params;
  const visit = useRequest(useCallback(() => getVisit(id), [id]));
  const [photo, setPhoto] = useState<string | null>(null);
  const data = visit.data;
  const cancellable =
    data !== undefined &&
    canRequestCancellation(data) &&
    !data.cancel_request?.open;

  return (
    <Screen
      header={<Header title={data ? `Visit ${data.number}` : 'Visit'} />}
      refreshing={visit.refreshing}
      onRefresh={visit.refresh}
      footer={
        cancellable ? (
          <Button
            title="Request cancellation"
            variant="destructive"
            onPress={() => navigation.navigate('CancelVisit', { id })}
          />
        ) : undefined
      }
    >
      <Loadable {...visit}>
        {v => <VisitDetails visit={v} onPhoto={setPhoto} />}
      </Loadable>
      <PhotoViewer url={photo} onClose={() => setPhoto(null)} />
    </Screen>
  );
}

function VisitDetails({
  visit,
  onPhoto,
}: {
  visit: Visit;
  onPhoto: (url: string) => void;
}) {
  const request = visit.cancel_request;
  const ended = visit.status === 'CANCELLED' || visit.status === 'REJECTED';
  return (
    <>
      <View style={styles.section}>
        <Heading
          eyebrow={visit.type === 'recurring' ? 'Repeating visit' : 'Visit'}
          title={visitTitle(visit)}
          size="display"
        />
        <StatusPill {...visitStatus(visit.status)} />
      </View>

      {request?.open ? (
        <Notice tone="warning" title="Cancellation requested">
          {`You asked on ${formatDate(request.requested_at)}. The office will let you know.` +
            (request.reason ? `\nYour reason: ${request.reason}` : '')}
        </Notice>
      ) : null}
      {ended && visit.cancellation_reason ? (
        <Notice
          title={
            visit.status === 'CANCELLED'
              ? 'Why it was cancelled'
              : 'Why it was declined'
          }
        >
          {visit.cancellation_reason}
        </Notice>
      ) : null}

      <Card>
        <DetailRow label="Date" value={formatDay(visit.date)} />
        {visit.start_time ? (
          <DetailRow
            label="Time"
            value={formatTimeRange(visit.start_time, visit.end_time)}
          />
        ) : null}
        {visit.address ? (
          <DetailRow label="Address" value={visit.address.one_line} />
        ) : null}
        {visit.address?.access_notes ? (
          <DetailRow label="Access notes" value={visit.address.access_notes} />
        ) : null}
        {visit.started_at ? (
          <DetailRow
            label="Crew started"
            value={formatDateTime(visit.started_at)}
          />
        ) : null}
        {visit.finished_at ? (
          <DetailRow
            label="Crew finished"
            value={formatDateTime(visit.finished_at)}
          />
        ) : null}
      </Card>

      {visit.services.length > 0 ? (
        <View style={styles.section}>
          <Eyebrow>Services</Eyebrow>
          {visit.services.map(service => (
            <Bullet key={service.id}>{service.name}</Bullet>
          ))}
        </View>
      ) : null}

      {visit.employees.length > 0 ? (
        <View style={styles.section}>
          <Eyebrow>Your crew</Eyebrow>
          {visit.employees.map(person => (
            <Bullet
              key={person.id}
            >{`${person.name}, ${jobTitle(person.job_type).toLowerCase()}`}</Bullet>
          ))}
        </View>
      ) : null}

      {visit.notes ? (
        <View style={styles.section}>
          <Eyebrow>Notes</Eyebrow>
          <AppText>{visit.notes}</AppText>
        </View>
      ) : null}

      {(['before', 'after'] as const).map(kind => {
        const photos = visit.photos.filter(p => p.kind === kind);
        return photos.length > 0 ? (
          <View key={kind} style={styles.section}>
            <Eyebrow>{kind === 'before' ? 'Before' : 'After'}</Eyebrow>
            <View style={styles.grid}>
              {photos.map((p, index) => (
                <Pressable
                  key={p.id}
                  accessibilityRole="imagebutton"
                  accessibilityLabel={`${kind === 'before' ? 'Before' : 'After'} photo ${index + 1}`}
                  onPress={() => onPhoto(p.url)}
                  style={styles.thumb}
                >
                  <Image source={{ uri: p.url }} style={styles.fill} />
                </Pressable>
              ))}
            </View>
          </View>
        ) : null;
      })}
    </>
  );
}

/** A photo at full size over a dark backdrop. */
function PhotoViewer({
  url,
  onClose,
}: {
  url: string | null;
  onClose: () => void;
}) {
  const insets = useSafeAreaInsets();
  return (
    <Modal
      visible={url !== null}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.viewer}>
        {url ? (
          <Image
            source={{ uri: url }}
            style={styles.fill}
            resizeMode="contain"
          />
        ) : null}
        <View style={[styles.close, { top: insets.top + space.xs }]}>
          <IconButton
            icon={X}
            label="Close photo"
            color={colors.white}
            onPress={onClose}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  section: { gap: space.sm },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: space.xs },
  thumb: { width: '31.5%', aspectRatio: 1, backgroundColor: colors.muted },
  fill: { flex: 1 },
  viewer: { flex: 1, backgroundColor: colors.overlay },
  close: { position: 'absolute', right: space.sm },
});
