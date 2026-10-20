export const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
export const WEEKDAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

export const lkr = (n: number) => "LKR " + n.toLocaleString("en-US");
export const pad2 = (n: number) => String(n).padStart(2, "0");

/**
 * Date parts in Sri Lanka time, so server and browser render the same
 * calendar day regardless of the visitor's timezone.
 */
export function colomboParts(iso: string) {
  const d = new Date(Date.parse(iso) + 330 * 60_000);
  return {
    day: pad2(d.getUTCDate()),
    month: MONTHS[d.getUTCMonth()],
    weekday: WEEKDAYS[d.getUTCDay()],
    year: d.getUTCFullYear(),
  };
}

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2026-09-18" → "Sep 18, 2026" (or "Sep 18" without the year). */
export function shortDate(ymd: string, withYear = true) {
  const [y, m, d] = ymd.split("-");
  return `${MONTH_NAMES[Number(m) - 1]} ${d}${withYear ? `, ${y}` : ""}`;
}
