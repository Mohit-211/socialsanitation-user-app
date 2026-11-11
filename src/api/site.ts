// Public content shared with the website: the services.
import { http } from './client';
import type { Service, ServiceDetail } from './types';

export const getServices = async () =>
  (await http.get<{ items: Service[] }>('/web/services')).items;

export const getService = (id: number) =>
  http.get<ServiceDetail>(`/web/services/${id}`);
