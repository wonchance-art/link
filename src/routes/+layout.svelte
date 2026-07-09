<script lang="ts">
	import { onNavigate } from '$app/navigation';
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

	// 언어 토글 시 부드러운 cross-fade. Chromium 지원, 그 외는 자동 폴백.
	onNavigate((navigation) => {
		if (!document.startViewTransition) return;
		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});

	// 스크롤에 따라 --scroll-progress 갱신 → 배경 그라데이션 미세 시프트.
	$effect(() => scrollProgress());
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
