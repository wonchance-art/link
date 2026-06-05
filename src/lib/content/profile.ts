import type { Lang } from '$lib/i18n/lang';

// Hero에 표시되는 정체성.
// subtitle = "Open Chaence" — 사이트 우산. 양 언어 공통.
// tag 안의 *...*는 자동으로 <em>으로 강조됨.

export type ProfileData = {
	name: string;
	subtitle: string;
	tag: string;
	about: string;
	location: string;
	field: string;
	updated: string;
};

export const profile: Record<Lang, ProfileData> = {
	ko: {
		name: '원채연',
		subtitle: 'Open Chaence',
		tag: '글을 쓰고 읽으며 언어를 공부합니다. 사람과 자연, 그리고 사람과 사람 사이의 *깊은 연대*에 마음이 머뭅니다.',
		about: '천천히 읽고 천천히 씁니다. 풀잎 위에 비친 하늘처럼, 글도 *여러 결이 어우러지기*를 바랍니다. 한국어와 영어, 그 사이의 옅은 그늘을 들여다보며 매일 한두 문장을 옮겨 적습니다.',
		location: '부산, 대한민국',
		field: '글 · 언어',
		updated: '2026.06'
	},
	en: {
		name: 'Won Chaeyeon',
		subtitle: 'Open Chaence',
		tag: 'I write and read; I study language. My heart lingers in *the quiet bonds* between people and nature, between people and people.',
		about: 'Slowly I read, slowly I write — I hope the words *gather many layers*, like a sky reflected on grass. Between Korean and English, and the soft shade between, I copy a sentence or two each day.',
		location: 'Busan, KR',
		field: 'Writing · Language',
		updated: '2026.06'
	}
};
