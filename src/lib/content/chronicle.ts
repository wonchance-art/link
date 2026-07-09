// Chronos의 서가 — 토성의 실제 위성들에 주제를 부여하고, 글들을 담는다.
//
// 위성은 실제 토성 위성 7개(안쪽부터): Mimas · Enceladus · Tethys · Dione · Rhea · Titan · Iapetus.
// distFrac(시각 거리)·T(공전 초)는 실측 비율에서 압축: a^0.45를 [0.19..0.45]로 매핑(고리 바깥 시작),
// 주기는 실제 일수 비율 그대로(미마스 0.94일=14초 기준). 멀수록 정말로 느리다.
//
// theme(키워드)는 각 위성의 실제 성격에서 딴 기본값 — 자유롭게 바꿔도 됨.
// 글 추가: 해당 위성의 entries 배열에 { date, text } (title은 선택).

import type { MoonDef, MoonEntry } from './moonSystem';

export type ChronicleEntry = MoonEntry;
export type Moon = MoonDef;

export const moons: MoonDef[] = [
	{
		key: 'mimas',
		name: 'Mimas',
		theme: '흔적',
		note: '한 번의 충돌이 그대로 얼굴이 된 달.',
		distFrac: 0.19, // a=3.08 Rs
		T: 14, // 0.94일
		size: 4,
		color: '#b9b6b0',
		entries: []
	},
	{
		key: 'enceladus',
		name: 'Enceladus',
		theme: '샘',
		note: '얼음 아래에 바다가 있고, 이따금 솟는다.',
		distFrac: 0.201, // a=3.95 Rs
		T: 20, // 1.37일
		size: 4,
		color: '#e8f0f2', // 태양계에서 가장 밝은 표면
		entries: []
	},
	{
		key: 'tethys',
		name: 'Tethys',
		theme: '흐름',
		note: '거의 전부가 얼음 — 흘렀던 것들의 기록.',
		distFrac: 0.212, // a=4.89 Rs
		T: 28, // 1.89일
		size: 5,
		color: '#cfd4d6',
		entries: []
	},
	{
		key: 'dione',
		name: 'Dione',
		theme: '곁',
		note: '늘 같은 얼굴로 토성을 바라보며 돈다.',
		distFrac: 0.225, // a=6.26 Rs
		T: 41, // 2.74일
		size: 5,
		color: '#b9bec4',
		entries: []
	},
	{
		key: 'rhea',
		name: 'Rhea',
		theme: '품',
		note: '삼켜진 아이들을 살려낸 어머니의 이름.',
		distFrac: 0.246, // a=8.75 Rs
		T: 67, // 4.52일
		size: 6,
		color: '#b3ada6',
		entries: []
	},
	{
		key: 'titan',
		name: 'Titan',
		theme: '심연',
		note: '대기가 너무 두꺼워 안이 보이지 않는 유일한 달.',
		distFrac: 0.315, // a=20.3 Rs
		T: 238, // 15.95일
		size: 10,
		color: '#cfa66a', // 주황 안개
		entries: []
	},
	{
		key: 'iapetus',
		name: 'Iapetus',
		theme: '양면',
		note: '한쪽은 눈처럼 희고, 한쪽은 밤처럼 검다.',
		distFrac: 0.45, // a=59.1 Rs — 홀로 먼 방랑자
		T: 1181, // 79.3일 — 거의 멈춘 시간
		size: 6,
		color: '#8a8378',
		entries: []
	}
];
