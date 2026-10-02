export type LonLat = [number, number];

export const EARTH_RADIUS_KM = 6371.0088;

const toRad = (d: number) => (d * Math.PI) / 180;
const toDeg = (r: number) => (r * 180) / Math.PI;

/** Great-circle distance in kilometres (haversine). */
export function distanceKm(a: LonLat, b: LonLat): number {
  const [lon1, lat1] = a.map(toRad) as LonLat;
  const [lon2, lat2] = b.map(toRad) as LonLat;
  const dLat = lat2 - lat1;
  const dLon = lon2 - lon1;
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(h)));
}

/** Initial bearing from a to b, in degrees clockwise from north [0, 360). */
export function bearingDeg(a: LonLat, b: LonLat): number {
  const [lon1, lat1] = a.map(toRad) as LonLat;
  const [lon2, lat2] = b.map(toRad) as LonLat;
  const dLon = lon2 - lon1;
  const y = Math.sin(dLon) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

const COMPASS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'] as const;
export type Compass = (typeof COMPASS)[number];

export function compassLabel(bearing: number): Compass {
  return COMPASS[Math.round(bearing / 45) % 8];
}

/** Point reached travelling `distKm` from `origin` on `bearing` degrees. */
export function destination(origin: LonLat, bearing: number, distKm: number): LonLat {
  const [lon1, lat1] = origin.map(toRad) as LonLat;
  const br = toRad(bearing);
  const ad = distKm / EARTH_RADIUS_KM;
  const lat2 = Math.asin(
    Math.sin(lat1) * Math.cos(ad) + Math.cos(lat1) * Math.sin(ad) * Math.cos(br),
  );
  const lon2 =
    lon1 +
    Math.atan2(
      Math.sin(br) * Math.sin(ad) * Math.cos(lat1),
      Math.cos(ad) - Math.sin(lat1) * Math.sin(lat2),
    );
  return [toDeg(lon2), toDeg(lat2)];
}

/**
 * Geodesic circle as a GeoJSON polygon ring (closed). Longitudes are left
 * unwrapped so circles crossing the antimeridian render as one shape.
 */
export function circlePolygon(center: LonLat, radiusKm: number, steps = 72): LonLat[] {
  const ring: LonLat[] = [];
  let prevLon = center[0];
  for (let i = 0; i <= steps; i++) {
    const p = destination(center, (i * 360) / steps, radiusKm);
    // unwrap longitude relative to previous point
    while (p[0] - prevLon > 180) p[0] -= 360;
    while (p[0] - prevLon < -180) p[0] += 360;
    prevLon = p[0];
    ring.push(p);
  }
  ring[ring.length - 1] = ring[0];
  return ring;
}

