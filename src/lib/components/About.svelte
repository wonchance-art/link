<script lang="ts">
	import type { Lang } from '$lib/i18n/lang';

	type Props = { body: string; lang: Lang };
	let { body, lang }: Props = $props();

	const main = $derived(lang === 'ko' ? '소개' : 'About');
	const sub = $derived(lang === 'ko' ? 'About' : '소개');
</script>

<section class="sect">
	<h2 class="sect-title">
		{main}
		<span class="sub">{sub}</span>
	</h2>
	<p class="body">{body}</p>
</section>

<style>
	.body {
		font-size: 18px;
		line-height: 1.9;
		color: var(--ink);
		margin: 0;
		max-width: 480px;
	}
	.body::first-letter {
		font-family: var(--font-serif);
		font-style: italic;
		font-size: 2.6em;
		font-weight: 500;
		line-height: 1;
		float: left;
		margin: 6px 12px -4px 0;
		color: var(--accent-deep);
		font-variation-settings: 'opsz' 144;
	}
	:global(html[lang='ko']) .body::first-letter {
		font-style: normal;
		font-weight: 600;
		letter-spacing: -0.02em;
	}
</style>
