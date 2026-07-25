// 은하 = 나의 세계 (삶의 아름다움·의미·풍요의 총체).
// 별 하나하나 = 내가 감사하는 존재·순간. 누르면 그 글이 뜬다.
// 데이터는 src/content/gratitude.json — /admin(CMS)에서 편집.
// y는 은하 아치를 따라 배치 — 별들이 은하수 띠 위에 모이도록.

import data from '$content/gratitude.json';

export type GratitudeStar = {
	id: string;
	x: number; // % (좌)
	y: number; // % (상)
	name: string;
	note: string;
};

export const gratitudeStars: GratitudeStar[] = data.items;
