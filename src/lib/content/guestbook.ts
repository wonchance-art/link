export type GuestbookEntry = {
	name: string;
	message: string;
};

// Phase 2 (Supabase) 전까지의 더미 시드.
// Phase 2부터는 클라이언트가 Supabase에서 직접 fetch.

export const guestbookSeed: GuestbookEntry[] = [
	{ name: '풀잎', message: '오늘 글이 마음에 오래 남았어요.' },
	{ name: '유월', message: '비 오는 오후를 좋아하시다니, 저랑 비슷하네요 :)' },
	{ name: '익명', message: '좋은 하루 보내세요.' }
];
