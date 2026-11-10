import { isAxiosError } from 'axios';

const OFFLINE =
  "Can't reach Social Sanitation. Check your connection and try again.";
const SLOW = 'The server took too long to answer. Please try again.';
const UNKNOWN = 'Something went wrong. Please try again.';

/** A sentence to show the user for a failed request: the API's own message when it sent one. */
export function errorMessage(error: unknown): string {
  if (!isAxiosError<{ message?: unknown }>(error)) {
    return UNKNOWN;
  }
  if (!error.response) {
    return error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT'
      ? SLOW
      : OFFLINE;
  }
  const message = error.response.data?.message;
  return typeof message === 'string' && message.trim() ? message : UNKNOWN;
}
