import type { Lang } from '$lib/i18n/lang';

// Hero · About에 표시되는 정체성 데이터. 언어별로 분리.
// tag 안의 *...* 부분은 자동으로 <em>으로 강조됨.

type ProfileData = {
	name: string;
	nameEn: string;
	tag: string;
	about: string;
};

export const profile: Record<Lang, ProfileData> = {
	ko: {
		name: '이채연',
		nameEn: 'Chaeyeon · 글방',
		tag: '글을 쓰고 읽으며 언어를 공부합니다. 사람과 자연, 그리고 사람과 사람 사이의 *깊은 연대*에 마음이 머뭅니다.',
		about: '천천히 읽고 천천히 씁니다. 풀잎 위에 비친 하늘처럼, 글도 여러 결이 어우러지기를 바랍니다.'
	},
	en: {
		name: 'Chaeyeon',
		nameEn: '이채연 · 글방',
		tag: 'I write and read; I study language. My heart lingers in *the quiet bonds* between people and nature, between people and people.',
		about: 'Slowly I read, slowly I write — I hope the words gather many layers, like a sky reflected on grass.'
	}
};
