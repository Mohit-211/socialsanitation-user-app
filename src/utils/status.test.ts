import {
  canRequestCancellation,
  documentStatus,
  needsAction,
  visitStatus,
} from './status';

describe('status labels', () => {
  it('names known statuses and falls back to readable text', () => {
    expect(visitStatus('ACCEPTED')).toEqual({
      label: 'Confirmed',
      tone: 'success',
    });
    expect(documentStatus('awaiting_signature').label).toBe('To sign');
    expect(documentStatus('on_hold')).toEqual({
      label: 'On hold',
      tone: 'neutral',
    });
  });

  it('flags documents waiting on the client', () => {
    expect(needsAction('awaiting_signature')).toBe(true);
    expect(needsAction('overdue')).toBe(true);
    expect(needsAction('signed')).toBe(false);
    expect(needsAction(null)).toBe(false);
  });

  it("doesn't flag a quote: it is paid through its invoice", () => {
    expect(needsAction('awaiting_payment')).toBe(false);
  });
});

describe('canRequestCancellation', () => {
  beforeEach(() =>
    jest.useFakeTimers({ now: new Date('2026-11-10T15:00:00.000Z') }),
  );
  afterEach(() => jest.useRealTimers());

  it('allows scheduled and confirmed visits from today on', () => {
    expect(
      canRequestCancellation({ status: 'ACCEPTED', date: '2026-11-10' }),
    ).toBe(true);
    expect(
      canRequestCancellation({ status: 'PENDING', date: '2026-12-01' }),
    ).toBe(true);
  });

  it('refuses past, started or finished visits', () => {
    expect(
      canRequestCancellation({ status: 'ACCEPTED', date: '2026-11-09' }),
    ).toBe(false);
    expect(
      canRequestCancellation({ status: 'ONGOING', date: '2026-11-10' }),
    ).toBe(false);
    expect(
      canRequestCancellation({ status: 'SUCCESS', date: '2026-11-10' }),
    ).toBe(false);
  });
});
