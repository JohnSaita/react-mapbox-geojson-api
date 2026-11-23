import type { Query, QuakeCollection } from './types';

/** USGS Earthquake Hazards Program, FDSN event web service. Free, no key, CORS open. */
const API = 'https://earthquake.usgs.gov/fdsnws/event/1/query';

/** The month after a YYYY-MM month, as YYYY-MM. */
const nextMonth = (month: string) => {
  const [y, m] = month.split('-').map(Number);
  return new Date(Date.UTC(y, m, 1)).toISOString().slice(0, 7);
};

/** The last n whole months before today, newest first. */
export const lastMonths = (n: number): string[] => {
  const now = new Date();
  return Array.from({ length: n }, (_, i) =>
    new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1 - i, 1)).toISOString().slice(0, 7),
  );
};

export const quakeUrl = ({ month, minMag }: Query) =>
  `${API}?${new URLSearchParams({
    format: 'geojson',
    eventtype: 'earthquake',
    starttime: `${month}-01`,
    endtime: `${nextMonth(month)}-01`,
    minmagnitude: String(minMag),
  })}`;

export const fetchQuakes = async (query: Query, signal?: AbortSignal): Promise<QuakeCollection> => {
  const res = await fetch(quakeUrl(query), { signal });
  if (!res.ok) throw new Error(`The USGS API answered ${res.status}. Try again in a minute.`);
  return (await res.json()) as QuakeCollection;
};
