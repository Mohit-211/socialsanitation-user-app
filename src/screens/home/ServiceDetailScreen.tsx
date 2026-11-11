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
import RichText from '../../components/RichText';
import Screen from '../../components/Screen';
import { useRequest } from '../../hooks/useRequest';
import type { RootScreenProps } from '../../navigation/types';
import { space } from '../../theme';

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
            <Heading eyebrow="Service" title={data.name} size="display" />
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
          </>
        )}
      </Loadable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  section: { gap: space.sm },
});
