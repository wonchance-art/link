import type { Lang } from '$lib/i18n/lang';

// 본인이 만드는 주제별 사이트들. 외부 URL로 연결.
// 사이트가 생기면 여기에 한 줄씩 추가하면 됨.

export type Work = {
	title: string;
	description: string; // 무엇에 관한 사이트인지 한 줄
	date?: string; // 'YYYY.MM' 또는 '진행 중'
	href: string;
};

export const works: Record<Lang, Work[]> = {
	ko: [
		{
			title: '첫 번째 아카이브',
			description: '아직 채워질 자리 — 주제와 한 줄 설명이 들어감.',
			date: '준비 중',
			href: '#'
		},
		{
			title: '두 번째 아카이브',
			description: '아직 채워질 자리.',
			date: '준비 중',
			href: '#'
		}
	],
	en: [
		{
			title: 'First archive',
			description: 'A placeholder — topic and a one-line description goes here.',
			date: 'coming soon',
			href: '#'
		},
		{
			title: 'Second archive',
			description: 'A placeholder.',
			date: 'coming soon',
			href: '#'
		}
	]
};
