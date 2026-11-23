import type { LayerSpecification } from 'mapbox-gl';

export const STYLE = 'mapbox://styles/mapbox/dark-v11';

export const SOURCE = 'quakes';
export const QUAKES = 'quakes-circles';

export const quakesLayer: LayerSpecification = {
  id: QUAKES,
  type: 'circle',
  source: SOURCE,
  layout: {
    // Bigger quakes draw on top.
    'circle-sort-key': ['get', 'mag'],
  },
  paint: {
    'circle-color': ['step', ['get', 'mag'], '#f7d774', 4.5, '#f4845f', 6, '#e63946', 7, '#b5179e'],
    'circle-radius': ['interpolate', ['exponential', 1.6], ['get', 'mag'], 2.5, 2.5, 4.5, 5, 6, 10, 8, 24],
    'circle-opacity': 0.85,
    'circle-stroke-color': 'rgba(255, 255, 255, 0.55)',
    'circle-stroke-width': 0.8,
  },
};
