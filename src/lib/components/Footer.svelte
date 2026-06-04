<script lang="ts">
	import type { Lang } from '$lib/i18n/lang';

	type Props = { lang: Lang };
	let { lang }: Props = $props();
</script>

<footer class="foot">
	<span>© 2026 · chaeyeon</span>
	<span class="lang">
		<a href="?" class:on={lang === 'ko'} data-sveltekit-noscroll>한국어</a>
		<span class="sep">·</span>
		<a href="?lang=en" class:on={lang === 'en'} data-sveltekit-noscroll>EN</a>
		<a class="rss" href="/rss.xml">RSS</a>
	</span>
</footer>

<style>
	.foot {
		margin-top: 80px;
		padding-top: 28px;
		border-top: 1px solid var(--line);
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 12px;
		color: var(--ink-faint);
		letter-spacing: 0.02em;
	}
	.lang a {
		color: var(--ink-muted);
		transition: color 200ms ease;
	}
	.lang a.on {
		color: var(--accent);
		font-weight: 600;
	}
	.lang .sep {
		padding: 0 8px;
		color: var(--ink-faint);
	}
	.lang .rss {
		margin-left: 18px;
	}
	.lang a:hover {
		color: var(--accent);
	}
</style>
