import type { Lang } from '$lib/i18n/lang';

// "지금" 영역. 자주 갱신하면 사이트가 살아있어 보임.

type NowData = {
	updatedLabel: string;
	body: string;
};

export const now: Record<Lang, NowData> = {
	ko: {
		updatedLabel: '6월 5일',
		body: '도연명의 「귀거래사」를 다시 읽고 있어요. 마당에 토마토 모종 둘. 비 오는 오후를 좋아하게 됐습니다.'
	},
	en: {
		updatedLabel: 'June 5',
		body: 'Rereading Tao Yuanming\'s "Return to My Garden." Two tomato seedlings in the yard. I\'ve grown to love rainy afternoons.'
	}
};
