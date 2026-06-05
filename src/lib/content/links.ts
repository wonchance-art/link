import type { Lang } from '$lib/i18n/lang';

export type Link = {
	label: string;
	meta?: string;
	href: string;
	icon?: 'instagram' | 'blog' | 'email';
};

// 외부 SNS·연락처. ko/en 공통.
const common: Link[] = [
	{
		label: 'Instagram',
		meta: '@won_cy_',
		href: 'https://instagram.com/won_cy_',
		icon: 'instagram'
	},
	{
		label: 'Blog',
		meta: 'naver blog',
		href: 'https://blog.naver.com/won_cy_',
		icon: 'blog'
	},
	{
		label: 'Email',
		meta: 'won_cy_@naver.com',
		href: 'mailto:won_cy_@naver.com',
		icon: 'email'
	}
];

export const links: Record<Lang, Link[]> = {
	ko: common,
	en: common
};
