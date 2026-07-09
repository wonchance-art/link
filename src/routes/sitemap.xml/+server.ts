import { planetContent } from '$lib/content/planets';
import type { RequestHandler } from './$types';

// 전체 라우트 사이트맵 — 요청 origin 기준이라 도메인 변경에도 안전
export const GET: RequestHandler = ({ url }) => {
	const paths = [
		'/',
		'/works',
		'/sun',
		'/moon',
		'/sea',
		'/land',
		...planetContent.map((p) => `/${p.key}`)
	];
	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map((p) => `\t<url><loc>${url.origin}${p}</loc></url>`).join('\n')}
</urlset>`;
	return new Response(body, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'public, max-age=3600'
		}
	});
};
