import React from 'react';
import { StyleSheet, View } from 'react-native';
import AppText from './AppText';
import Card from './Card';
import StatusPill from './StatusPill';
import type { DocumentRow } from '../api/types';
import { space } from '../theme';
import { formatDate } from '../utils/date';
import { documentStatus } from '../utils/status';

export default function DocumentCard({
  document,
  onPress,
}: {
  document: DocumentRow;
  onPress: () => void;
}) {
  const status = document.status ? documentStatus(document.status) : null;
  return (
    <Card
      onPress={onPress}
      accessibilityLabel={[document.kind_name, document.title, status?.label]
        .filter(Boolean)
        .join(', ')}
    >
      <View style={styles.top}>
        <AppText variant="eyebrow" style={styles.kind}>
          {document.kind_name}
        </AppText>
        {status ? <StatusPill {...status} /> : null}
      </View>
      <AppText variant="heading">{document.title}</AppText>
      <AppText variant="caption">
        Shared {formatDate(document.shared_at)}
      </AppText>
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
  kind: { flex: 1 },
});
