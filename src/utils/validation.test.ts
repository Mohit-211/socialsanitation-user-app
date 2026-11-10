import { EMAIL, isValidPassword, postalCodeError } from './validation';

describe('isValidPassword', () => {
  it.each(['NewPass12', '12345678', 'a1b2c3d4'])('accepts %s', value => {
    expect(isValidPassword(value)).toBe(true);
  });

  it.each([
    'short12',
    'NoDigitsHere',
    'OneDigit1',
    'has space12',
    'Passw0rd',
    'Password123',
  ])('rejects %s', value => {
    expect(isValidPassword(value)).toBe(false);
  });
});

describe('postalCodeError', () => {
  it('checks US ZIP codes', () => {
    expect(postalCodeError('US', '33602')).toBeNull();
    expect(postalCodeError('US', '33602-1234')).toBeNull();
    expect(postalCodeError('US', '3360')).toMatch('ZIP');
  });

  it('checks Canadian postal codes, with or without the space', () => {
    expect(postalCodeError('CA', 'M5V 2T6')).toBeNull();
    expect(postalCodeError('CA', 'm5v2t6')).toBeNull();
    expect(postalCodeError('CA', '33602')).toMatch('postal code');
  });
});

describe('EMAIL', () => {
  it('matches ordinary addresses only', () => {
    expect(EMAIL.test('cora@example.com')).toBe(true);
    expect(EMAIL.test('cora@example')).toBe(false);
  });
});
