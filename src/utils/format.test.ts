import { formatMoney, formatPhone, initials } from './format';

describe('formatMoney', () => {
  it('shows dollars and cents', () => {
    expect(formatMoney(900)).toBe('$900.00');
    expect(formatMoney(1234.5)).toBe('$1,234.50');
  });
});

describe('formatPhone', () => {
  it('formats North American numbers', () => {
    expect(formatPhone('8135550100')).toBe('(813) 555-0100');
    expect(formatPhone('+1 813-555-0100')).toBe('(813) 555-0100');
  });

  it('leaves other numbers as entered', () => {
    expect(formatPhone('+44 20 7946 0000')).toBe('+44 20 7946 0000');
  });
});

describe('initials', () => {
  it('takes the first letters of the first two words', () => {
    expect(initials('cora lee smith')).toBe('CL');
    expect(initials('  Cora ')).toBe('C');
  });
});
