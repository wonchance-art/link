<script lang="ts">
	import { page } from '$app/state';

	import { resolveLang } from '$lib/i18n/lang';
	import { profile } from '$lib/content/profile';
	import { works } from '$lib/content/works';
	import { links } from '$lib/content/links';
	import { now } from '$lib/content/now';

	import Hero from '$lib/components/Hero.svelte';
	import About from '$lib/components/About.svelte';
	import Now from '$lib/components/Now.svelte';
	import Works from '$lib/components/Works.svelte';
	import Links from '$lib/components/Links.svelte';
	import Footer from '$lib/components/Footer.svelte';

	import { fadeIn } from '$lib/actions/fadeIn';

	const lang = $derived(resolveLang(page.url.searchParams.get('lang')));
	const p = $derived(profile[lang]);
	const w = $derived(works[lang]);
	const l = $derived(links[lang]);
	const n = $derived(now[lang]);

	const description = $derived(p.tag.replace(/\*/g, ''));
	const ogUrl = $derived(`${page.url.origin}/og?lang=${lang}`);

	// 사이트 우산(Open Chaence)을 title에도 노출.
	const title = $derived(`${p.name} — ${p.subtitle}`);
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
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:image" content={ogUrl} />
</svelte:head>

<main class="page">
	<div use:fadeIn={{ delay: 0 }}>
		<Hero name={p.name} subtitle={p.subtitle} tag={p.tag} />
	</div>
	<div use:fadeIn={{ delay: 90 }}>
		<About body={p.about} />
	</div>
	<div use:fadeIn={{ delay: 180 }}>
		<Now updatedLabel={n.updatedLabel} body={n.body} />
	</div>
	<div use:fadeIn={{ delay: 260 }}>
		<Works items={w} />
	</div>
	<div use:fadeIn={{ delay: 340 }}>
		<Links items={l} />
	</div>
	<Footer {lang} />
</main>

<style>
	.page {
		max-width: var(--col-width);
		margin: 0 auto;
		padding: 96px 40px 72px;
		position: relative;
		z-index: 1;
	}
	@media (max-width: 640px) {
		.page {
			padding: 64px 24px 56px;
		}
	}
</style>
