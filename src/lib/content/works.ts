import type { Lang } from '$lib/i18n/lang';

// 본인이 만드는 주제별 사이트들. 외부 URL로 연결.
// 사이트가 생기면 href와 description을 채우면 됨.

export type Work = {
	title: string;
	description?: string; // 무엇에 관한 사이트인지 한 줄
	date?: string; // 'YYYY.MM' 또는 '진행 중' / '준비 중'
	href?: string; // 없으면 비활성 카드로 표시
};

export const works: Record<Lang, Work[]> = {
	ko: [
		{ title: '언어 학습 웹', date: '준비 중' },
		{ title: '영어 학습 웹', date: '준비 중' }
	],
	en: [
		{ title: 'Language learning', date: 'coming soon' },
		{ title: 'English learning', date: 'coming soon' }
	]
};
