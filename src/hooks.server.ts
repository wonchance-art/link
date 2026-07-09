import type { Handle } from '@sveltejs/kit';
import { langFromAcceptLanguage, resolveLang } from '$lib/i18n/lang';

// SSR 시점 언어 결정: ?lang 쿼리 우선, 없으면 Accept-Language 헤더.
// html lang attribute와 페이지 콘텐츠(locals.lang)가 같은 값을 쓰게 함.
export const handle: Handle = async ({ event, resolve }) => {
	const fallback = langFromAcceptLanguage(event.request.headers.get('accept-language'));
	const lang = resolveLang(event.url.searchParams.get('lang'), fallback);
	event.locals.lang = lang;
	return resolve(event, {
		transformPageChunk: ({ html }) => html.replace('%lang%', lang)
	});
};
