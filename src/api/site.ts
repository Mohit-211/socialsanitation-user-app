// Public content shared with the website: services, About us, terms, FAQs and contact details.
import { http } from './client';
import type {
  ContactDetails,
  ContentSection,
  Faq,
  Service,
  ServiceDetail,
} from './types';

export const getServices = async () =>
  (await http.get<{ items: Service[] }>('/web/services')).items;

export const getService = (id: number) =>
  http.get<ServiceDetail>(`/web/services/${id}`);

export const getAbout = async () =>
  (await http.get<{ items: ContentSection[] }>('/web/about-us')).items;

export const getTerms = async () =>
  (await http.get<{ items: ContentSection[] }>('/web/terms')).items;

export const getFaqs = async () =>
  (await http.get<{ items: Faq[] }>('/web/faqs')).items;

export const getContact = async () =>
  (await http.get<{ items: ContactDetails[] }>('/web/contact-us')).items[0] ??
  null;
