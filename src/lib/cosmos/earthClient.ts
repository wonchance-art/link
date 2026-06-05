import { geoOrthographic, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import land110m from 'world-atlas/land-110m.json';

// 지구 확대 시에만 동적 import → 초기 우주 번들은 가벼움 유지.
const landFeature = feature(
	land110m as never,
	(land110m as never as { objects: { land: never } }).objects.land
);

// 경도(lon)를 받아 그 시점의 육지 path를 돌려주는 회전기.
export function makeEarthRotator(size = 100, lat = 12) {
	const r = size / 2;
	const projection = geoOrthographic().scale(r).translate([r, r]);
	const path = geoPath(projection);
	return (lon: number): string => {
		projection.rotate([-lon, -lat]);
		return path(landFeature as never) ?? '';
	};
}
