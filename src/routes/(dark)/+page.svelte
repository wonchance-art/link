<script lang="ts">
	import { page } from '$app/state';
	import Cosmos from '$lib/components/Cosmos.svelte';

	let { data } = $props();

	const ogUrl = $derived(`${page.url.origin}/og?lang=ko`);
	const title = '원채연 — Open Chaence';
	const description = '어둠 속 몇 개의 빛. 태양과 지구와 달 — 이성, 자기, 감성.';
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:type" content="website" />
	<meta property="og:image" content={ogUrl} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:site_name" content="Open Chaence" />
	<meta property="og:url" content="{page.url.origin}{page.url.pathname}" />
	<link rel="canonical" href="{page.url.origin}{page.url.pathname}" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:image" content={ogUrl} />
</svelte:head>

<Cosmos landPath={data.landPath} />
