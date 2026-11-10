// Enquiries: how a client asks for a service. The office follows up; the app can't book visits.
import { http } from './client';
import type { Enquiry, EnquiryInput, Paged } from './types';

export const sendEnquiry = ({ address_id, ...body }: EnquiryInput) =>
  // address_id is left out rather than sent as null, which the API would reject.
  http.post<Enquiry>(
    '/client/enquiries',
    address_id === null ? body : { ...body, address_id },
  );

export const getEnquiries = (page: number) =>
  http.get<Paged<Enquiry>>('/client/enquiries', { page });
