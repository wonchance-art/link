<script lang="ts">
	import { page } from '$app/state';

	import { resolveLang } from '$lib/i18n/lang';
	import { profile } from '$lib/content/profile';
	import { works } from '$lib/content/works';
	import { links } from '$lib/content/links';
	import { now } from '$lib/content/now';

	import Hero from '$lib/components/Hero.svelte';
	import Mark from '$lib/components/Mark.svelte';
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
	const title = $derived(`${p.name} — ${p.subtitle}`);

	const personSchema = $derived({
		'@context': 'https://schema.org',
		'@type': 'Person',
		name: p.name,
		alternateName: lang === 'ko' ? 'Won Chaeyeon' : '원채연',
		url: page.url.origin,
		description,
		inLanguage: lang === 'ko' ? 'ko-KR' : 'en-US',
		sameAs: ['https://instagram.com/won_cy_', 'https://blog.naver.com/won_cy_']
	});
	const personSchemaStr = $derived(JSON.stringify(personSchema));
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
	<meta property="og:site_name" content={p.subtitle} />
	<meta property="og:url" content={page.url.toString()} />
	<meta property="og:locale" content={lang === 'ko' ? 'ko_KR' : 'en_US'} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:image" content={ogUrl} />
	{@html `<script type="application/ld+json">${personSchemaStr}</script>`}
</svelte:head>

<main class="page">
	<Hero profile={p} />

	<section class="block" use:fadeIn={{ delay: 0 }}>
		<Mark index="01" ko="소개" en="About" {lang} />
		<About body={p.about} />
	</section>

	<section class="block" use:fadeIn={{ delay: 0 }}>
		<Mark index="02" ko="지금" en="Now" {lang} />
		<Now updatedLabel={n.updatedLabel} body={n.body} />
	</section>

	<section class="block major" use:fadeIn={{ delay: 0 }}>
		<Mark index="03" ko="작업" en="Works" {lang} />
		<Works items={w} />
	</section>

	<section class="block" use:fadeIn={{ delay: 0 }}>
		<Mark index="04" ko="그 외" en="Elsewhere" {lang} />
		<Links items={l} />
	</section>

	<Footer {lang} />
</main>

<style>
	.page {
		max-width: 720px;
		margin: 0 auto;
		padding: clamp(56px, 10vw, 104px) clamp(24px, 6vw, 56px) 72px;
		position: relative;
		z-index: 1;
	}
	.block {
		margin-top: clamp(64px, 11vw, 104px);
	}
	.block.major {
		margin-top: clamp(88px, 14vw, 144px);
	}
</style>
