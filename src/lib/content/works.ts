import type { Lang } from '$lib/i18n/lang';
import data from '$content/works.json';

// 본인이 만드는 주제별 사이트들. 외부 URL로 연결.
// 데이터는 src/content/works.json — /admin(CMS)에서 편집.

export type Work = {
	title: string;
	description?: string; // 무엇에 관한 사이트인지 한 줄
	date?: string; // 'YYYY.MM' 또는 '진행 중' / '준비 중'
	href?: string; // 없으면 비활성 카드로 표시
};

export const works: Record<Lang, Work[]> = data;
