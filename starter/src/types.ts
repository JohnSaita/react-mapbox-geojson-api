import type { Feature, FeatureCollection, Point } from 'geojson';

/** The USGS properties this app reads. The API sends more; TypeScript only knows what we declare. */
export interface QuakeProps {
  /** Never null here: the query asks for a minimum magnitude. */
  mag: number;
  magType: string;
  place: string;
  /** Milliseconds since 1970, UTC. */
  time: number;
  /** The event page on earthquake.usgs.gov. */
  url: string;
}

/** A GeoJSON Point's coordinates are [longitude, latitude, depth in km]. */
export type Quake = Feature<Point, QuakeProps>;
export type QuakeCollection = FeatureCollection<Point, QuakeProps>;

export type MinMag = 2.5 | 4.5 | 6;

export interface Query {
  /** YYYY-MM, a whole month in UTC. */
  month: string;
  minMag: MinMag;
}
