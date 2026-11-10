import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { getDocuments } from '../../api/documents';
import type { DocumentKind } from '../../api/types';
import DocumentCard from '../../components/DocumentCard';
import FilterChips from '../../components/FilterChips';
import Heading from '../../components/Heading';
import ListView from '../../components/ListView';
import Screen from '../../components/Screen';
import { FileText } from '../../components/icons';
import { useRequest } from '../../hooks/useRequest';
import type { TabScreenProps } from '../../navigation/types';
import { space } from '../../theme';
import { needsAction } from '../../utils/status';

type Filter = 'all' | 'action' | DocumentKind;

// The kinds in the order clients look for them, with their names as filters.
const KINDS: { value: DocumentKind; label: string }[] = [
  { value: 'invoice', label: 'Invoices' },
  { value: 'quote', label: 'Quotes' },
  { value: 'estimate', label: 'Estimates' },
  { value: 'contract', label: 'Contracts' },
  { value: 'service_request', label: 'Service requests' },
  { value: 'scope_of_work', label: 'Scopes of work' },
  { value: 'client_sheet', label: 'Client sheets' },
];

export default function DocumentsScreen({
  navigation,
}: TabScreenProps<'Documents'>) {
  const documents = useRequest(getDocuments);
  const [filter, setFilter] = useState<Filter>('all');
  const all = documents.data ?? [];

  // Only filters that would show something.
  const filters: { value: Filter; label: string }[] = [
    { value: 'all', label: 'All' },
    ...(all.some(document => needsAction(document.status))
      ? [{ value: 'action' as const, label: 'Needs action' }]
      : []),
    ...KINDS.filter(kind => all.some(document => document.kind === kind.value)),
  ];
  const shown =
    filter === 'all'
      ? all
      : filter === 'action'
        ? all.filter(document => needsAction(document.status))
        : all.filter(document => document.kind === filter);

  return (
    <Screen scroll={false} inTabs>
      <ListView
        inTabs
        list={{ ...documents, items: shown }}
        keyOf={document => `${document.kind}-${document.id}`}
        header={
          <View style={styles.header}>
            <Heading
              eyebrow="Shared with you"
              title="Documents"
              size="display"
            />
            {filters.length > 2 ? (
              <FilterChips
                options={filters}
                value={filter}
                onChange={setFilter}
              />
            ) : null}
          </View>
        }
        empty={
          filter === 'all'
            ? {
                icon: FileText,
                title: 'No documents yet',
                message:
                  'Estimates, contracts and invoices the office shares with you show up here.',
              }
            : {
                icon: FileText,
                title: 'Nothing here',
                action: { title: 'Show all', onPress: () => setFilter('all') },
              }
        }
        renderItem={document => (
          <DocumentCard
            document={document}
            onPress={() =>
              navigation.navigate('DocumentDetail', {
                kind: document.kind,
                id: document.id,
              })
            }
          />
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { gap: space.lg, marginBottom: space.lg },
});
