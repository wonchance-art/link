// Thymos의 그림자 — 화성의 실제 위성 둘. 아레스가 전장에 데려간 친아들,
// 포보스(두려움)와 데이모스(불안).
//
// 여긴 서랍이 아니다(entries 없음). 두려움은 기록하는 것이 아니라 동행하는 것 —
// 클릭하면 한 줄만 놓인다.
//
// 물리적 사실이 곧 시: Phobos는 화성 자전보다 빨리 돌아 조석력에 끌려
// 추락 중(수천만 년 뒤 부서져 고리가 된다). Deimos는 반대로 조금씩 멀어진다.
// 주기 비율 실측(0.319일 : 1.263일 ≈ 1 : 4).

import type { MoonDef } from './moonSystem';

export const shadows: MoonDef[] = [
	{
		key: 'phobos',
		name: 'Phobos',
		theme: '두려움',
		note: '점점 가까워진다 — 언젠가 부서져 고리가 될 만큼. 서쪽에서 떠서 동쪽으로 지는 달.',
		distFrac: 0.13, // a=2.76 R♂ — 태양계에서 제 행성에 가장 바짝 붙은 달
		T: 10, // 0.319일 (7시간 39분)
		size: 3.5,
		color: '#6b625c',
		// entries 없음 — 두려움은 담아두는 것이 아니다
	},
	{
		key: 'deimos',
		name: 'Deimos',
		theme: '불안',
		note: '조금씩 멀어진다 — 눈에 띄지 않게, 아주 천천히.',
		distFrac: 0.325, // a=6.92 R♂
		T: 40, // 1.263일
		size: 2.5,
		color: '#7d766f',
	}
];
