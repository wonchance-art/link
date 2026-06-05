<script lang="ts">
	import type { Lang } from '$lib/i18n/lang';

	type Props = { lang: Lang };
	let { lang }: Props = $props();
</script>

<footer class="foot">
	<div class="sign">
		<span class="brand">Open Chaence</span>
		<span class="mark-dots" aria-hidden="true">
			<span class="dot"></span>
			<span class="dot"></span>
			<span class="dot"></span>
		</span>
	</div>
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
		margin-top: 128px;
		padding-top: 48px;
		border-top: 1px solid var(--line);
		display: flex;
		flex-direction: column;
		gap: 26px;
	}

	/* 상단 사인 — 큰 시그니처 brand + 3색 점 */
	.sign {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 16px;
	}
	.brand {
		font-family: var(--font-serif);
		font-style: italic;
		font-weight: 400;
		font-size: 36px;
		color: var(--accent);
		letter-spacing: -0.01em;
		font-variation-settings: 'opsz' 144;
		font-feature-settings: 'liga', 'dlig';
		line-height: 1;
	}
	.mark-dots {
		display: flex;
		gap: 6px;
		flex: 0 0 auto;
	}
	.mark-dots .dot {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		display: inline-block;
	}
	.mark-dots .dot:nth-child(1) {
		background: var(--accent);
		opacity: 0.75;
	}
	.mark-dots .dot:nth-child(2) {
		background: var(--accent-pond);
		opacity: 0.65;
	}
	.mark-dots .dot:nth-child(3) {
		background: var(--ink-faint);
		opacity: 0.5;
	}

	/* 하단 메타 */
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

	@media (max-width: 640px) {
		.foot {
			margin-top: 96px;
			padding-top: 40px;
		}
		.brand {
			font-size: 30px;
		}
	}
</style>
