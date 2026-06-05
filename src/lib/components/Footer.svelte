<script lang="ts">
	import type { Lang } from '$lib/i18n/lang';

	type Props = { lang: Lang };
	let { lang }: Props = $props();
</script>

<footer class="foot">
	<p class="brand"><span class="stroke" aria-hidden="true"></span>Open Chaence</p>
	<div class="meta">
		<span class="copy">© 2026 · chaeyeon</span>
		<span class="lang">
			<a href="?" class:on={lang === 'ko'} data-sveltekit-noscroll>한국어</a>
			<span class="sep">·</span>
			<a href="?lang=en" class:on={lang === 'en'} data-sveltekit-noscroll>EN</a>
		</span>
		<a class="rss" href="/rss.xml">RSS</a>
	</div>
</footer>

<style>
	.foot {
		margin-top: clamp(96px, 16vw, 168px);
		padding-top: 40px;
		border-top: 1px solid var(--line);
		display: flex;
		flex-direction: column;
		gap: 28px;
	}

	.brand {
		display: flex;
		align-items: center;
		gap: 16px;
		font-family: var(--font-serif);
		font-style: italic;
		font-weight: 400;
		font-size: 24px;
		color: var(--accent);
		letter-spacing: 0.004em;
		font-variation-settings: 'opsz' 144;
		font-feature-settings: 'liga', 'dlig';
		margin: 0;
		line-height: 1;
	}
	.brand .stroke {
		display: inline-block;
		width: 40px;
		height: 1.5px;
		flex: 0 0 auto;
		border-radius: 2px;
		background: linear-gradient(90deg, var(--accent), var(--accent-pond));
	}

	.meta {
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 12px;
		color: var(--ink-faint);
		letter-spacing: 0.04em;
	}
	.lang {
		display: flex;
		align-items: center;
	}
	.lang a {
		color: var(--ink-muted);
		transition: color 200ms ease;
	}
	.lang a.on {
		color: var(--accent);
		font-weight: 600;
	}
	.lang a:hover {
		color: var(--accent);
	}
	.lang .sep {
		padding: 0 8px;
		color: var(--ink-faint);
	}
	.rss {
		color: var(--ink-muted);
	}
	.rss:hover {
		color: var(--accent);
	}
</style>
