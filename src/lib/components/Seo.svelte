<script lang="ts">
	import { page } from '$app/state';

	type Props = { title: string; description: string };
	let { title, description }: Props = $props();

	// 쿼리 제거한 canonical — ?lang= 중복 콘텐츠 방지
	const canonical = $derived(`${page.url.origin}${page.url.pathname}`);
	const ogImg = $derived(`${page.url.origin}/og?lang=ko`);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={canonical} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:type" content="website" />
	<meta property="og:image" content={ogImg} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:site_name" content="Open Chaence" />
	<meta property="og:url" content={canonical} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:image" content={ogImg} />
</svelte:head>
