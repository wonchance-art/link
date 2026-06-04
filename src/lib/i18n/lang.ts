export type Lang = 'ko' | 'en';

export const LANGS = ['ko', 'en'] as const;

export function resolveLang(value: string | null | undefined): Lang {
	return value === 'en' ? 'en' : 'ko';
}
