// What each API status is called in the app, and the tone of its label.
import type { Tone } from '../components/StatusPill';
import type { Enquiry, ProfileRequest, Visit, VisitStatus } from '../api/types';
import { todayInEastern } from './date';

export type Label = { label: string; tone: Tone };

const unknown = (status: string): Label => ({
  label:
    status.charAt(0).toUpperCase() +
    status.slice(1).toLowerCase().replace(/_/g, ' '),
  tone: 'neutral',
});

const VISIT: Record<VisitStatus, Label> = {
  PENDING: { label: 'Scheduled', tone: 'neutral' },
  ACCEPTED: { label: 'Confirmed', tone: 'success' },
  ONGOING: { label: 'In progress', tone: 'info' },
  SUCCESS: { label: 'Completed', tone: 'success' },
  REJECTED: { label: 'Declined', tone: 'danger' },
  CANCELLED: { label: 'Cancelled', tone: 'neutral' },
};

export const visitStatus = (status: VisitStatus): Label =>
  VISIT[status] ?? unknown(status);

/** The office takes cancellation requests for scheduled or confirmed visits from today on. */
export const canRequestCancellation = (visit: Pick<Visit, 'status' | 'date'>) =>
  (visit.status === 'PENDING' || visit.status === 'ACCEPTED') &&
  visit.date >= todayInEastern();

const DOCUMENT: Record<string, Label> = {
  awaiting_signature: { label: 'To sign', tone: 'warning' },
  signed: { label: 'Signed', tone: 'success' },
  declined: { label: 'Declined', tone: 'danger' },
  voided: { label: 'Voided', tone: 'neutral' },
  failed: { label: 'Failed', tone: 'danger' },
  draft: { label: 'Draft', tone: 'neutral' },
  // A quote: it is paid through the invoice made from it, not in the app.
  awaiting_payment: { label: 'Awaiting payment', tone: 'info' },
  paid: { label: 'Paid', tone: 'success' },
  expired: { label: 'Expired', tone: 'neutral' },
  sent: { label: 'Due', tone: 'warning' },
  deposit_paid: { label: 'Deposit paid', tone: 'info' },
  overdue: { label: 'Overdue', tone: 'danger' },
  cancelled: { label: 'Cancelled', tone: 'neutral' },
};

export const documentStatus = (status: string): Label =>
  DOCUMENT[status] ?? unknown(status);

/** Documents waiting on the client: one to sign, or an invoice to pay. */
export const needsAction = (status: string | null | undefined) =>
  status === 'awaiting_signature' || status === 'sent' || status === 'overdue';

const TIMELINE: Record<string, string> = {
  shared: 'Shared with you',
  sent: 'Sent',
  sent_for_signature: 'Sent for signature',
  signed: 'Signed',
  deposit_paid: 'Deposit paid',
  paid: 'Paid',
};

export const timelineStep = (step: string) =>
  TIMELINE[step] ?? unknown(step).label;

const ENQUIRY: Record<Enquiry['status'], Label> = {
  new: { label: 'Received', tone: 'info' },
  contacted: { label: 'Contacted', tone: 'success' },
  closed: { label: 'Closed', tone: 'neutral' },
};

export const enquiryStatus = (status: Enquiry['status']): Label =>
  ENQUIRY[status] ?? unknown(status);

const REQUEST: Record<ProfileRequest['status'], Label> = {
  open: { label: 'Open', tone: 'info' },
  done: { label: 'Done', tone: 'success' },
  declined: { label: 'Declined', tone: 'danger' },
};

export const requestStatus = (status: ProfileRequest['status']): Label =>
  REQUEST[status] ?? unknown(status);

const JOB: Record<string, string> = {
  SUPERVISOR: 'Supervisor',
  QUALITY_INSPECTOR: 'Quality inspector',
  CLEANER: 'Cleaner',
};

export const jobTitle = (jobType: string) =>
  JOB[jobType] ?? unknown(jobType).label;
