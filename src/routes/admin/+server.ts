import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// /admin → 정적 CMS 셸로. (dev 서버는 디렉토리 index.html을 자동 해석하지 않아
// 환경 무관하게 같은 입구를 보장한다)
export const GET: RequestHandler = () => {
	redirect(307, '/admin/index.html');
};
