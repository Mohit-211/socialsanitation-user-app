import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { getService } from '../../api/site';
import AppText from '../../components/AppText';
import Bullet from '../../components/Bullet';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Header from '../../components/Header';
import Heading from '../../components/Heading';
import Loadable from '../../components/Loadable';
import Rating from '../../components/Rating';
import RichText from '../../components/RichText';
import Screen from '../../components/Screen';
import { Star } from '../../components/icons';
import { useRequest } from '../../hooks/useRequest';
import type { RootScreenProps } from '../../navigation/types';
import { colors, space } from '../../theme';
import { formatDate } from '../../utils/date';

export default function ServiceDetailScreen({
  navigation,
  route,
}: RootScreenProps<'ServiceDetail'>) {
  const { id, name } = route.params;
  const service = useRequest(useCallback(() => getService(id), [id]));

  return (
    <Screen
      header={<Header title={name} />}
      refreshing={service.refreshing}
      onRefresh={service.refresh}
      footer={
        <Button
          title="Request this service"
          onPress={() => navigation.navigate('EnquiryForm', { serviceId: id })}
        />
      }
    >
      <Loadable {...service}>
        {data => (
          <>
            <View style={styles.section}>
              <Heading eyebrow="Service" title={data.name} size="display" />
              <Rating average={data.average_rating} count={data.rating} />
            </View>
            {data.description ? <RichText html={data.description} /> : null}

            {data.checklists.length > 0 ? (
              <View style={styles.section}>
                <Heading eyebrow="What's included" title="The checklist" />
                {data.checklists.map(group => (
                  <Card key={group.heading_id}>
                    <AppText variant="bodyStrong">
                      {group.heading_title}
                    </AppText>
                    {group.tasks.map(task => (
                      <Bullet key={task.id} variant="small">
                        {task.task}
                      </Bullet>
                    ))}
                  </Card>
                ))}
              </View>
            ) : null}

            {data.reviews.length > 0 ? (
              <View style={styles.section}>
                <Heading eyebrow="From our clients" title="Reviews" />
                {data.reviews.map(review => {
                  const stars = Math.round(Number(review.rating)) || 0;
                  return (
                    <Card key={review.id}>
                      <View
                        style={styles.stars}
                        accessibilityLabel={`${stars} out of 5 stars`}
                      >
                        {[1, 2, 3, 4, 5].map(n => (
                          <Star
                            key={n}
                            size={16}
                            color={n <= stars ? colors.warning : colors.border}
                            fill={n <= stars ? colors.warning : 'transparent'}
                          />
                        ))}
                      </View>
                      {review.review ? (
                        <AppText variant="body">{review.review}</AppText>
                      ) : null}
                      <AppText variant="caption">
                        {formatDate(review.created_at)}
                      </AppText>
                    </Card>
                  );
                })}
              </View>
            ) : null}
          </>
        )}
      </Loadable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  section: { gap: space.sm },
  stars: { flexDirection: 'row', gap: 2 },
});
