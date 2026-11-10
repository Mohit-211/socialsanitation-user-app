import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { getProfile } from '../../api/account';
import { getDocuments } from '../../api/documents';
import { unreadCount } from '../../api/notifications';
import { getServices } from '../../api/site';
import { getVisits } from '../../api/visits';
import AppText from '../../components/AppText';
import Button from '../../components/Button';
import Card from '../../components/Card';
import DocumentCard from '../../components/DocumentCard';
import Eyebrow from '../../components/Eyebrow';
import Heading from '../../components/Heading';
import IconButton from '../../components/IconButton';
import LinkButton from '../../components/LinkButton';
import Rating from '../../components/Rating';
import Screen from '../../components/Screen';
import VisitCard from '../../components/VisitCard';
import { Bell, Plus } from '../../components/icons';
import { useRequest, type Request } from '../../hooks/useRequest';
import type { TabScreenProps } from '../../navigation/types';
import { colors, space } from '../../theme';
import { htmlToText } from '../../utils/html';
import { needsAction } from '../../utils/status';

const nextVisit = async () =>
  (await getVisits('UPCOMING', 1, 1)).items[0] ?? null;

const greeting = () => {
  const hour = new Date().getHours();
  return hour < 12
    ? 'Good morning'
    : hour < 17
      ? 'Good afternoon'
      : 'Good evening';
};

export default function HomeScreen({ navigation }: TabScreenProps<'Home'>) {
  const profile = useRequest(getProfile);
  const visit = useRequest(nextVisit);
  const documents = useRequest(getDocuments);
  const services = useRequest(getServices);
  const unread = useRequest(unreadCount);
  const all = [profile, visit, documents, services, unread];

  const firstName = profile.data?.name?.trim().split(/\s+/)[0];
  const toDo = (documents.data ?? []).filter(document =>
    needsAction(document.status),
  );

  return (
    <Screen
      inTabs
      refreshing={all.some(request => request.refreshing)}
      onRefresh={() => all.forEach(request => request.refresh())}
    >
      <View style={styles.top}>
        <View style={styles.fill}>
          <Heading
            eyebrow={greeting()}
            title={firstName || 'Welcome'}
            size="display"
          />
        </View>
        <IconButton
          icon={Bell}
          label="Notifications"
          badge={unread.data}
          onPress={() => navigation.navigate('Notifications')}
        />
      </View>

      <View style={styles.section}>
        <Eyebrow>Next visit</Eyebrow>
        <Section request={visit}>
          {next =>
            next ? (
              <VisitCard
                visit={next}
                onPress={() =>
                  navigation.navigate('VisitDetail', { id: next.id })
                }
              />
            ) : (
              <Card>
                <AppText variant="heading">No visits booked</AppText>
                <AppText variant="small">
                  Tell us what you need and the office will get back to you with
                  a quote and a date.
                </AppText>
              </Card>
            )
          }
        </Section>
      </View>

      <Button
        title="Request a service"
        icon={Plus}
        onPress={() => navigation.navigate('EnquiryForm')}
      />

      {toDo.length > 0 ? (
        <View style={styles.section}>
          <Heading
            eyebrow="Needs your attention"
            title={
              toDo.length === 1 ? '1 document' : `${toDo.length} documents`
            }
            action={
              <LinkButton
                title="See all"
                onPress={() => navigation.navigate('Documents')}
              />
            }
          />
          {toDo.slice(0, 3).map(document => (
            <DocumentCard
              key={`${document.kind}-${document.id}`}
              document={document}
              onPress={() =>
                navigation.navigate('DocumentDetail', {
                  kind: document.kind,
                  id: document.id,
                })
              }
            />
          ))}
        </View>
      ) : null}

      <View style={styles.section}>
        <Heading eyebrow="What we do" title="Our services" />
        <Section request={services}>
          {items =>
            items.map(service => (
              <Card
                key={service.id}
                onPress={() =>
                  navigation.navigate('ServiceDetail', {
                    id: service.id,
                    name: service.name,
                  })
                }
                accessibilityLabel={service.name}
              >
                <AppText variant="heading">{service.name}</AppText>
                <Rating
                  average={service.average_rating}
                  count={service.rating}
                />
                {service.description ? (
                  <AppText variant="small" numberOfLines={2}>
                    {htmlToText(service.description)}
                  </AppText>
                ) : null}
              </Card>
            ))
          }
        </Section>
      </View>
    </Screen>
  );
}

/** One part of Home: a spinner, a short error with a retry, or its content. */
function Section<T>({
  request,
  children,
}: {
  request: Request<T>;
  children: (data: T) => React.ReactNode;
}) {
  if (request.data !== undefined) {
    return <>{children(request.data)}</>;
  }
  if (request.error === undefined) {
    return (
      <ActivityIndicator color={colors.foreground} style={styles.spinner} />
    );
  }
  return (
    <View style={styles.failed}>
      <AppText variant="small">Couldn't load this.</AppText>
      <LinkButton title="Try again" onPress={request.reload} />
    </View>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'flex-start', gap: space.sm },
  fill: { flex: 1 },
  section: { gap: space.sm },
  spinner: { marginVertical: space.lg },
  failed: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
});
