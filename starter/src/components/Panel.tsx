import type { MinMag, Quake, QuakeCollection } from '../types';

interface Props {
  months: string[];
  month: string;
  minMag: MinMag;
  quakes: QuakeCollection | null;
  loading: boolean;
  error: string | null;
  onMonth: (month: string) => void;
  onMinMag: (minMag: MinMag) => void;
  onPick: (quake: Quake) => void;
}

const MAGS: MinMag[] = [2.5, 4.5, 6];

const monthName = (month: string) =>
  new Date(`${month}-01T00:00:00Z`).toLocaleDateString('en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' });

export const Panel = ({ months, month, minMag, quakes, loading, error, onMonth, onMinMag, onPick }: Props) => {
  const strongest = quakes ? [...quakes.features].sort((a, b) => b.properties.mag - a.properties.mag).slice(0, 5) : [];

  return (
    <aside className="panel" aria-label="Earthquakes">
      <header>
        <p className="eyebrow">Live from the USGS API</p>
        <h1>Earthquakes</h1>
      </header>

      <div className="controls">
        <label className="field">
          Month
          <select value={month} onChange={(e) => onMonth(e.target.value)}>
            {months.map((m) => (
              <option key={m} value={m}>{monthName(m)}</option>
            ))}
          </select>
        </label>
        <div className="field">
          Magnitude
          <div className="mags" role="radiogroup" aria-label="Minimum magnitude">
            {MAGS.map((m) => (
              <label key={m} className="mag">
                <input type="radio" name="mag" checked={minMag === m} onChange={() => onMinMag(m)} />
                {m}+
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="count" aria-live="polite">
        {error ? (
          <span className="error">{error}</span>
        ) : (
          <>
            <output>{loading || !quakes ? '…' : quakes.features.length.toLocaleString('en-US')}</output>
            <span>{loading ? 'loading' : 'earthquakes'}, M{minMag}+ in {monthName(month)}</span>
          </>
        )}
      </div>

      {strongest.length > 0 && (
        <div className="list">
          <h2>Strongest</h2>
          <ol>
            {strongest.map((q) => (
              <li key={q.id}>
                <button type="button" onClick={() => onPick(q)}>
                  <b>M{q.properties.mag.toFixed(1)}</b> {q.properties.place}
                </button>
              </li>
            ))}
          </ol>
        </div>
      )}

      <p className="source">USGS Earthquake Hazards Program, FDSN event API. Times and months in UTC.</p>
    </aside>
  );
};
