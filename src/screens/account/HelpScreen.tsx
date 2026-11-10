import React, { useState } from 'react';
import { Linking, Pressable, StyleSheet, View } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import { getContact, getFaqs } from '../../api/site';
import AppText from '../../components/AppText';
import Card from '../../components/Card';
import Header from '../../components/Header';
import Heading from '../../components/Heading';
import Loadable from '../../components/Loadable';
import RichText from '../../components/RichText';
import Screen from '../../components/Screen';
import { notify } from '../../components/Toaster';
import {
  ChevronDown,
  ChevronUp,
  Mail,
  MapPin,
  Phone,
} from '../../components/icons';
import { useRequest } from '../../hooks/useRequest';
import { colors, space } from '../../theme';
import { formatPhone } from '../../utils/format';

const loadHelp = async () => {
  const [contact, faqs] = await Promise.all([getContact(), getFaqs()]);
  return { contact, faqs };
};

const open = (url: string) =>
  Linking.openURL(url).catch(() =>
    notify.error('No app on this phone can open that.'),
  );

export default function HelpScreen() {
  const help = useRequest(loadHelp);
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <Screen
      header={<Header title="Help and contact" />}
      refreshing={help.refreshing}
      onRefresh={help.refresh}
    >
      <Loadable {...help}>
        {({ contact, faqs }) => (
          <>
            <View style={styles.section}>
              <Heading eyebrow="Talk to us" title="Contact the office" />
              {contact?.contact_number ? (
                <ContactCard
                  icon={Phone}
                  title="Call us"
                  value={formatPhone(contact.contact_number)}
                  onPress={() =>
                    open(
                      `tel:${contact.contact_number!.replace(/[^\d+]/g, '')}`,
                    )
                  }
                />
              ) : null}
              {contact?.email ? (
                <ContactCard
                  icon={Mail}
                  title="Email us"
                  value={contact.email}
                  onPress={() => open(`mailto:${contact.email}`)}
                />
              ) : null}
              {contact?.address ? (
                <ContactCard
                  icon={MapPin}
                  title="Our office"
                  value={contact.address}
                />
              ) : null}
              {!contact?.contact_number &&
              !contact?.email &&
              !contact?.address ? (
                <AppText variant="small">
                  The office's contact details aren't available right now.
                </AppText>
              ) : null}
            </View>

            {faqs.length > 0 ? (
              <View style={styles.section}>
                <Heading eyebrow="Answers" title="Frequently asked questions" />
                {faqs.map(faq => {
                  const isOpen = expanded === faq.id;
                  const Chevron = isOpen ? ChevronUp : ChevronDown;
                  return (
                    <Card key={faq.id}>
                      <Pressable
                        accessibilityRole="button"
                        accessibilityState={{ expanded: isOpen }}
                        onPress={() => setExpanded(isOpen ? null : faq.id)}
                        style={styles.question}
                      >
                        <AppText variant="bodyStrong" style={styles.fill}>
                          {faq.question}
                        </AppText>
                        <Chevron size={20} color={colors.mutedForeground} />
                      </Pressable>
                      {isOpen ? <RichText html={faq.answer} /> : null}
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

function ContactCard({
  icon: Icon,
  title,
  value,
  onPress,
}: {
  icon: LucideIcon;
  title: string;
  value: string;
  onPress?: () => void;
}) {
  return (
    <Card onPress={onPress} accessibilityLabel={`${title}: ${value}`}>
      <View style={styles.contact}>
        <View style={styles.icon}>
          <Icon size={20} color={colors.foreground} />
        </View>
        <View style={styles.fill}>
          <AppText variant="eyebrow">{title}</AppText>
          <AppText variant="bodyStrong">{value}</AppText>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  section: { gap: space.sm },
  question: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    minHeight: 32,
  },
  contact: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  icon: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.brandWash,
  },
  fill: { flex: 1 },
});
