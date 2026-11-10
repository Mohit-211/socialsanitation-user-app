import React from 'react';
import { Alert, Image, StyleSheet, View } from 'react-native';
import { getProfile } from '../../api/account';
import AppText from '../../components/AppText';
import Eyebrow from '../../components/Eyebrow';
import Heading from '../../components/Heading';
import ListRow from '../../components/ListRow';
import Notice from '../../components/Notice';
import Screen from '../../components/Screen';
import {
  Bell,
  ClipboardList,
  Info,
  KeyRound,
  LogOut,
  MapPin,
  MessageCircleQuestionMark,
  ScrollText,
  ShieldCheck,
  Trash2,
  UserCog,
} from '../../components/icons';
import { useRequest } from '../../hooks/useRequest';
import type { TabScreenProps } from '../../navigation/types';
import { useSession } from '../../session/SessionProvider';
import { colors, fonts, space, styles as theme } from '../../theme';
import { formatPhone, initials } from '../../utils/format';

export default function AccountScreen({
  navigation,
}: TabScreenProps<'Account'>) {
  const profile = useRequest(getProfile);
  const { signOut } = useSession();
  const me = profile.data;

  const confirmSignOut = () =>
    Alert.alert('Sign out?', 'You can sign back in at any time.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign out', style: 'destructive', onPress: signOut },
    ]);

  return (
    <Screen
      inTabs
      refreshing={profile.refreshing}
      onRefresh={profile.refresh}
      contentStyle={styles.content}
    >
      <View style={styles.gutter}>
        <Heading eyebrow="Your account" title="Account" size="display" />
      </View>

      {me ? (
        <View style={[styles.gutter, styles.profile]}>
          {me.image_url ? (
            <Image
              source={{ uri: me.image_url }}
              style={styles.avatar}
              accessibilityIgnoresInvertColors
            />
          ) : (
            <View style={[styles.avatar, styles.initials]}>
              <AppText style={styles.initialsText}>
                {initials(me.name || me.email)}
              </AppText>
            </View>
          )}
          <View style={styles.fill}>
            {me.name ? <AppText variant="heading">{me.name}</AppText> : null}
            <AppText variant="small">{me.email}</AppText>
            {me.mobile ? (
              <AppText variant="small">{formatPhone(me.mobile)}</AppText>
            ) : null}
          </View>
        </View>
      ) : profile.error ? (
        <View style={styles.gutter}>
          <Notice tone="danger">
            Couldn't load your details. Pull down to try again.
          </Notice>
        </View>
      ) : null}

      <Group title="Your details">
        <ListRow
          icon={MapPin}
          title="Addresses"
          subtitle="Where we clean"
          onPress={() => navigation.navigate('Addresses')}
        />
        <ListRow
          icon={UserCog}
          title="Account changes"
          subtitle="Ask the office to change your name, email or phone"
          onPress={() => navigation.navigate('AccountRequests')}
        />
        <ListRow
          icon={KeyRound}
          title="Change password"
          onPress={() => navigation.navigate('ChangePassword')}
        />
      </Group>

      <Group title="Services">
        <ListRow
          icon={ClipboardList}
          title="Enquiries"
          subtitle="Services you've asked about"
          onPress={() => navigation.navigate('Enquiries')}
        />
        <ListRow
          icon={Bell}
          title="Notifications"
          onPress={() => navigation.navigate('Notifications')}
        />
      </Group>

      <Group title="Social Sanitation">
        <ListRow
          icon={MessageCircleQuestionMark}
          title="Help and contact"
          onPress={() => navigation.navigate('Help')}
        />
        <ListRow
          icon={Info}
          title="About us"
          onPress={() => navigation.navigate('Content', { kind: 'about' })}
        />
        <ListRow
          icon={ScrollText}
          title="Terms and conditions"
          onPress={() => navigation.navigate('Content', { kind: 'terms' })}
        />
        <ListRow
          icon={ShieldCheck}
          title="Privacy policy"
          onPress={() => navigation.navigate('PrivacyPolicy')}
        />
      </Group>

      <Group>
        <ListRow
          icon={LogOut}
          title="Sign out"
          destructive
          onPress={confirmSignOut}
        />
        <ListRow
          icon={Trash2}
          title="Delete account"
          destructive
          onPress={() =>
            navigation.navigate('AccountRequestForm', {
              kind: 'delete_account',
            })
          }
        />
      </Group>
    </Screen>
  );
}

/** A titled block of rows, edge to edge, with hairlines between them. */
function Group({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  const rows = React.Children.toArray(children);
  return (
    <View style={styles.group}>
      {title ? (
        <View style={styles.gutter}>
          <Eyebrow>{title}</Eyebrow>
        </View>
      ) : null}
      <View style={styles.rows}>
        {rows.map((row, index) => (
          <React.Fragment key={index}>
            {index > 0 ? (
              <View style={[theme.hairline, styles.divider]} />
            ) : null}
            {row}
          </React.Fragment>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 0 },
  gutter: { paddingHorizontal: space.gutter },
  profile: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  avatar: { width: 64, height: 64, backgroundColor: colors.muted },
  initials: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.brandWash,
  },
  initialsText: { fontFamily: fonts.display, fontSize: 22, lineHeight: 28 },
  fill: { flex: 1, gap: 2 },
  group: { gap: space.xs },
  rows: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  divider: { marginLeft: space.gutter + 40 + space.md },
});
