import axios, { isAxiosError } from 'axios';
import { API_BASE_URL } from '../config/env';
import { sessionToken } from './session';

/** Every answer comes in this envelope; errors too, with `data: ""`. */
type Envelope<T> = {
  success: boolean;
  status: number;
  message: string;
  data: T;
};

/** What a write returns: its data, and the sentence the API wrote for the user. */
export type Reply<T> = { data: T; message: string };

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
  headers: { Accept: 'application/json' },
});

api.interceptors.request.use(config => {
  const token = sessionToken();
  if (token) {
    config.headers.set('x-access-token', token);
  }
  return config;
});

let onSessionEnded: ((message: string) => void) | null = null;

/** Called when the API rejects the session (signed out elsewhere, expired, or deleted). */
export function setSessionEndedHandler(
  handler: ((message: string) => void) | null,
) {
  onSessionEnded = handler;
}

api.interceptors.response.use(undefined, error => {
  if (
    isAxiosError<Envelope<unknown>>(error) &&
    error.response?.status === 401 &&
    sessionToken()
  ) {
    onSessionEnded?.(
      error.response.data?.message ||
        'Your session has ended. Please sign in again.',
    );
  }
  return Promise.reject(error);
});

type Params = Record<string, string | number | undefined>;

export const http = {
  get: async <T>(url: string, params?: Params): Promise<T> =>
    (await api.get<Envelope<T>>(url, { params })).data.data,
  post: async <T = null>(url: string, body: object = {}): Promise<Reply<T>> => {
    const { data } = await api.post<Envelope<T>>(url, body);
    return { data: data.data, message: data.message };
  },
  patch: async <T>(url: string, body: object): Promise<Reply<T>> => {
    const { data } = await api.patch<Envelope<T>>(url, body);
    return { data: data.data, message: data.message };
  },
  delete: async (url: string): Promise<Reply<null>> => {
    const { data } = await api.delete<Envelope<null>>(url);
    return { data: data.data, message: data.message };
  },
};
