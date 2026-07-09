import type { LayoutServerLoad } from './$types';

// hooks에서 결정한 언어를 모든 페이지 data로 전달 — 콘텐츠·html lang 일치용
export const load: LayoutServerLoad = ({ locals }) => ({ lang: locals.lang });
