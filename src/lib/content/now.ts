import type { Lang } from '$lib/i18n/lang';

// "지금" 영역. 자주 갱신하면 사이트가 살아있어 보임.

type NowData = {
	updatedLabel: string;
	body: string;
};

export const now: Record<Lang, NowData> = {
	ko: {
		updatedLabel: '6월 5일',
		body: '부산살이중. 저녁 산책길에 마주친 노을이 오래도록 따라옵니다.'
	},
	en: {
		updatedLabel: 'June 5',
		body: 'Living in Busan. The sunset I met on an evening walk stays with me for a long while.'
	}
};
