/**
 * Builds the World Markets map at build time: Natural Earth country shapes (public domain, via the
 * world-atlas package, 1:110m scale) projected with d3-geo into static SVG paths. Nothing here runs
 * in the visitor's browser.
 *
 * Countries too small for the 1:110m data (Hong Kong, Singapore) get a marker instead of a shape.
 */
import { geoNaturalEarth1, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import type { Topology, GeometryCollection } from 'topojson-specification';
import world from 'world-atlas/countries-110m.json';

/** ISO 3166-1 numeric → alpha-2, for the countries that have pages. */
const NUMERIC_TO_ALPHA2: Record<string, string> = {
  '040': 'AT', '276': 'DE', '756': 'CH', '826': 'GB', '840': 'US', '250': 'FR', '528': 'NL',
  '380': 'IT', '724': 'ES', '752': 'SE', '616': 'PL', '392': 'JP', '156': 'CN', '344': 'HK',
  '356': 'IN', '410': 'KR', '158': 'TW', '702': 'SG', '036': 'AU', '124': 'CA',
};

/** [longitude, latitude] for countries drawn as markers. */
const MARKERS: Record<string, [number, number]> = {
  HK: [114.17, 22.32],
  SG: [103.82, 1.35],
};

export interface MapShape {
  /** Alpha-2 code if the country has a page, otherwise null. */
  code: string | null;
  name: string;
  d: string;
}

export interface MapMarker {
  code: string;
  x: number;
  y: number;
}

export interface WorldMap {
  width: number;
  height: number;
  shapes: MapShape[];
  markers: MapMarker[];
}

export function buildWorldMap(width = 960, height = 470): WorldMap {
  const topo = world as unknown as Topology<{ countries: GeometryCollection<{ name: string }> }>;
  const fc = feature(topo, topo.objects.countries);
  // Antarctica takes a lot of space and has no stock market.
  const features = fc.features.filter((f) => f.id !== '010');
  const projection = geoNaturalEarth1().fitSize([width, height], { type: 'FeatureCollection', features });
  const path = geoPath(projection).digits(1);
  const shapes = features
    .map((f) => ({ code: NUMERIC_TO_ALPHA2[String(f.id)] ?? null, name: f.properties?.name ?? '', d: path(f) ?? '' }))
    .filter((s) => s.d);
  const markers = Object.entries(MARKERS).map(([code, lonLat]) => {
    const [x, y] = projection(lonLat) ?? [0, 0];
    return { code, x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 };
  });
  return { width, height, shapes, markers };
}
