<script lang="ts">
	import { page } from '$app/state';

	import { resolveLang } from '$lib/i18n/lang';
	import { works } from '$lib/content/works';
	import { links } from '$lib/content/links';

	import Mark from '$lib/components/Mark.svelte';
	import Works from '$lib/components/Works.svelte';
	import Links from '$lib/components/Links.svelte';
	import Footer from '$lib/components/Footer.svelte';

	import { fadeIn } from '$lib/actions/fadeIn';

	const lang = $derived(resolveLang(page.url.searchParams.get('lang')));
	const w = $derived(works[lang]);
	const l = $derived(links[lang]);
</script>

<svelte:head>
	<title>Wonnit — 원채연</title>
	<meta name="description" content="원채연이 빚어낸 것들. Won — we won it." />
</svelte:head>

<main class="page">
	<header class="hero">
		<a class="back" href="/">← 우주</a>
		<h1 class="wonnit"><span class="stroke" aria-hidden="true"></span>Wonnit</h1>
		<p class="meaning">생각과 감정이 빚어낸 것들 — <i>Won, we won it.</i></p>
	</header>

	<section class="block major" use:fadeIn={{ delay: 0 }}>
		<Mark index="01" ko="작업" en="Works" {lang} />
		<Works items={w} />
	</section>

	<section class="block" use:fadeIn={{ delay: 0 }}>
		<Mark index="02" ko="그 외" en="Elsewhere" {lang} />
		<Links items={l} />
	</section>

	<Footer {lang} />
</main>

<style>
	.page {
		max-width: 720px;
		margin: 0 auto;
		padding: clamp(48px, 8vw, 88px) clamp(24px, 6vw, 56px) 72px;
		position: relative;
		z-index: 1;
	}
	.hero {
		margin-bottom: clamp(72px, 12vw, 120px);
	}
	.back {
		display: inline-block;
		font-size: 13px;
		letter-spacing: 0.04em;
		color: var(--ink-faint);
		margin-bottom: clamp(28px, 6vw, 56px);
		transition: color 220ms ease;
	}
	.back:hover {
		color: var(--accent);
	}
	.wonnit {
		display: flex;
		align-items: center;
		gap: 18px;
		font-family: var(--font-sans);
		font-size: clamp(52px, 11vw, 116px);
		font-weight: 500;
		line-height: 0.92;
		letter-spacing: -0.05em;
		color: var(--ink);
		margin: 0;
	}
	.wonnit .stroke {
		width: clamp(28px, 5vw, 52px);
		height: 2px;
		flex: 0 0 auto;
		border-radius: 2px;
		background: linear-gradient(90deg, var(--accent), var(--accent-pond));
	}
	.meaning {
		font-size: clamp(15px, 2vw, 18px);
		color: var(--ink-muted);
		margin: 24px 0 0;
		line-height: 1.7;
	}
	.meaning i {
		font-family: var(--font-serif);
		font-style: italic;
		color: var(--accent);
	}
	.block {
		margin-top: clamp(64px, 11vw, 104px);
	}
	.block.major {
		margin-top: 0;
	}
</style>
