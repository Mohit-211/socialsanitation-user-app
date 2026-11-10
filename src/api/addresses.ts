// The client's addresses, and the place lists the address form picks from (US and Canada only).
import { http } from './client';
import type { Address, AddressInput, Paged, Place } from './types';

export const getAddresses = async () =>
  (await http.get<{ items: Address[] }>('/client/addresses')).items;

export const getAddress = (id: number) =>
  http.get<Address>(`/client/addresses/${id}`);

export const addAddress = (body: AddressInput) =>
  http.post<Address>('/client/addresses', body);

export const updateAddress = (id: number, body: AddressInput) =>
  http.patch<Address>(`/client/addresses/${id}`, body);

export const makePrimary = (id: number) =>
  http.post<Address>(`/client/addresses/${id}/primary`);

/** Refused while upcoming visits still use the address. */
export const deleteAddress = (id: number) =>
  http.delete(`/client/addresses/${id}`);

export const getCountries = async () =>
  (await http.get<Paged<Place>>('/web/countries', { limit: 500 })).items.filter(
    country => country.code === 'US' || country.code === 'CA',
  );

export const getStates = async (countryId: number) =>
  (
    await http.get<Paged<Place>>('/web/states', {
      country_id: countryId,
      limit: 500,
    })
  ).items;

/** A state can have thousands of cities, so the picker searches instead of listing them all. */
export const findCities = async (stateId: number, search: string) =>
  (
    await http.get<Paged<Place>>('/web/cities', {
      state_id: stateId,
      search: search.trim() || undefined,
      limit: 50,
    })
  ).items;
