// 행성 콘텐츠 단일 소스 — 우주(Cosmos)의 점 색과 각 행성 페이지(Realm)가 함께 사용.
// color는 NASA 텍스처 평균 색감(우주 점) = 페이지 accent → 확대→진입 색 연속성 보장.

export type PlanetContent = {
	key: string; // 라우트 slug (/mercury …)
	name: string; // 한국어 이름
	symbol: string; // 그리스어 상징 — 페이지 theme
	poem: string; // 페이지의 시 한 줄
	color: string; // 점 색 · 페이지 accent 공용
};

export const planetContent: PlanetContent[] = [
	{
		key: 'mercury',
		name: '수성',
		symbol: 'Hermes',
		poem: '전령. 사이와 사이를 잇는, 가장 빠른 걸음.',
		color: '#9a9893'
	},
	{
		key: 'venus',
		name: '금성',
		symbol: 'Eros',
		poem: '끌림. 어떤 것을 향해 마음이 기우는 일.',
		color: '#e5be80'
	},
	{
		key: 'mars',
		name: '화성',
		symbol: 'Thymos',
		poem: '기개. 나를 앞으로 밀어붙이는 의지.',
		color: '#b76248'
	},
	{
		key: 'jupiter',
		name: '목성',
		symbol: 'Nomos',
		poem: '질서. 흩어지려는 것들을 붙드는 법.',
		color: '#b3ac9f'
	},
	{
		key: 'saturn',
		name: '토성',
		symbol: 'Chronos',
		poem: '시간. 쌓이고 잊히고, 그래도 남는 자리.',
		color: '#d0c0a4'
	}
];

export const planetBySlug = (slug: string) => planetContent.find((p) => p.key === slug);
