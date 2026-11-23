import mapboxgl, { type GeoJSONSource } from 'mapbox-gl';
import { useEffect, useRef, useState } from 'react';

import { EMPTY, QUAKES, quakesLayer, SOURCE, STYLE } from '../map/layers';
import { quakePopup } from '../map/popup';
import type { Quake, QuakeCollection } from '../types';

const ATTRIBUTION = 'Earthquakes: USGS Earthquake Hazards Program.';
const popup = new mapboxgl.Popup({ offset: 10, maxWidth: '280px' });

interface Props {
  token: string;
  quakes: QuakeCollection | null;
  focus: Quake | null;
}

export const MapView = ({ token, quakes, focus }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [ready, setReady] = useState(false);

  // Create the map once.
  useEffect(() => {
    if (!containerRef.current) return;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      accessToken: token,
      style: STYLE,
      projection: 'mercator',
      center: [20, 15],
      zoom: 1.4,
      customAttribution: ATTRIBUTION,
    });
    mapRef.current = map;
    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right');

    map.on('load', () => {
      // Add the source once, empty. Every new response replaces its data with setData.
      map.addSource(SOURCE, { type: 'geojson', data: EMPTY });
      map.addLayer(quakesLayer);
      setReady(true);
    });

    map.on('click', QUAKES, (e) => {
      const quake = e.features?.[0] as Quake | undefined;
      if (quake) showPopup(map, quake);
    });
    map.on('mouseenter', QUAKES, () => (map.getCanvas().style.cursor = 'pointer'));
    map.on('mouseleave', QUAKES, () => (map.getCanvas().style.cursor = ''));

    return () => {
      map.remove();
      mapRef.current = null;
      setReady(false);
    };
  }, [token]);

  // Draw each new response.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready || !quakes) return;
    (map.getSource(SOURCE) as GeoJSONSource).setData(quakes);
    popup.remove();
  }, [ready, quakes]);

  // Fly to the quake picked in the panel.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !focus) return;
    // GeoJSON is [longitude, latitude], then depth.
    const [lng, lat] = focus.geometry.coordinates;
    map.flyTo({ center: [lng, lat], zoom: 5.5, duration: 2500 });
    showPopup(map, focus);
  }, [focus]);

  return <div ref={containerRef} className="map" />;
};

const showPopup = (map: mapboxgl.Map, quake: Quake) => {
  const [lng, lat] = quake.geometry.coordinates;
  popup.setLngLat([lng, lat]).setDOMContent(quakePopup(quake)).addTo(map);
};
