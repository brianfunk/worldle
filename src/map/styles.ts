import type { StyleSpecification } from 'maplibre-gl';
import type { MapMode } from '../game/types';

export interface BasemapDef {
  id: string;
  name: string;
  /** URL of a vector style, or an inline raster style. */
  style: string | StyleSpecification;
  /** True when the style has place labels that Hard mode should hide. */
  hasLabels: boolean;
  dark?: boolean;
}

function raster(
  id: string,
  name: string,
  tiles: string[],
  attribution: string,
  opts: { maxzoom?: number; tileSize?: number; dark?: boolean; hasLabels?: boolean } = {},
): BasemapDef {
  return {
    id,
    name,
    hasLabels: opts.hasLabels ?? true,
    dark: opts.dark,
    style: {
      version: 8,
      glyphs: 'https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf',
      sources: {
        base: {
          type: 'raster',
          tiles,
          tileSize: opts.tileSize ?? 256,
          maxzoom: opts.maxzoom ?? 18,
          attribution,
        },
      },
      layers: [{ id: 'base', type: 'raster', source: 'base' }],
    },
  };
}

const OFM = 'https://tiles.openfreemap.org/styles';

export const BASEMAPS: Record<string, BasemapDef> = {
  bright: { id: 'bright', name: 'OpenFreeMap Bright', style: `${OFM}/bright`, hasLabels: true },
  liberty: { id: 'liberty', name: 'OpenFreeMap Liberty', style: `${OFM}/liberty`, hasLabels: true },
  positron: { id: 'positron', name: 'OpenFreeMap Positron', style: `${OFM}/positron`, hasLabels: true },
  osm: raster(
    'osm',
    'OpenStreetMap',
    ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    { maxzoom: 19 },
  ),
  opentopo: raster(
    'opentopo',
    'OpenTopoMap',
    ['https://a.tile.opentopomap.org/{z}/{x}/{y}.png', 'https://b.tile.opentopomap.org/{z}/{x}/{y}.png', 'https://c.tile.opentopomap.org/{z}/{x}/{y}.png'],
    '&copy; OpenStreetMap contributors, SRTM | style &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (CC-BY-SA)',
    { maxzoom: 17 },
  ),
  voyager: raster(
    'voyager',
    'CARTO Voyager',
    ['https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png', 'https://b.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png', 'https://c.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png'],
    '&copy; OpenStreetMap contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    { maxzoom: 20, tileSize: 512 },
  ),
  darkmatter: raster(
    'darkmatter',
    'CARTO Dark Matter',
    ['https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png', 'https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png', 'https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png'],
    '&copy; OpenStreetMap contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    { maxzoom: 20, tileSize: 512, dark: true },
  ),
  imagery: raster(
    'imagery',
    'Esri World Imagery',
    ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
    'Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community',
    { maxzoom: 19, dark: true, hasLabels: false },
  ),
  natgeo: raster(
    'natgeo',
    'Esri National Geographic',
    ['https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}'],
    'Tiles &copy; Esri &mdash; National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC',
    { maxzoom: 16 },
  ),
  physical: raster(
    'physical',
    'Esri World Physical',
    ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Physical_Map/MapServer/tile/{z}/{y}/{x}'],
    'Tiles &copy; Esri &mdash; Source: US National Park Service',
    { maxzoom: 8, hasLabels: false },
  ),
  streets: raster(
    'streets',
    'Esri World Street Map',
    ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}'],
    'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012',
    { maxzoom: 19 },
  ),
};

export const EASY_BASEMAP = BASEMAPS.bright;
export const HARD_BASEMAP = BASEMAPS.imagery;
export const RANDOM_POOL: BasemapDef[] = [
  BASEMAPS.liberty, BASEMAPS.bright, BASEMAPS.positron, BASEMAPS.osm, BASEMAPS.opentopo,
  BASEMAPS.voyager, BASEMAPS.darkmatter, BASEMAPS.imagery, BASEMAPS.natgeo, BASEMAPS.streets,
];

export function pickBasemap(mode: MapMode, previousId?: string, forceId?: string | null): BasemapDef {
  if (forceId && BASEMAPS[forceId]) return BASEMAPS[forceId];
  if (mode === 'easy') return EASY_BASEMAP;
  if (mode === 'hard') return HARD_BASEMAP;
  const pool = RANDOM_POOL.filter((b) => b.id !== previousId);
  return pool[Math.floor(Math.random() * pool.length)];
}

/** In Hard mode labels appear once the search area is this small. */
export const HARD_LABELS_BELOW_KM = 200;
