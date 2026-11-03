const MINUTES_PER_DAY = 1440
const WINDOW_DAYS = 30

export const budgetMinutes = (slo: number) => (1 - slo) * WINDOW_DAYS * MINUTES_PER_DAY

export const burnRate = (errorRate: number, slo: number) => errorRate / (1 - slo)

/** Share of the 30-day budget used by a constant error rate over `minutes`. */
export const budgetUsed = (errorRate: number, minutes: number, slo: number) =>
  (errorRate * minutes) / budgetMinutes(slo)

/** Multi-window burn-rate alerts, using the thresholds from the Google SRE Workbook. */
export const alertPolicies = [
  { id: 'fast', severity: 'Page', burn: 14.4, longMin: 60, shortMin: 5 },
  { id: 'medium', severity: 'Page', burn: 6, longMin: 360, shortMin: 30 },
  { id: 'slow', severity: 'Ticket', burn: 1, longMin: 4320, shortMin: 360 },
] as const

/** Average error rate over the trailing window at time t, for an incident starting at t=0. */
const windowAverage = (errorRate: number, incident: number, t: number, window: number) => {
  const overlap = Math.min(t, incident) - Math.max(0, t - window)
  return (errorRate * Math.max(0, overlap)) / window
}

/** First minute both windows exceed the threshold, or null if the alert never fires. */
export function timeToDetect(
  policy: (typeof alertPolicies)[number],
  errorRate: number,
  incident: number,
  slo: number
) {
  const threshold = policy.burn * (1 - slo)
  // Once the incident ends the averages only fall, so there is no need to look further.
  for (let t = 1; t <= incident; t++) {
    const long = windowAverage(errorRate, incident, t, policy.longMin)
    const short = windowAverage(errorRate, incident, t, policy.shortMin)
    if (long >= threshold && short >= threshold) return t
  }
  return null
}

/** Budget remaining as a fraction, sampled across the incident. Can go below zero. */
export function burnSeries(errorRate: number, incident: number, slo: number, samples = 60) {
  return Array.from({ length: samples + 1 }, (_, i) => {
    const minute = (incident * i) / samples
    return { minute, remaining: 1 - budgetUsed(errorRate, minute, slo) }
  })
}

export function formatMinutes(minutes: number) {
  if (minutes < 60) return `${Math.round(minutes * 10) / 10} min`
  if (minutes < MINUTES_PER_DAY) return `${Math.round((minutes / 60) * 10) / 10} h`
  return `${Math.round((minutes / MINUTES_PER_DAY) * 10) / 10} d`
}
