import {
  formatDate,
  formatDatesInText,
  formatDateTime,
  formatDay,
  formatTime,
  formatTimeRange,
  greeting,
  todayInEastern,
  toApiDate,
} from './date';

describe('greeting', () => {
  // 12 Nov 2026 at the given hour, on the phone's clock.
  const at = (hour: number, minute = 0) => new Date(2026, 10, 12, hour, minute);

  it('says good morning from 5 AM until noon', () => {
    expect(greeting(at(5))).toBe('Good morning');
    expect(greeting(at(11, 59))).toBe('Good morning');
  });

  it('says good afternoon from noon until 5 PM', () => {
    expect(greeting(at(12))).toBe('Good afternoon');
    expect(greeting(at(16, 59))).toBe('Good afternoon');
  });

  it('says good evening from 5 PM through the night', () => {
    expect(greeting(at(17))).toBe('Good evening');
    expect(greeting(at(23, 30))).toBe('Good evening');
    expect(greeting(at(0, 15))).toBe('Good evening');
    expect(greeting(at(1, 45))).toBe('Good evening');
    expect(greeting(at(4, 59))).toBe('Good evening');
  });
});

describe('formatDate', () => {
  it('shows an API calendar date without shifting it', () => {
    expect(formatDate('2026-01-05')).toBe('01/05/2026');
  });

  it('shows a picked Date by its local day', () => {
    expect(formatDate(new Date(2026, 10, 9))).toBe('11/09/2026');
  });

  it('shows a timestamp as its day in Eastern time', () => {
    // 02:30 UTC on the 10th is still the 9th in New York.
    expect(formatDate('2026-11-10T02:30:00.000Z')).toBe('11/09/2026');
  });

  it('leaves text it cannot read as it is', () => {
    expect(formatDate('soon')).toBe('soon');
  });
});

describe('formatTime', () => {
  it.each([
    ['00:15:00', '12:15 AM'],
    ['09:05', '9:05 AM'],
    ['12:00:00', '12:00 PM'],
    ['14:05:00', '2:05 PM'],
  ])('%s → %s', (input, output) => {
    expect(formatTime(input)).toBe(output);
  });
});

describe('formatDateTime', () => {
  it('converts to Eastern time, standard and daylight', () => {
    expect(formatDateTime('2026-11-10T19:05:00.000Z')).toBe(
      '11/10/2026, 2:05 PM',
    );
    expect(formatDateTime('2026-07-04T16:00:00.000Z')).toBe(
      '07/04/2026, 12:00 PM',
    );
  });
});

describe('toApiDate', () => {
  it('writes the local calendar date', () => {
    expect(toApiDate(new Date(2026, 0, 5, 23, 30))).toBe('2026-01-05');
  });
});

describe('formatDay', () => {
  it('adds the weekday of the calendar date', () => {
    expect(formatDay('2030-03-04')).toBe('Mon, 03/04/2030');
  });
});

describe('formatTimeRange', () => {
  it('joins the start and end, or shows the start alone', () => {
    expect(formatTimeRange('09:00', '11:30')).toBe('9:00 AM – 11:30 AM');
    expect(formatTimeRange('09:00', null)).toBe('9:00 AM');
    expect(formatTimeRange(null, null)).toBe('');
  });
});

describe('formatDatesInText', () => {
  it('rewrites API dates inside text', () => {
    expect(formatDatesInText('2030-11-01 - 2030-11-30')).toBe(
      '11/01/2030 - 11/30/2030',
    );
  });
});

describe('todayInEastern', () => {
  afterEach(() => jest.useRealTimers());

  it('uses the New York calendar day', () => {
    jest.useFakeTimers({ now: new Date('2026-11-10T03:00:00.000Z') });
    expect(todayInEastern()).toBe('2026-11-09');
  });
});
