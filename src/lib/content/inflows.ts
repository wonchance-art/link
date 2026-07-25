// 바다 — 흘러들어온 것들.
//
// 우주 전체가 나의 내면이라면, 바다는 유일하게 "내가 쓰지 않은 것"이 사는 곳.
// 읽다가 데려온 문장, 받은 말, 나를 흔들고 지나간 남의 글이 여기 고인다.
//
// 추가: { text, source, date } — source는 사람·책·노래 등 출처(자유 형식, 생략 가능).
// 예시:
//   { text: '문장.', source: '누군가, 『어느 책』', date: '2026.07' }

export type Inflow = {
	text: string;
	source?: string; // 어디서 흘러왔는가
	date?: string; // 언제 흘러들었는가
};

export const inflows: Inflow[] = [];
