// 위성계 공통 타입 — 토성(chronicle)·화성(shadows)·목성(principles)이 공유.
//
// entries가 배열이면 "서랍"(글이 담김, 비면 빈 서랍 문구),
// entries가 없으면(note-only) 위성 자체가 완결된 시적 오브제 — 카드에 note만 놓인다.

export type MoonEntry = {
	date?: string; // 'YYYY.MM' 등 자유 형식
	title?: string;
	text: string;
};

export type MoonDef = {
	key: string;
	name: string; // 실제 위성명
	theme: string; // 키워드 — 서랍(또는 오브제)의 이름
	note: string; // 위성의 실제 성격 한 줄
	distFrac: number; // 시각 궤도 반경 (화면 최소변 대비)
	T: number; // 공전 주기(초) — 실제 비율 유지
	size: number; // 점 지름 px
	color: string; // 실제 표면 인상
	entries?: MoonEntry[];
};
