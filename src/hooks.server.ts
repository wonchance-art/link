import type { Handle } from '@sveltejs/kit';

// SSR 시점에 ?lang 쿼리로 html lang attribute를 결정.
// 검색엔진·스크린리더가 정확한 언어를 인식하게 함.
export const handle: Handle = async ({ event, resolve }) => {
	const lang = event.url.searchParams.get('lang') === 'en' ? 'en' : 'ko';
	return resolve(event, {
		transformPageChunk: ({ html }) => html.replace('%lang%', lang)
	});
};
