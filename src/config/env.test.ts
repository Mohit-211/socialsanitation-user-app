import type * as Env from './env';

const FULL_CONFIG = {
  API_BASE_URL: 'https://api.example.test/api/v2',
  PRIVACY_POLICY_URL: 'https://example.test/privacy-policy',
};

// Loads ./env with react-native-config returning `config`, in a fresh module registry.
const loadEnv = (config: Record<string, string>) => {
  let env: typeof Env | undefined;
  jest.isolateModules(() => {
    jest.doMock('react-native-config', () => config);
    env = jest.requireActual<typeof Env>('./env');
  });
  return env as typeof Env;
};

describe('env', () => {
  it('reads the API address and privacy page from .env', () => {
    const env = loadEnv(FULL_CONFIG);
    expect(env.API_BASE_URL).toBe('https://api.example.test/api/v2');
    expect(env.PRIVACY_POLICY_URL).toBe('https://example.test/privacy-policy');
  });

  it('drops a trailing slash from the API address', () => {
    const env = loadEnv({
      ...FULL_CONFIG,
      API_BASE_URL: 'https://api.example.test/api/v2/',
    });
    expect(env.API_BASE_URL).toBe('https://api.example.test/api/v2');
  });

  it('stops with a clear message when a value is missing', () => {
    expect(() =>
      loadEnv({ PRIVACY_POLICY_URL: FULL_CONFIG.PRIVACY_POLICY_URL }),
    ).toThrow('API_BASE_URL is missing');
    expect(() => loadEnv({ API_BASE_URL: FULL_CONFIG.API_BASE_URL })).toThrow(
      'PRIVACY_POLICY_URL is missing',
    );
  });
});
