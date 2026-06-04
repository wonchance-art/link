<script lang="ts">
	import { page } from '$app/state';

	import { resolveLang } from '$lib/i18n/lang';
	import { profile } from '$lib/content/profile';
	import { links } from '$lib/content/links';
	import { now } from '$lib/content/now';
	import { guestbookSeed, guestbookUI } from '$lib/content/guestbook';

	import Hero from '$lib/components/Hero.svelte';
	import About from '$lib/components/About.svelte';
	import Links from '$lib/components/Links.svelte';
	import Now from '$lib/components/Now.svelte';
	import Guestbook from '$lib/components/Guestbook.svelte';
	import Footer from '$lib/components/Footer.svelte';

	import { fadeIn } from '$lib/actions/fadeIn';

	const lang = $derived(resolveLang(page.url.searchParams.get('lang')));
	const p = $derived(profile[lang]);
	const l = $derived(links[lang]);
	const n = $derived(now[lang]);
	const gbUI = $derived(guestbookUI[lang]);

	// og/description은 *...* 마크업을 벗겨낸 본문.
	const description = $derived(p.tag.replace(/\*/g, ''));

	// og:image는 절대 URL이 안전 (카톡·트위터 호환).
	const ogUrl = $derived(`${page.url.origin}/og?lang=${lang}`);
</script>

<svelte:head>
	<title>{p.name} · 글방</title>
	<meta name="description" content={description} />
	<meta property="og:title" content="{p.name} · 글방" />
	<meta property="og:description" content={description} />
	<meta property="og:type" content="website" />
	<meta property="og:image" content={ogUrl} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:image" content={ogUrl} />
</svelte:head>

<main class="page">
	<div use:fadeIn>
		<Hero name={p.name} nameEn={p.nameEn} tag={p.tag} />
	</div>
	<div use:fadeIn>
		<About body={p.about} />
	</div>
	<div use:fadeIn>
		<Links items={l} />
	</div>
	<div use:fadeIn>
		<Now updatedLabel={n.updatedLabel} body={n.body} />
	</div>
	<div use:fadeIn>
		<Guestbook entries={guestbookSeed} ui={gbUI} />
	</div>
	<Footer {lang} />
</main>

<style>
	.page {
		max-width: var(--col-width);
		margin: 0 auto;
		padding: 80px 32px 64px;
	}
	@media (max-width: 640px) {
		.page {
			padding: 56px 24px 48px;
		}
	}
</style>
