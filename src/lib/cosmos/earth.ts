import { geoOrthographic, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import land110m from 'world-atlas/land-110m.json';

// 실제 지리 데이터(Natural Earth, public domain)를 정사영(orthographic)으로 투영해
// 정확한 지구본의 육지 경로(SVG path d)를 만든다. 모듈 로드 시 1회 계산 → SSR/CSR 동일.

function buildLandPath(size: number, lon: number, lat: number): string {
	const r = size / 2;
	const projection = geoOrthographic()
		.scale(r)
		.translate([r, r])
		.rotate([-lon, -lat]);
	const path = geoPath(projection);
	// topojson land object → GeoJSON feature
	const land = feature(land110m as never, (land110m as never as { objects: { land: never } }).objects.land);
	return path(land as never) ?? '';
}

// 아프리카·유라시아가 보이는 시점 (육지 비율 높음)
export const LAND_PATH = buildLandPath(100, 18, 12);
