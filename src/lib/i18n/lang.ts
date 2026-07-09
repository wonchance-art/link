export type Lang = 'ko' | 'en';

export const LANGS = ['ko', 'en'] as const;

// ?lang= 쿼리가 명시되면 그 값, 아니면 fallback(기본 ko)
export function resolveLang(value: string | null | undefined, fallback: Lang = 'ko'): Lang {
	if (value === 'en') return 'en';
	if (value === 'ko') return 'ko';
	return fallback;
}

// Accept-Language 헤더 → 기본 언어. 첫 선호가 한국어면 ko, 아니면 en.
export function langFromAcceptLanguage(header: string | null): Lang {
	if (!header) return 'ko';
	return /^\s*ko\b/i.test(header) ? 'ko' : 'en';
}
