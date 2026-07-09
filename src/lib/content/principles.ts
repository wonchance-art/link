// Nomos의 법전 — 목성의 갈릴레이 4위성. 지키는 원칙들이 담기는 서랍.
//
// Io : Europa : Ganymede는 실제로 1:2:4 라플라스 공명에 묶여 있다 —
// 수학적 법칙이 궤도를 문자 그대로 지배하는 곳. Callisto만 공명 바깥에서 돈다.
// 주기는 실측 비율(1.769 : 3.551 : 7.155 : 16.689일), Io 16초 기준.
//
// theme(키워드)는 각 위성의 실제 성격에서 딴 기본값 — 자유롭게 바꿔도 됨.
// 원칙 추가: 해당 위성의 entries 배열에 { date, text } (title은 선택).

import type { MoonDef } from './moonSystem';

export const principles: MoonDef[] = [
	{
		key: 'io',
		name: 'Io',
		theme: '불',
		note: '가장 격렬하게 뒤집히는 달 — 법에 가장 가까이 묶인 값을 불로 치른다.',
		distFrac: 0.17, // a=5.9 R♃
		T: 16, // 1.769일 — 공명의 1
		size: 6,
		color: '#d9c26a', // 유황의 노랑
		entries: []
	},
	{
		key: 'europa',
		name: 'Europa',
		theme: '침묵',
		note: '매끈한 얼음 아래의 바다를 말하지 않는다.',
		distFrac: 0.231, // a=9.4 R♃
		T: 32, // 3.551일 — 공명의 2
		size: 5,
		color: '#ddd5c7',
		entries: []
	},
	{
		key: 'ganymede',
		name: 'Ganymede',
		theme: '자립',
		note: '제 자기장을 가진 유일한 달 — 태양계에서 가장 크다.',
		distFrac: 0.306, // a=15.0 R♃
		T: 64, // 7.155일 — 공명의 4
		size: 8,
		color: '#a89b8a',
		entries: []
	},
	{
		key: 'callisto',
		name: 'Callisto',
		theme: '견딤',
		note: '모든 충돌을 얼굴에 새긴 채, 홀로 공명 바깥에서 돈다.',
		distFrac: 0.42, // a=26.3 R♃ — 라플라스 공명에 속하지 않는 유일한 갈릴레이 위성
		T: 151, // 16.689일
		size: 7,
		color: '#8f857b',
		entries: []
	}
];
