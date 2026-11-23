import { useEffect, useState } from 'react';

import { MapView } from './components/MapView';
import { Panel } from './components/Panel';
import type { MinMag, Quake, QuakeCollection } from './types';
import { fetchQuakes, lastMonths } from './usgs';

const TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
const MONTHS = lastMonths(6);

export const App = () => {
  const [month, setMonth] = useState(MONTHS[0]);
  const [minMag, setMinMag] = useState<MinMag>(4.5);
  const [quakes, setQuakes] = useState<QuakeCollection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [focus, setFocus] = useState<Quake | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchQuakes({ month, minMag })
      .then(setQuakes)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [month, minMag]);

  if (!TOKEN) return <p className="message">Add VITE_MAPBOX_TOKEN to a .env file (see .env.example), then restart npm run dev.</p>;

  return (
    <div className="layout">
      <MapView token={TOKEN} quakes={quakes} focus={focus} />
      <Panel
        months={MONTHS}
        month={month}
        minMag={minMag}
        quakes={quakes}
        loading={loading}
        error={error}
        onMonth={setMonth}
        onMinMag={setMinMag}
        // A new object each time, so picking the same quake again flies there again.
        onPick={(q) => setFocus({ ...q })}
      />
    </div>
  );
};
