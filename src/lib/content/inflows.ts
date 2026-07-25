// 바다 — 흘러들어온 것들.
//
// 우주 전체가 나의 내면이라면, 바다는 유일하게 "내가 쓰지 않은 것"이 사는 곳.
// 데이터는 src/content/inflows.json — /admin(CMS)에서 편집.

import data from '$content/inflows.json';

export type Inflow = {
	text: string;
	source?: string; // 어디서 흘러왔는가
	date?: string; // 언제 흘러들었는가
};

export const inflows: Inflow[] = data.items;
