<script lang="ts">
	import { onNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import { resolveLang } from '$lib/i18n/lang';
	// 폰트 self-host — CDN 3곳 의존 제거, 같은 오리진에서 immutable 캐시로 서빙
	import 'pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css';
	import '@fontsource-variable/fraunces/opsz.css';
	import '@fontsource-variable/fraunces/opsz-italic.css';
	import '@fontsource/noto-serif-kr/400.css';
	import '@fontsource/noto-serif-kr/500.css';
	import '@fontsource/noto-serif-kr/600.css';
	import '@fontsource/noto-serif-kr/700.css';
	import '$lib/styles/tokens.css';
	import '$lib/styles/global.css';
	import favicon from '$lib/assets/favicon.svg';
	import { scrollProgress } from '$lib/actions/scrollProgress';

	let { children } = $props();

	// View transition — 기본은 부드러운 cross-fade(언어 토글 등).
	// 우주(암흑) ↔ 지상(works, 풀숲) 사이는 '대기권 통과'로 연출:
	// 내려갈 땐 어둠이 새벽빛에 씻기고(descend), 올라갈 땐 빛이 걷히며 별이 돋는다(ascend).
	onNavigate((navigation) => {
		if (!document.startViewTransition) return;
		const toWorks = navigation.to?.url.pathname === '/works';
		const fromWorks = navigation.from?.url.pathname === '/works';
		const dir = toWorks ? 'descend' : fromWorks ? 'ascend' : null;
		if (dir) document.documentElement.dataset.vt = dir;
		return new Promise((resolve) => {
			const transition = document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
			transition.finished.finally(() => {
				delete document.documentElement.dataset.vt;
			});
		});
	});

	// 스크롤에 따라 --scroll-progress 갱신 → 배경 그라데이션 미세 시프트.
	$effect(() => scrollProgress());

	// 클라이언트 라우팅 시에도 html lang을 현재 언어와 동기화 (SSR은 hooks가 처리)
	$effect(() => {
		document.documentElement.lang = resolveLang(
			page.url.searchParams.get('lang'),
			page.data.lang ?? 'ko'
		);
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
