// Visits (bookings in the API). The client can read them and ask the office to cancel one.
import { http } from './client';
import type { Paged, Visit, VisitRow } from './types';

/** UPCOMING: today on, still to happen. COMPLETED: past, done, cancelled or declined. */
export type VisitFilter = 'UPCOMING' | 'COMPLETED';

export const getVisits = (filter: VisitFilter, page: number, limit = 20) =>
  http.get<Paged<VisitRow>>('/client/bookings', {
    booking_status: filter,
    page,
    limit,
  });

export const getVisit = (id: number) =>
  http.get<Visit>(`/client/bookings/${id}`);

/** The visit stays as it is until the office cancels it, moves it, or declines the request. */
export const requestCancellation = (id: number, reason: string | null) =>
  http.post<Visit>(`/client/bookings/${id}/cancel-request`, { reason });
