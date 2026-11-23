import type { Quake } from '../types';

const when = (ms: number) =>
  new Date(ms).toLocaleString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'UTC',
  }) + ' UTC';

/** Popup content for one quake. Built from text nodes, so nothing in the data runs as HTML. */
export const quakePopup = (quake: Quake): HTMLElement => {
  const p = quake.properties;
  const depth = quake.geometry.coordinates[2];
  const el = document.createElement('div');
  el.className = 'popup';
  el.appendChild(document.createElement('h2')).textContent = `M${p.mag.toFixed(1)}`;
  const rows: [string, string][] = [
    ['Where', p.place],
    ['When', when(p.time)],
    ['Depth', `${depth.toFixed(0)} km`],
  ];
  for (const [label, value] of rows) {
    const row = el.appendChild(document.createElement('p'));
    row.appendChild(document.createElement('b')).textContent = label;
    row.append(` ${value}`);
  }
  const link = el.appendChild(document.createElement('a'));
  link.href = p.url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.textContent = 'USGS event page';
  return el;
};
