import { DateTime } from 'luxon';

export function dowLabel(dow0to6: number) {
  const labels = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  return labels[dow0to6] ?? '';
}

export function formatTimeHM(t: string) {
  const [h, m] = t.split(':');
  return `${h}:${m}`;
}

export function formatRangeWithTz(start: string, end: string, tz: string) {
  return `${formatTimeHM(start)}–${formatTimeHM(end)} (${tz})`;
}

export function toLocalTimeLabel(time: string, tz: string) {
  const [h, m, s] = time.split(':').map(Number);
  const now = DateTime.now().setZone(tz).set({ hour: h, minute: m, second: s || 0, millisecond: 0 });
  const local = now.setZone(DateTime.local().zoneName);
  return local.toFormat('HH:mm');
}
