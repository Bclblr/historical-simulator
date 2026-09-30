export type HistoricalEra = 'BCE' | 'CE';

export interface HistoricalDate {
  era: HistoricalEra;
  year: number;
  month: number;
  day: number;
}

const SERIALIZED_PATTERN = /^(BCE|CE):(\d+)-(\d{2})-(\d{2})$/;
const LEGACY_CE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

function isLeapYear(year: number): boolean {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

function daysInMonth(year: number, month: number): number {
  if (month === 2) return isLeapYear(year) ? 29 : 28;
  return [4, 6, 9, 11].includes(month) ? 30 : 31;
}

export function createHistoricalDate(
  era: HistoricalEra,
  year: number,
  month: number,
  day: number,
): HistoricalDate {
  if (!Number.isInteger(year) || year < 1) {
    throw new Error('HistoricalDate year must be a positive integer; there is no year zero.');
  }
  if (!Number.isInteger(month) || month < 1 || month > 12) {
    throw new Error('HistoricalDate month must be between 1 and 12.');
  }
  if (!Number.isInteger(day) || day < 1 || day > daysInMonth(year, month)) {
    throw new Error('HistoricalDate day is invalid for the selected month.');
  }
  return { era, year, month, day };
}

export function serializeHistoricalDate(date: HistoricalDate): string {
  const normalized = createHistoricalDate(date.era, date.year, date.month, date.day);
  return `${normalized.era}:${String(normalized.year).padStart(4, '0')}-${String(normalized.month).padStart(2, '0')}-${String(normalized.day).padStart(2, '0')}`;
}

export function parseHistoricalDate(value: string): HistoricalDate {
  const legacy = LEGACY_CE_PATTERN.exec(value);
  if (legacy) {
    return createHistoricalDate('CE', Number(legacy[1]), Number(legacy[2]), Number(legacy[3]));
  }

  const match = SERIALIZED_PATTERN.exec(value);
  if (!match) {
    throw new Error('HistoricalDate must use CE:YYYY-MM-DD or BCE:YYYY-MM-DD.');
  }

  return createHistoricalDate(
    match[1] as HistoricalEra,
    Number(match[2]),
    Number(match[3]),
    Number(match[4]),
  );
}

function astronomicalYear(date: HistoricalDate): number {
  return date.era === 'CE' ? date.year : 1 - date.year;
}

function fromAstronomicalYear(year: number, month: number, day: number): HistoricalDate {
  return year >= 1
    ? createHistoricalDate('CE', year, month, day)
    : createHistoricalDate('BCE', 1 - year, month, day);
}

export function compareHistoricalDates(a: HistoricalDate, b: HistoricalDate): number {
  const left = [astronomicalYear(a), a.month, a.day];
  const right = [astronomicalYear(b), b.month, b.day];
  for (let index = 0; index < left.length; index += 1) {
    if (left[index] !== right[index]) return left[index] < right[index] ? -1 : 1;
  }
  return 0;
}

export function addHistoricalDays(date: HistoricalDate, days: number): HistoricalDate {
  if (!Number.isInteger(days)) throw new Error('HistoricalDate day delta must be an integer.');

  let year = astronomicalYear(date);
  let month = date.month;
  let day = date.day;
  let remaining = days;

  while (remaining > 0) {
    const maxDay = daysInMonth(year, month);
    if (day < maxDay) day += 1;
    else {
      day = 1;
      if (month < 12) month += 1;
      else { month = 1; year += 1; }
    }
    remaining -= 1;
  }

  while (remaining < 0) {
    if (day > 1) day -= 1;
    else {
      if (month > 1) month -= 1;
      else { month = 12; year -= 1; }
      day = daysInMonth(year, month);
    }
    remaining += 1;
  }

  return fromAstronomicalYear(year, month, day);
}
