// The signed-in client's own account. The profile is read-only in the app: changes go to the
// office as profile requests.
import { http } from './client';
import type {
  Paged,
  Profile,
  ProfileRequest,
  ProfileRequestKind,
} from './types';

export const getProfile = () => http.get<Profile>('/client/profile');

export const logOut = () => http.post('/client/logout');

/** Ends every session, this one too, and returns the token that replaces it. */
export const changePassword = (body: {
  old_password: string;
  new_password: string;
  confirm_password: string;
}) =>
  http.post<{ token: string; expires_at: string }>(
    '/client/change-password',
    body,
  );

export const getProfileRequests = (page: number) =>
  http.get<Paged<ProfileRequest>>('/client/profile-requests', { page });

/** An open request of the same kind is updated rather than duplicated. */
export const sendProfileRequest = (
  kind: ProfileRequestKind,
  details: string | null,
) => http.post<ProfileRequest>('/client/profile-requests', { kind, details });
