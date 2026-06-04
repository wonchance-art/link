import type { Lang } from '$lib/i18n/lang';

export type GuestbookEntry = {
	name: string;
	message: string;
};

// Phase 2 (Supabase) 전까지의 더미 시드.
export const guestbookSeed: GuestbookEntry[] = [
	{ name: '풀잎', message: '오늘 글이 마음에 오래 남았어요.' },
	{ name: '유월', message: '비 오는 오후를 좋아하시다니, 저랑 비슷하네요 :)' },
	{ name: '익명', message: '좋은 하루 보내세요.' }
];

// UI 텍스트만 i18n. 닉네임·메시지는 방문자가 쓴 그대로 유지.
type GuestbookUI = {
	placeholder: string;
	submit: string;
};

export const guestbookUI: Record<Lang, GuestbookUI> = {
	ko: {
		placeholder: '한 줄 남기고 가세요 — 닉네임은 자유로이',
		submit: '남기기'
	},
	en: {
		placeholder: 'Leave a word — any nickname is welcome',
		submit: 'Post'
	}
};
