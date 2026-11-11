// Dates and times as the business shows them: MM/DD/YYYY and h:mm AM/PM, in Eastern time.
const ZONE = 'America/New_York';

const pad = (n: number) => String(n).padStart(2, '0');
const DATE_ONLY = /^(\d{4})-(\d{2})-(\d{2})$/;
const TIME = /^(\d{1,2}):(\d{2})/;
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const easternDate = new Intl.DateTimeFormat('en-US', {
  timeZone: ZONE,
  month: '2-digit',
  day: '2-digit',
  year: 'numeric',
});
const easternDateTime = new Intl.DateTimeFormat('en-US', {
  timeZone: ZONE,
  month: '2-digit',
  day: '2-digit',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
});

/**
 * 11/10/2026. A calendar date from the API ("2026-11-10") is shown as it is, and a Date the
 * user picked uses its local day; a timestamp is shown as the day it is in Eastern time.
 */
export function formatDate(value: string | Date): string {
  if (value instanceof Date) {
    return `${pad(value.getMonth() + 1)}/${pad(value.getDate())}/${value.getFullYear()}`;
  }
  const day = DATE_ONLY.exec(value);
  if (day) {
    return `${day[2]}/${day[3]}/${day[1]}`;
  }
  const time = Date.parse(value);
  return Number.isNaN(time) ? value : easternDate.format(time);
}

/** "14:05" or "14:05:00" → 2:05 PM. */
export function formatTime(value: string): string {
  const match = TIME.exec(value);
  if (!match) {
    return value;
  }
  const hours = Number(match[1]);
  return `${hours % 12 || 12}:${match[2]} ${hours < 12 ? 'AM' : 'PM'}`;
}

/** A timestamp → 11/10/2026, 2:05 PM in Eastern time. */
export function formatDateTime(value: string): string {
  const time = Date.parse(value);
  return Number.isNaN(time) ? value : easternDateTime.format(time);
}

/** A visit's day: "2030-03-04" → Mon, 03/04/2030. */
export function formatDay(value: string): string {
  const day = DATE_ONLY.exec(value);
  if (!day) {
    return formatDate(value);
  }
  const weekday =
    WEEKDAYS[new Date(Date.UTC(+day[1], +day[2] - 1, +day[3])).getUTCDay()];
  return `${weekday}, ${day[2]}/${day[3]}/${day[1]}`;
}

/** 9:00 AM – 11:00 AM, or just the start when there is no end. */
export function formatTimeRange(
  start: string | null,
  end: string | null,
): string {
  if (!start) {
    return '';
  }
  return end ? `${formatTime(start)} – ${formatTime(end)}` : formatTime(start);
}

/** Rewrites every "YYYY-MM-DD" inside free text, such as "2030-11-01 - 2030-11-30". */
export function formatDatesInText(value: string): string {
  return value.replace(/\b(\d{4})-(\d{2})-(\d{2})\b/g, '$2/$3/$1');
}

/** Today's date in New York, as "YYYY-MM-DD": the day the API counts as today. */
export function todayInEastern(): string {
  const [month, day, year] = easternDate.format(Date.now()).split('/');
  return `${year}-${month}-${day}`;
}

/** A Date the user picked → "2026-11-10", the calendar-date format the API takes. */
export function toApiDate(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** Today at midnight, the earliest date the user may pick for a visit. */
export function startOfToday(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

/**
 * Home's greeting, by the phone's own clock: good morning from 5 AM, good afternoon from noon,
 * and good evening from 5 PM through the night.
 */
export function greeting(now: Date = new Date()): string {
  const hour = now.getHours();
  if (hour >= 5 && hour < 12) {
    return 'Good morning';
  }
  return hour >= 12 && hour < 17 ? 'Good afternoon' : 'Good evening';
}
