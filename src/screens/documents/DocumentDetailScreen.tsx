import React, { useCallback, useEffect, useEffectEvent, useState } from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import { getDocument, startSigning } from '../../api/documents';
import { errorMessage } from '../../api/errors';
import type { DocumentDetail } from '../../api/types';
import AppText from '../../components/AppText';
import Bullet from '../../components/Bullet';
import Button from '../../components/Button';
import Card from '../../components/Card';
import DetailRow from '../../components/DetailRow';
import Eyebrow from '../../components/Eyebrow';
import Header from '../../components/Header';
import Heading from '../../components/Heading';
import Loadable from '../../components/Loadable';
import Notice from '../../components/Notice';
import Screen from '../../components/Screen';
import StatusPill from '../../components/StatusPill';
import { notify } from '../../components/Toaster';
import { CreditCard, ExternalLink, PenLine } from '../../components/icons';
import { useRequest } from '../../hooks/useRequest';
import type { RootScreenProps } from '../../navigation/types';
import { space } from '../../theme';
import {
  formatDate,
  formatDatesInText,
  formatDateTime,
} from '../../utils/date';
import { formatMoney } from '../../utils/format';
import { documentStatus, timelineStep } from '../../utils/status';

type Fact = { label: string; value: string | number | null | undefined };

const money = (amount: number | null | undefined) =>
  typeof amount === 'number' ? formatMoney(amount) : null;
const day = (value: string | null) => (value ? formatDate(value) : null);

/** The facts each kind of document carries, in the order a client reads them. */
function factsOf(document: DocumentDetail): Fact[] {
  switch (document.kind) {
    case 'estimate':
      return [
        { label: 'Frequency', value: document.frequency },
        { label: 'Total', value: money(document.total_price) },
      ];
    case 'quote':
      return [
        { label: 'Reference', value: document.ref_no },
        {
          label: 'Service dates',
          value:
            document.service_dates && formatDatesInText(document.service_dates),
        },
        { label: 'Due', value: day(document.due_date) },
        { label: 'Total', value: money(document.total_due) },
      ];
    case 'service_request':
      return [
        { label: 'Reference', value: document.ref_no },
        { label: 'Service days', value: document.service_days },
        { label: 'Due', value: day(document.due_date) },
        { label: 'Total', value: money(document.total_due) },
      ];
    case 'contract':
      return [
        { label: 'Contract date', value: day(document.contract_date) },
        { label: 'Service address', value: document.service_address },
        { label: 'Monthly price', value: money(document.total_monthly_price) },
      ];
    case 'invoice':
      return [
        { label: 'Invoice', value: document.ref_no },
        { label: 'For', value: document.event_name },
        { label: 'Billed', value: day(document.billing_date) },
        { label: 'Due', value: day(document.due_date) },
        {
          label: 'Service dates',
          value:
            document.service_dates && formatDatesInText(document.service_dates),
        },
        { label: 'Total', value: money(document.total_due) },
        { label: 'Due now', value: money(document.amount_due_now) },
      ];
    case 'client_sheet': {
      const floors = [
        ['Carpet', document.carpet_percentage],
        ['Concrete', document.concrete_percentage],
        ['VCT or LVT', document.vct_lvt_percentage],
        ['Tile', document.tile_percentage],
      ]
        .filter(([, share]) => typeof share === 'number' && share > 0)
        .map(([name, share]) => `${name} ${share}%`)
        .join(', ');
      return [
        { label: 'Address', value: document.address?.one_line },
        {
          label: 'Estimated size',
          value: document.estimated_sqft
            ? `${document.estimated_sqft} sq ft`
            : null,
        },
        {
          label: 'Walk-through',
          value:
            typeof document.walkaround_minutes === 'number'
              ? `${document.walkaround_minutes} minutes`
              : null,
        },
        { label: 'Service days', value: document.service_days },
        { label: 'Floors', value: floors },
      ];
    }
    case 'scope_of_work':
      return [
        { label: 'Visit frequency', value: document.visit_frequency },
        { label: 'Service days', value: document.service_days },
        { label: 'Service time', value: document.service_time },
        { label: 'Crew size', value: document.crew_size },
        { label: 'Hours per visit', value: document.hours_per_visit },
        { label: 'Notes', value: document.notes },
      ];
  }
}

const filesOf = (document: DocumentDetail) => {
  const file = 'file_url' in document ? document.file_url : null;
  const signed =
    'signed_file_url' in document ? document.signed_file_url : null;
  return { file, signed: signed && signed !== file ? signed : null };
};

const open = (url: string) =>
  Linking.openURL(url).catch(() => notify.error("Couldn't open the link."));

export default function DocumentDetailScreen({
  navigation,
  route,
}: RootScreenProps<'DocumentDetail'>) {
  const { kind, id, justSigned } = route.params;
  const document = useRequest(
    useCallback(() => getDocument(kind, id), [kind, id]),
  );
  const [signing, setSigning] = useState(false);

  // DocuSign tells the server about a signature a little after the page closes, so look again.
  const refreshLater = useEffectEvent(() => document.refresh());
  useEffect(() => {
    if (!justSigned) {
      return;
    }
    const timer = setTimeout(refreshLater, 5000);
    return () => clearTimeout(timer);
  }, [justSigned]);

  const sign = async () => {
    setSigning(true);
    try {
      const { data, message } = await startSigning(kind, id);
      if (data.url) {
        navigation.navigate('SignDocument', { kind, id, url: data.url });
      } else {
        notify.info(message || 'We emailed you the signing link.');
      }
    } catch (e) {
      notify.error(errorMessage(e));
    } finally {
      setSigning(false);
    }
  };

  // Only invoices are paid in the app: a quote is paid through the invoice made from it.
  const data = document.data;
  const payUrl = data?.kind === 'invoice' ? data.pay_url : null;
  const amount = data?.kind === 'invoice' ? data.amount_due_now : null;

  return (
    <Screen
      header={<Header title={data?.kind_name ?? 'Document'} />}
      refreshing={document.refreshing}
      onRefresh={document.refresh}
      footer={
        data?.can_sign ? (
          <Button
            title="Review and sign"
            icon={PenLine}
            onPress={sign}
            loading={signing}
          />
        ) : payUrl ? (
          <Button
            title={
              typeof amount === 'number' && amount > 0
                ? `Pay ${formatMoney(amount)}`
                : 'Pay now'
            }
            icon={CreditCard}
            onPress={() => open(payUrl)}
          />
        ) : undefined
      }
    >
      <Loadable {...document}>
        {doc => {
          const facts = factsOf(doc).filter(
            fact =>
              fact.value !== null &&
              fact.value !== undefined &&
              fact.value !== '',
          );
          const files = filesOf(doc);
          return (
            <>
              <View style={styles.section}>
                <Heading
                  eyebrow={doc.kind_name}
                  title={doc.title}
                  size="display"
                />
                {doc.status ? (
                  <StatusPill {...documentStatus(doc.status)} />
                ) : null}
                <AppText variant="caption">
                  Shared {formatDate(doc.shared_at)}
                </AppText>
              </View>

              {justSigned && doc.status === 'awaiting_signature' ? (
                <Notice tone="success" title="Thanks for signing">
                  It can take a minute for the document to show as signed. Pull
                  down to refresh.
                </Notice>
              ) : null}
              {payUrl ? (
                <Notice>
                  Paying opens Square's secure checkout in your browser. Square
                  adds sales tax and lets you add a tip.
                </Notice>
              ) : null}

              {facts.length > 0 ? (
                <Card>
                  {facts.map(fact => (
                    <DetailRow
                      key={fact.label}
                      label={fact.label}
                      value={String(fact.value)}
                    />
                  ))}
                </Card>
              ) : null}

              {doc.kind === 'client_sheet' && doc.areas.length > 0 ? (
                <View style={styles.section}>
                  <Eyebrow>Areas</Eyebrow>
                  {doc.areas.map(area => {
                    const counts = [
                      ['desks and bins', area.num_desks_trash_cans],
                      ['restrooms', area.restrooms],
                      ['stalls', area.stalls],
                      ['sinks', area.sinks],
                    ]
                      .filter(
                        ([, count]) => typeof count === 'number' && count > 0,
                      )
                      .map(([name, count]) => `${count} ${name}`)
                      .join(', ');
                    return (
                      <Card key={area.id}>
                        <AppText variant="bodyStrong">
                          {area.service_area || 'Area'}
                        </AppText>
                        {area.flooring_type ? (
                          <AppText variant="small">
                            Floor: {area.flooring_type}
                          </AppText>
                        ) : null}
                        {counts ? (
                          <AppText variant="small">{counts}</AppText>
                        ) : null}
                        {area.special_requests ? (
                          <AppText variant="small">
                            {area.special_requests}
                          </AppText>
                        ) : null}
                      </Card>
                    );
                  })}
                </View>
              ) : null}

              {doc.kind === 'scope_of_work'
                ? doc.sections.map(section => (
                    <View key={section.id} style={styles.section}>
                      <Eyebrow>{section.title}</Eyebrow>
                      {section.items.map(item => {
                        const often = [
                          item.is_daily && 'daily',
                          item.is_weekly && 'weekly',
                          item.is_monthly && 'monthly',
                        ]
                          .filter(Boolean)
                          .join(', ');
                        return (
                          <Bullet key={item.id}>
                            {often
                              ? `${item.description} (${often})`
                              : item.description}
                          </Bullet>
                        );
                      })}
                    </View>
                  ))
                : null}

              {files.file || files.signed ? (
                <View style={styles.section}>
                  {files.file ? (
                    <Button
                      title="Open the PDF"
                      icon={ExternalLink}
                      variant="outline"
                      onPress={() => open(files.file!)}
                    />
                  ) : null}
                  {files.signed ? (
                    <Button
                      title="Open the signed copy"
                      icon={ExternalLink}
                      variant="outline"
                      onPress={() => open(files.signed!)}
                    />
                  ) : null}
                </View>
              ) : null}

              {doc.timeline.length > 0 ? (
                <View style={styles.section}>
                  <Eyebrow>History</Eyebrow>
                  {doc.timeline.map(step => (
                    <Bullet
                      key={`${step.step}-${step.at}`}
                    >{`${timelineStep(step.step)}, ${formatDateTime(step.at)}`}</Bullet>
                  ))}
                </View>
              ) : null}
            </>
          );
        }}
      </Loadable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  section: { gap: space.sm },
});
