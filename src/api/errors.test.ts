import { AxiosError, AxiosHeaders } from 'axios';
import { errorMessage } from './errors';

const failed = (status: number, data: unknown) =>
  new AxiosError('failed', 'ERR_BAD_REQUEST', undefined, undefined, {
    status,
    statusText: '',
    headers: {},
    config: { headers: new AxiosHeaders() },
    data,
  });

describe('errorMessage', () => {
  it("shows the API's message", () => {
    expect(
      errorMessage(
        failed(400, {
          success: false,
          message: 'Invalid OTP Entered',
          data: '',
        }),
      ),
    ).toBe('Invalid OTP Entered');
  });

  it('falls back when the API sent no message', () => {
    expect(errorMessage(failed(502, '<html>Bad gateway</html>'))).toBe(
      'Something went wrong. Please try again.',
    );
  });

  it('tells the user when there is no connection or the server is slow', () => {
    expect(
      errorMessage(new AxiosError('Network Error', 'ERR_NETWORK')),
    ).toMatch("Can't reach");
    expect(errorMessage(new AxiosError('timeout', 'ECONNABORTED'))).toMatch(
      'took too long',
    );
  });

  it('handles errors that are not from the API', () => {
    expect(errorMessage(new Error('boom'))).toBe(
      'Something went wrong. Please try again.',
    );
  });
});
