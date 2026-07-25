import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';

// GitHub OAuth 2단계 — code를 토큰으로 교환하고, CMS 팝업 규약(postMessage)으로 전달.
// 규약: 팝업이 'authorizing:github'를 보내면, opener가 응답하고, 성공 메시지를 돌려준다.

function popupHtml(payload: string): Response {
	const html = `<!doctype html><html><body><script>
(function () {
	function receiveMessage() {
		window.opener.postMessage(${JSON.stringify(payload)}, '*');
		window.removeEventListener('message', receiveMessage, false);
	}
	window.addEventListener('message', receiveMessage, false);
	window.opener.postMessage('authorizing:github', '*');
})();
</script>인증 처리 중…</body></html>`;
	return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}

export const GET: RequestHandler = async ({ url, cookies }) => {
	const clientId = env.GITHUB_CLIENT_ID;
	const clientSecret = env.GITHUB_CLIENT_SECRET;
	if (!clientId || !clientSecret) {
		return popupHtml('authorization:github:error:' + JSON.stringify({ message: 'OAuth 환경변수 미설정' }));
	}
	const code = url.searchParams.get('code');
	const state = url.searchParams.get('state');
	const saved = cookies.get('oauth_state');
	cookies.delete('oauth_state', { path: '/api' });
	if (!code || !state || state !== saved) {
		return popupHtml('authorization:github:error:' + JSON.stringify({ message: 'state 불일치 또는 code 없음' }));
	}
	const res = await fetch('https://github.com/login/oauth/access_token', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
		body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code })
	});
	const data = (await res.json()) as { access_token?: string; error_description?: string };
	if (!data.access_token) {
		return popupHtml(
			'authorization:github:error:' + JSON.stringify({ message: data.error_description ?? '토큰 교환 실패' })
		);
	}
	return popupHtml(
		'authorization:github:success:' + JSON.stringify({ token: data.access_token, provider: 'github' })
	);
};
