export type Link = {
	label: string;
	meta?: string;
	href: string;
};

export const links: Link[] = [
	{ label: '서재 — 읽은 책', meta: '128권', href: '#' },
	{ label: '글방 — 쓴 것', meta: '최근 6월 1일', href: '#' },
	{ label: 'Instagram', meta: '@chaeyeon', href: '#' },
	{ label: 'Email', href: 'mailto:hello@example.com' }
];
