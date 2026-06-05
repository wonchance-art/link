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
		{
			title: '언어 학습 웹',
			description: '여러 언어를 천천히 익히는 방식을 모은 작은 노트.',
			date: '준비 중'
		},
		{
			title: '영어 학습 웹',
			description: '영어 문장을 글쓰기로 익혀 가는 일지.',
			date: '준비 중'
		}
	],
	en: [
		{
			title: 'Language learning',
			description: 'A small notebook of slow ways to learn languages.',
			date: 'coming soon'
		},
		{
			title: 'English learning',
			description: 'A journal of learning English through writing.',
			date: 'coming soon'
		}
	]
};
