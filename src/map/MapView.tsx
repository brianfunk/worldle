import { config as mlConfig, AttributionControl, Map as MLMap, Marker, NavigationControl, LngLatBounds, type GeoJSONSource, type LngLatLike, type MapMouseEvent } from 'maplibre-gl';
import maplibreWorkerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';
import type { FeatureCollection } from 'geojson';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useEffect, useRef } from 'react';
import { circlePolygon, type LonLat } from '../game/geo';
import type { Category, Guess, Target } from '../game/types';
import type { BasemapDef } from './styles';

interface Props {
  basemap: BasemapDef;
  guesses: Guess[];
  /** Fit the view to this circle when it changes. */
  focus: { center: LonLat; radiusKm: number } | null;
  /** Reveal the target when the game is over. */
  reveal: Target | null;
  labelsVisible: boolean;
  onClick: (point: LonLat) => void;
}

// Vite does not copy MapLibre's worker next to the bundle, so point MapLibre at the hashed asset.
mlConfig.WORKER_URL = maplibreWorkerUrl;

const REVEAL_ZOOM: Record<Category, number> = { landmark: 14, city: 9.5, nature: 8 };

function circlesGeoJSON(guesses: Guess[]): FeatureCollection {
  return {
    type: 'FeatureCollection',
    features: guesses
      .filter((g) => !g.win)
      .map((g, i) => ({
        type: 'Feature',
        properties: { hit: g.hit, n: i + 1 },
        geometry: { type: 'Polygon', coordinates: [circlePolygon([g.lon, g.lat], g.radiusKm)] },
      })),
  };
}

function pointsGeoJSON(guesses: Guess[]): FeatureCollection {
  return {
    type: 'FeatureCollection',
    features: guesses.map((g, i) => ({
      type: 'Feature',
      properties: { hit: g.hit, win: g.win, n: String(i + 1) },
      geometry: { type: 'Point', coordinates: [g.lon, g.lat] },
    })),
  };
}

function setLabels(map: MLMap, visible: boolean) {
  for (const layer of map.getStyle()?.layers ?? []) {
    if (layer.type === 'symbol') {
      map.setLayoutProperty(layer.id, 'visibility', visible ? 'visible' : 'none');
    }
  }
}

function addGameLayers(map: MLMap, guesses: Guess[]) {
  if (map.getSource('circles')) return;
  map.addSource('circles', { type: 'geojson', data: circlesGeoJSON(guesses) });
  map.addSource('points', { type: 'geojson', data: pointsGeoJSON(guesses) });
  map.addLayer({
    id: 'circle-fill',
    type: 'fill',
    source: 'circles',
    paint: {
      'fill-color': ['case', ['get', 'hit'], '#16a34a', '#dc2626'],
      'fill-opacity': ['case', ['get', 'hit'], 0.12, 0.35],
    },
  });
  map.addLayer({
    id: 'circle-line',
    type: 'line',
    source: 'circles',
    paint: {
      'line-color': ['case', ['get', 'hit'], '#15803d', '#b91c1c'],
      'line-width': 2.5,
    },
  });
  map.addLayer({
    id: 'point-dot',
    type: 'circle',
    source: 'points',
    paint: {
      'circle-radius': 9,
      'circle-color': ['case', ['get', 'win'], '#facc15', ['get', 'hit'], '#16a34a', '#dc2626'],
      'circle-stroke-color': '#ffffff',
      'circle-stroke-width': 2,
    },
  });
  map.addLayer({
    id: 'point-label',
    type: 'symbol',
    source: 'points',
    layout: {
      'text-field': ['get', 'n'],
      'text-size': 11,
      'text-font': ['Noto Sans Bold'],
      'text-allow-overlap': true,
    },
    paint: { 'text-color': '#ffffff' },
  });
}

export default function MapView({ basemap, guesses, focus, reveal, labelsVisible, onClick }: Props) {
  const container = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MLMap | null>(null);
  const styleReady = useRef(false);
  const animating = useRef(false);
  const markerRef = useRef<Marker | null>(null);
  const onClickRef = useRef(onClick);
  onClickRef.current = onClick;
  const guessesRef = useRef(guesses);
  guessesRef.current = guesses;
  const labelsRef = useRef(labelsVisible);
  labelsRef.current = labelsVisible;
  const basemapRef = useRef(basemap);
  const mountedBasemap = useRef(basemap.id);

  // Create the map once per game. Basemap changes swap the style in place below.
  useEffect(() => {
    if (!container.current) return;
    const initial = basemapRef.current;
    mountedBasemap.current = initial.id;
    const map = new MLMap({
      container: container.current,
      style: initial.style,
      center: [10, 20],
      zoom: 0.8,
      minZoom: 0.5,
      maxZoom: 17,
      attributionControl: false,
      dragRotate: false,
      pitchWithRotate: false,
      touchPitch: false,
    });
    map.touchZoomRotate.disableRotation();
    map.keyboard.disableRotation();
    map.addControl(new NavigationControl({ showCompass: false }), 'bottom-left');
    map.addControl(new AttributionControl({ compact: true }), 'bottom-left');

    const onStyle = () => {
      styleReady.current = true;
      addGameLayers(map, guessesRef.current);
      if (basemapRef.current.hasLabels) setLabels(map, labelsRef.current);
      // keep our own labels visible
      if (map.getLayer('point-label')) map.setLayoutProperty('point-label', 'visibility', 'visible');
    };
    map.on('style.load', onStyle);
    map.on('moveend', () => {
      animating.current = false;
    });
    map.on('click', (e: MapMouseEvent) => {
      if (animating.current) return;
      onClickRef.current([e.lngLat.lng, e.lngLat.lat]);
    });
    map.getCanvas().style.cursor = 'crosshair';

    mapRef.current = map;
    if (import.meta.env.DEV) (window as unknown as { __map?: MLMap }).__map = map;
    return () => {
      styleReady.current = false;
      markerRef.current?.remove();
      markerRef.current = null;
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Swap the basemap without touching the camera.
  useEffect(() => {
    basemapRef.current = basemap;
    const map = mapRef.current;
    if (!map || mountedBasemap.current === basemap.id) return;
    mountedBasemap.current = basemap.id;
    styleReady.current = false;
    map.setStyle(basemap.style, { diff: false });
  }, [basemap]);

  // Push guesses into the sources.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !styleReady.current) return;
    (map.getSource('circles') as GeoJSONSource | undefined)?.setData(circlesGeoJSON(guesses));
    (map.getSource('points') as GeoJSONSource | undefined)?.setData(pointsGeoJSON(guesses));
  }, [guesses]);

  // Hard-mode label toggling.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !styleReady.current || !basemap.hasLabels) return;
    setLabels(map, labelsVisible);
    if (map.getLayer('point-label')) map.setLayoutProperty('point-label', 'visibility', 'visible');
  }, [labelsVisible, basemap]);

  // Fit to the newest green circle.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !focus) return;
    const ring = circlePolygon(focus.center, focus.radiusKm, 36);
    const bounds = ring.reduce(
      (b, p) => b.extend(p as LngLatLike),
      new LngLatBounds(ring[0] as LngLatLike, ring[0] as LngLatLike),
    );
    animating.current = true;
    map.fitBounds(bounds, { padding: 40, duration: 1800, maxZoom: 15 });
  }, [focus]);

  // Reveal the target at the end.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !reveal) return;
    const el = document.createElement('div');
    el.className = 'target-marker';
    el.textContent = '★';
    markerRef.current?.remove();
    markerRef.current = new Marker({ element: el, anchor: 'center' })
      .setLngLat([reveal.lon, reveal.lat])
      .addTo(map);
    if (basemap.hasLabels) setLabels(map, true);
    animating.current = true;
    map.flyTo({ center: [reveal.lon, reveal.lat], zoom: REVEAL_ZOOM[reveal.category], duration: 2500 });
  }, [reveal, basemap]);

  return <div ref={container} className="map" aria-label="World map. Click to guess." />;
}
