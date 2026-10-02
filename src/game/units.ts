export type Unit = 'km' | 'mi';

const MILE_REGIONS = new Set(['US', 'GB', 'LR', 'MM']);

/** Miles for locales whose roads are signed in miles, kilometres everywhere else. */
export function defaultUnit(): Unit {
  try {
    const langs = navigator.languages?.length ? navigator.languages : [navigator.language];
    for (const l of langs) {
      const region = new Intl.Locale(l).maximize().region;
      if (region) return MILE_REGIONS.has(region) ? 'mi' : 'km';
    }
  } catch {
    /* no Intl.Locale */
  }
  return 'km';
}

const KM_PER_MI = 1.609344;

export function formatDistance(km: number, unit: Unit): string {
  if (unit === 'mi') {
    const mi = km / KM_PER_MI;
    if (mi < 0.1) return `${Math.round(mi * 5280)} ft`;
    if (mi < 10) return `${mi.toFixed(1)} mi`;
    return `${Math.round(mi).toLocaleString()} mi`;
  }
  if (km < 1) return `${Math.round(km * 1000)} m`;
  if (km < 10) return `${km.toFixed(1)} km`;
  return `${Math.round(km).toLocaleString()} km`;
}
