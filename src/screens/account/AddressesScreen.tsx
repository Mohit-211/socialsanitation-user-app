import React from 'react';
import { StyleSheet, View } from 'react-native';
import { getAddresses } from '../../api/addresses';
import AppText from '../../components/AppText';
import Button from '../../components/Button';
import Card from '../../components/Card';
import EmptyState from '../../components/EmptyState';
import Header from '../../components/Header';
import Loadable from '../../components/Loadable';
import Screen from '../../components/Screen';
import StatusPill from '../../components/StatusPill';
import { MapPin, Plus } from '../../components/icons';
import { useRequest } from '../../hooks/useRequest';
import type { RootScreenProps } from '../../navigation/types';
import { colors, space } from '../../theme';

export default function AddressesScreen({
  navigation,
}: RootScreenProps<'Addresses'>) {
  const addresses = useRequest(getAddresses);
  return (
    <Screen
      header={<Header title="Addresses" />}
      refreshing={addresses.refreshing}
      onRefresh={addresses.refresh}
      footer={
        <Button
          title="Add an address"
          icon={Plus}
          onPress={() => navigation.navigate('AddressForm')}
        />
      }
    >
      <Loadable {...addresses}>
        {items =>
          items.length === 0 ? (
            <EmptyState
              icon={MapPin}
              title="No addresses yet"
              message="Add the places you'd like cleaned. We work across the US and Canada."
            />
          ) : (
            items.map(address => (
              <Card
                key={address.id}
                onPress={() =>
                  navigation.navigate('AddressForm', { id: address.id })
                }
                accessibilityLabel={`${address.label || 'Address'}, ${address.one_line}${address.is_primary ? ', main address' : ''}`}
              >
                <View style={styles.top}>
                  <AppText variant="heading" style={styles.fill}>
                    {address.label || 'Address'}
                  </AppText>
                  {address.is_primary ? (
                    <StatusPill label="Main" tone="success" />
                  ) : null}
                </View>
                <AppText variant="small" color={colors.foreground}>
                  {address.one_line}
                </AppText>
                {address.access_notes ? (
                  <AppText variant="caption">
                    Access: {address.access_notes}
                  </AppText>
                ) : null}
              </Card>
            ))
          )
        }
      </Loadable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  fill: { flex: 1 },
});
