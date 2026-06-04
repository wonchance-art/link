<script lang="ts">
	import { onNavigate } from '$app/navigation';
	import '$lib/styles/tokens.css';
	import '$lib/styles/global.css';
	import favicon from '$lib/assets/favicon.svg';

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
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
