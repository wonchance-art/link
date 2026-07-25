import { redirect, error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';

// Sveltia/Decap CMS의 GitHub OAuth 1단계 — 팝업이 여기로 오면 GitHub 인가 화면으로 보낸다.
// 필요 환경변수: GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET (Vercel 프로젝트 설정)
export const GET: RequestHandler = ({ url, cookies }) => {
	const clientId = env.GITHUB_CLIENT_ID;
	if (!clientId) {
		error(500, 'GITHUB_CLIENT_ID가 설정되지 않았습니다 — docs/ADMIN.md의 설정 절차를 따라주세요.');
	}
	const state = crypto.randomUUID();
	cookies.set('oauth_state', state, {
		path: '/api',
		httpOnly: true,
		sameSite: 'lax',
		secure: url.protocol === 'https:',
		maxAge: 600
	});
	const authorize = new URL('https://github.com/login/oauth/authorize');
	authorize.searchParams.set('client_id', clientId);
	authorize.searchParams.set('scope', 'repo,user');
	authorize.searchParams.set('state', state);
	redirect(302, authorize.toString());
};
